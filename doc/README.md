# NestJS を使って開発してわかったこと。

## NestJS の Middleware がライブラリを認識しないことがある。

`@fastify/cookie`を使って、Guard と Middleware で Request の Cookie をパースできているか確認する。

```ts
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  await app.register(fastifyCookie);
}
```

- Middleware

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: FastifyRequest, reply: FastifyReply, next: () => void) {
    console.log('middleware', req.cookies);
    next();
  }
}
```

- Guard

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { HttpExceptionResponse } from 'src/types/http-response';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    console.log('guard', request.cookies);
    return true;
  }
}
```

- 結果

```
middleware undefined
guard { _csrf: 'xxxx' }
```

Middleware では、ライブラリが効いていない。
原因は、今のところ謎。
（NestJS に対して、ライブラリを反映しているので、Middleware は、もしかすると Express or Fastify そのままの機能を持ってきているだけなのかもしれない。。。だから、ライブラリが効かないのかも？）

## エラーハンドリングで思ったこと。

NestJS のエラーは Exception Filter でハンドリングを行う。
たとえば、HttpException を発生させたい時、以下のように書いて throw()させる必要がある。

```ts
throw new HttpException(
  {
    statusCode: HttpStatus.FORBIDDEN,
    code: 'APP_UNKNOWN_ERROR',
    error: 'This is a custom message',
  },
  HttpStatus.FORBIDDEN,
);
```

この`new HttpException`は厄介で、型を指定することができない。（ジェネリクスで指定できない）
つまり、エラーのフォーマットを固定化できない。

なので、ラッパーオブジェクトを作ってやると良さそう。

```ts
// http-exception-response.ts
import { HttpException } from '@nestjs/common';

export class HttpExceptionResponse extends HttpException {
  constructor(
    readonly statusCode: number = 500,
    readonly code: string = 'APP_UNKNOWN_ERROR',
    readonly error: string = 'unknown error',
  ) {
    super(
      {
        statusCode,
        code,
        error,
      },
      statusCode,
    );
  }
}
```

こうすることで、エラーフォーマットが決まってスッキリするだろう。。。

```ts
// 使う時
throw new HttpExceptionResponse(
  500,
  'APP_CSRF_NOT_SECRET',
  'no secret information at CsrfGuard.',
);
```

## NestJS の CSRF 対応

NestJS の CSRF 対応は、基本的に（Express or Fastify の）ライブラリを使う。

https://docs.nestjs.com/security/csrf

ただし、Express or Fastify のライブラリのすべての機能がそのまま NestJS で使えるとは限らない。
たとえば、Fastify の CSRF ライブラリ（'@fastify/csrf-protection'）を使ってみましょう。

- Fastify の場合

```ts
import Fastify from 'fastify';
import fastifyCsrf from '@fastify/csrf-protection';

const fastify = Fastify({ logger: true });
fastify.register(fastifyCsrf);
fastify.csrfProtection; // csrfProtectionメソッドが使用可能。
```

- NestJS の場合

```ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({ logger: true }),
);
await app.register(fastifyCsrf);
app.csrfProtection; // 使えない。。。。
```

なぜか？

おそらく、NestJS の 1 つ 1 つの機能は、疎結合で実装するからです。
機能ごとの依存関係はモジュールを用いて解決します。

このルールに合わないようなライブラリの機能はおそらく使えないのだと思います。

以下は、`@fastify/csrf-protection`のコードの抜粋です。
おそらくすべて（Express or Fastify の）ライブラリに言えることですが、`decorate`で呼び出すことのできる機能は使用できないでしょう。

```ts
if (sessionPlugin === '@fastify/secure-session') {
  fastify.decorateReply('generateCsrf', generateCsrfSecureSession); // <= 使用可
} else if (sessionPlugin === '@fastify/session') {
  fastify.decorateReply('generateCsrf', generateCsrfSession); // <= 使用可
} else {
  fastify.decorateReply('generateCsrf', generateCsrfCookie); // <= 使用可
}

fastify.decorate('csrfProtection', csrfProtection); // <= 使用不可
```

ではどうするのか？

1. `generateCsrf`は使用可能なので、そのまま使う。
2. `csrfProtection`は使用不可なので、自前で実装する。

- 1. `generateCsrf`は使用可能なので、そのまま使う。

```ts
// app.service.ts
export class AppService {
  async confirm(rep: FastifyReply) {
    return {
      // generateCsrf を使ってCsrfTokenを生成して、Responseを返す。
      // これを使うと、デフォルトだとCookieにも`_csrf`というKey名でトークンを埋め込まれる。
      token: rep.generateCsrf({
        httpOnly: true,
        secure: true,
      }),
    };
  }
}
```

- 2. `csrfProtection`は使用不可なので、自前で実装する。

実装箇所は、Guard が適切なような気がした。

```ts
// csrf.guard.ts
import CSRF from '@fastify/csrf';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const secret = request.cookies['_csrf'];

    if (!secret) {
      return false;
    }

    const tokens = new CSRF();
    // CookieのCSRF Token（自動埋め込み）と、Requestから取得したCSRF Token（こちらはBodyやheaders等から取得）を検証して、問題なければ`true`にする
    if (!tokens.verify(secret, getToken(request), getUserInfo(request))) {
      return false;
    }

    function getToken(req) {
      return (
        (req.body && req.body._csrf) ||
        req.headers['csrf-token'] ||
        req.headers['xsrf-token'] ||
        req.headers['x-csrf-token'] ||
        req.headers['x-xsrf-token']
      );
    }

    function getUserInfo(req) {
      return undefined;
    }

    return true;
  }
}
```
