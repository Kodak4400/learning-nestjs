import CSRF from '@fastify/csrf';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { HttpExceptionResponse } from 'src/types/http-exception-response';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const secret = request.cookies['_csrf'];

    if (!secret) {
      // ExceptionFilter を通したい場合は、HttpExceptionを発生させる。
      throw new HttpExceptionResponse(
        500,
        'HttpException',
        'APP_CSRF_NOT_SECRET',
        'no secret information at CsrfGuard.',
      );

      /*
      return false は、以下を返す。
      {
        "statusCode": 403,
        "message": "Forbidden resource",
        "error": "Forbidden"
      }
      */
      // return false;
    }

    const tokens = new CSRF();
    if (!tokens.verify(secret, getToken(request), getUserInfo(request))) {
      throw new HttpExceptionResponse(
        500,
        'HttpException',
        'APP_CSRF_VERIFY_ERROR',
        'secret and token verify error at CSRF Guard.',
      );
      // return false;
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
