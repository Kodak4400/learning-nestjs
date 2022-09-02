import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(@Req() req: FastifyRequest, reply: FastifyReply, next: () => void) {
    // ミドルウェアは、cookieパースライブラリが反応しない。

    // const MissingCSRFSecretError = createError(
    //   'FST_CSRF_MISSING_SECRET',
    //   'Missing csrf secret',
    //   403,
    // );
    // const InvalidCSRFTokenError = createError(
    //   'FST_CSRF_INVALID_TOKEN',
    //   'Invalid csrf token',
    //   403,
    // );
    // console.log('req.cookies', req.cookies);
    // const secret = req.headers.cookie['_csrf'];
    // if (!secret) {
    //   req.log.warn('Missing csrf secret');
    //   return reply.send();
    // }
    // // const csrfOpts = opts && opts.csrfOpts ? opts.csrfOpts : {};
    // // if (opts.getUserInfo) {
    // //   csrfOpts.userInfo = true;
    // // }
    // const tokens = new CSRF();
    // if (!tokens.verify(secret, getToken(req), getUserInfo(req))) {
    //   req.log.warn('Invalid csrf token');
    //   return reply.send(new InvalidCSRFTokenError());
    // }

    // function getToken(req) {
    //   return (
    //     (req.body && req.body._csrf) ||
    //     req.headers['csrf-token'] ||
    //     req.headers['xsrf-token'] ||
    //     req.headers['x-csrf-token'] ||
    //     req.headers['x-xsrf-token']
    //   );
    // }

    // function getUserInfo(req) {
    //   return undefined;
    // }

    next();
  }
}
