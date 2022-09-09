import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpExceptionResponse } from 'src/types/http-exception-response';
import type { Answer } from '../answers/interface/answer.interface';

@Injectable()
export class AnswerValidationPipe implements PipeTransform<Answer> {
  async transform(value: Answer, { metatype }: ArgumentMetadata) {
    const object: Answer = plainToInstance(metatype, value);

    // ここで、DTOにデコレートしたバリデーション処理を実行している。
    const errors = await validate(object);
    if (errors.length > 0) {
      const exp = new HttpExceptionResponse(
        this.transform.name,
        500,
        'APP_ANSWER_VALIDATION_ERROR',
        new Error('answer validation error.'),
      );
      exp.setValidateErrors(errors);
      throw exp;
    }
    return value;
  }
}
