# NestJS を使って開発してわかったことを以下に纏める。

## Prisma には、GUI ベースで DB を管理できるツールが導入されている。

以下、コマンドで GUI ベースの管理コンソールを立ち上げることができる。

```sh
npx prisma studio
```

## プロバイダーを Mock する方法

たとえば、PrismaService を Mock させたい場合、以下 2 つの方法で Mock が可能。

- （1）：　カスタムプロバイダーを作る

```ts
const mockClassCatsService = class {
  findAll() {
    return 'hello';
  }
};
const customProvider = {
  provide: PrismaService,
  useFactory: (optionsProvider) => {
    return {
      question: {
        findMany() {
          return optionsProvider.findAll();
        },
      },
    };
  },
  inject: [mockClassCatsService],
};
const module: TestingModule = await Test.createTestingModule({
  providers: [QuestionService, customProvider, mockClassCatsService],
}).compile();
```

- （2）：　そのまま jest で Mock する

```ts
(PrismaService as jest.Mock).mockImplementation(() => {
  return {
    question: {
      async findMany(): Promise<Question[]> {
        return [
          { id: 'a1', title: 'b1', question: 'b1' },
          { id: 'a2', title: 'b2', question: 'b2' },
          { id: 'a3', title: 'b3', question: 'b3' },
        ];
      },
    },
  };
});
const module: TestingModule = await Test.createTestingModule({
  providers: [QuestionService, PrismaService],
}).compile();
service = module.get<QuestionService>(QuestionService);
```

どちらの方法でも問題ないが、(2)の方法が楽だし、わかりやすい。

## NestJS でも Result 型は有効だと思う。

`throw new HttpException()`を宣言したからといって、直ぐに`Exception filter`が動くわけではない。

たとえば、サービスクラスでエラーが発生したとしても、かならずコントローラーを経由して`Exception filter`に行く。

そのため、Result 型の恩恵は十分に受けることが可能。

サービスクラスは、プロバイダーを呼ぶことが多いため、各プロバイダー側で Result 型へ変換し、サービスクラスは`if`でハンドリングする。

```ts
async findAll(): Promise<Result<Question[], HttpExceptionResponse>> {
  try {
    return new Success(await this.prisma.question.findMany());
  } catch (err) {
    if (err instanceof Error) {
      return new Failure(
        new HttpExceptionResponse(
          this.findAll.name,
          500,
          'APP_DB_ACCESS_ERROR',
          err,
        ),
      );
    }
    return new Failure(new HttpExceptionResponse(this.findAll.name));
  }
}
```

## Pipe の途中でルートハンドラを変更できない。

あたり前かもしれないが、Pipe はルートハンドラに入ったあとの、引数をセットする箇所で動作する。
そのため、Pipe でエラーを発生させて、Exception Filter 内でルートを指定しても、動かない。

そもそも、以下記述があるので、Pipe で例外がスローされた時点でコントローラーは動かないのだろう。。。

```
Pipe で例外がスローされると、その後コントローラー メソッドが実行されない
```

## エラーハンドリングについて、エラー時に HTML テンプレートを返す場合は、Express or Fastify から直接 HTML のテンプレート を Response で返す。

NestJS のエラーは Exception Filter でハンドリングを行う。
この Exception Filter の中から、HTML のテンプレート を Response で返す場合は、`@Render`デコレータが使えないので、Express or Fastify から直接 HTML のテンプレート を Response で返す。

なぜ、Exception Filter の中で`@Render`デコレータが使えない？

`@Render`には以下注意書きがあります。

```
Route handler method Decorator.  Defines a template to be rendered by the controller.
```

なので、`@Render`デコレータはコントローラーでしか機能しません。

そうなると、Exception Filter の中から、HTML のテンプレート を Response で返す場合は、Express or Fastify から直接 HTML のテンプレート を Response で返す必要があります。

## Fastify を使ってはいけないパターンがある。

