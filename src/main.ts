import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
// import View from '@fastify/view';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  await app.register(fastifyCookie);
  await app.register(fastifyCsrf);
  // app.register(fastifyCsrf, { cookieOpts: { signed: true } });
  // app.register(View, {
  //   engine: {
  //     handlebars: require('hbs'),
  //   },
  //   templates: path.resolve(__dirname, '..', 'views'),
  // });

  app.useLogger(app.get(Logger));

  app.useStaticAssets({
    root: path.resolve(__dirname, '..', 'public'),
  });
  app.setViewEngine({
    engine: {
      handlebars: require('hbs'),
    },
    templates: path.resolve(__dirname, '..', 'views'),
  });

  await app.listen(3000);
}
bootstrap();
