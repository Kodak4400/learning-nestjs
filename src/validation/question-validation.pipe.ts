import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpExceptionResponse } from 'src/types/http-exception-response';
import type { Question } from '../question/interface/question.interface';

@Injectable()
export class QuestionValidationPipe implements PipeTransform<Question> {
  async transform(value: Question, { metatype }: ArgumentMetadata) {
    const object: Question = plainToInstance(metatype, value);

    // ここで、DTOにデコレートしたバリデーション処理を実行している。
    const errors = await validate(object);
    if (errors.length > 0) {
      const exp = new HttpExceptionResponse(
        this.transform.name,
        500,
        'APP_VALIDATION_ERROR',
        new Error('question validation error.'),
      );
      exp.setValidateErrors(errors);
      throw exp;
    }
    return value;
  }
}
