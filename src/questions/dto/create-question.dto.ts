import { IsString, Length } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @Length(1)
  title: string;

  @IsString()
  @Length(1)
  body: string;
}