複数あるかもしれないので、分かり次第追記する。。。。

### 1. サーバーから HTML を返すようなパターン。

Fastify を使うメリットは、JSON 形式の Response を返す速度にある。（たぶん。。。）
なので、HTML のテンプレート を Response で返すと、そもそもそんなにメリットはないだろう。。。（内部がどんなに早くても、HTML をジェネレートするのに時間がかかるため。。。）

それを踏まえた上で、Fastify を使いたい場合は以下に注意する。

Fastify には、HTML のテンプレート を Response で返す仕組みがデフォルトで存在しない。そのため、HTML のテンプレート を Response で返す場合は、ライブラリを使用する（`@fastify/view`）

しかし、このライブラリが NestJS のライブラリと競合して、うまく動かないケースがある。

```sh
/.../learning-nestjs/node_modules/fastify/lib/decorate.js:23
throw new FST_ERR_DEC_ALREADY_PRESENT(name)
      ^
FastifyError: The decorator 'view' has already been added!
at decorate (/.../learning-nestjs/node_modules/fastify/lib/decorate.js:23:11)
at Object.decorateFastify [as decorate] (/.../learning-nestjs/node_modules/fastify/lib/decorate.js:67:3)
at fastifyView (/.../learning-nestjs/node_modules/@fastify/view/index.js:117:11)
at Plugin.exec (/.../learning-nestjs/node_modules/avvio/plugin.js:130:19)
at Boot.loadPlugin (/.../learning-nestjs/node_modules/avvio/plugin.js:272:10)
at processTicksAndRejections (internal/process/task_queues.js:82:21)
[11:57:51] File change detected. Starting incremental compilation...
```

そもそも、NestJS には、`@Render`デコレータがあるのに、わざわざ Express or Fastify から直接 HTML のテンプレート を Response で返すパターンがあるのか？

=> [ある](#エラーハンドリングについてエラー時に-html-テンプレートを返す場合はexpress-or-fastify-から直接-html-のテンプレート-を-response-で返す)

## NestJS の Middleware がライブラリを認識しないことがある。

こちらは現在、原因不明なので、事象だけ記載しておく。

`@fastify/cookie`を使って、Guard と Middleware で Request の Cookie がパースできているか確認する。

ライブラリは、`register`を使って読み込んでおく。

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

Middleware は、Cookie のパースができておらず、ライブラリが効いていない。

原因は、今のところ謎。

もしかすると、Middleware は NestJS の機能ではなく、Express or Fastify の機能をそのまま持ってきているだけなのかもしれない。。。

であれば、NestJS に対してライブラリを適用しているので、ライブラリが効かないことも納得できる。

## エラーハンドリングについて、エラー時のフォーマットをジェネリクス等を使って指定できない。

NestJS のエラーは Exception Filter でハンドリングを行う。
たとえば、HttpException を発生させたい時は、以下のように書いて throw()させる必要がある。

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

この`new HttpException`は厄介で、型を指定することができない。（ジェネリクス等を使って型指定できない）

そのため、エラー時のフォーマットを固定化できない。

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

たとえば、Fastify の CSRF ライブラリ（'@fastify/csrf-protection'）を使ってみる。

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

おそらく、NestJS の 1 つ 1 つの機能は、疎結合で実装するから。

機能ごとの依存関係はモジュールを用いて解決する必要がある。

このルールに合わないようなライブラリの機能はおそらく使えない（のだと思う）。

以下は、`@fastify/csrf-protection`のコードの抜粋。

おそらくすべて（Express or Fastify の）ライブラリに言えることだが、`decorate`で呼び出すことのできる機能は使用できないだろう。。。

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

`generateCsrf`は使って、`csrfProtection`は自前で実装する。

`generateCsrf`は以下のようにそのまま使う。

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

`csrfProtection`は以下のように自前で実装する。

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

これで、CSRF 対応が可能。
