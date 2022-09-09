import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpExceptionResponse } from 'src/types/http-exception-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: HttpExceptionResponse, host: ArgumentsHost) {
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

    // 共通処理: ログを出力する。
    this.logger.error(exception.getResponse());

    if (exception.statusCode === 404) {
      return response.status(303).redirect('/404');
    }

    if (exception.statusCode === 500) {
      switch (exception.code) {
        case 'APP_QUESTION_DB_ERROR':
        case 'APP_ANSWER_DB_ERROR':
          break;
        case 'APP_QUESTION_VALIDATION_ERROR':
        case 'APP_ANSWER_VALIDATION_ERROR':
          // Validation error時は、Validation errorの詳細をログに出す。
          this.logger.error(exception.getValidateErrors());
          break;
        default:
          // 苦肉の対応。（これくらいしかできない。。。）
          response.status(303).redirect('/questions/500');
      }
    }
  }
}
