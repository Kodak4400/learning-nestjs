import { IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @Length(1)
  questionId: string;

  @IsString()
  @Length(1)
  body: string;
}
