import { HttpException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export class HttpExceptionResponse extends HttpException {
  private validateErrors: ValidationError[] = [];

  constructor(
    readonly functionName: string = 'unknown functionName',
    readonly statusCode: number = 500,
    readonly code: string = 'APP_UNKNOWN_ERROR',
    readonly error: Error = new Error('unknown error'),
  ) {
    super(
      {
        functionName,
        statusCode,
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
