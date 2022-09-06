import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception.getResponse());

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    // const request = ctx.getRequest<FastifyRequest>();
    // const status = exception.getStatus();

    // fastify使うと駄目パターン。
    // サードパーティライブラリ`@fastify/view`を使うと、NestJSのものと競合するっぽい
    /*
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
    */

    // 苦肉の対応。（これくらいしかできない。。。）
    response.redirect('/questions/500');
  }
}
