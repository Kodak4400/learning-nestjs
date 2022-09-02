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
