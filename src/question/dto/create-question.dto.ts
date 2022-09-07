import { IsString, Min } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @Min(1)
  title: string;

  @IsString()
  @Min(1)
  question: string;
}
