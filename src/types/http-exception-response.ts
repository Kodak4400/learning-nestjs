import { HttpException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export class HttpExceptionResponse extends HttpException {
  private validateErrors: ValidationError[] = [];

  constructor(
    readonly statusCode: number = 500,
    readonly exception: string = 'UnknownException',
    readonly code: string = 'APP_UNKNOWN_ERROR',
    readonly error: string = 'unknown error',
  ) {
    super(
      {
        statusCode,
        exception,
        code,
        error,
      },
      statusCode,
    );
  }

  setValidateErrors(validatonErrors: ValidationError[]) {
    this.validateErrors = [...validatonErrors];
  }
  getValidateErrors() {
    return this.validateErrors;
  }
}
