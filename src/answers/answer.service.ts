import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { HttpExceptionResponse } from '../types/http-exception-response';
import { Failure, Result, Success } from '../types/result';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './interface/answer.interface';

@Injectable()
export class AnswerService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  errorHandler(funcName: string, err: unknown) {
    if (err instanceof Error) {
      return new Failure(
        new HttpExceptionResponse(funcName, 500, 'APP_ANSWER_DB_ERROR', err),
      );
    }
    return new Failure(
      new HttpExceptionResponse(
        funcName,
        500,
        'APP_ANSWER_DB_ERROR',
        new Error('answer db error.'),
      ),
    );
  }

  async findByQuestionId(
    questionId: Answer['questionId'],
  ): Promise<Result<Answer[], HttpExceptionResponse>> {
    try {
      return new Success(
        await this.prisma.answer.findMany({
          where: {
            questionId: questionId,
          },
        }),
      );
    } catch (err) {
      return this.errorHandler(this.findByQuestionId.name, err);
    }
  }

  async create(
    answer: CreateAnswerDto,
  ): Promise<Result<Answer, HttpExceptionResponse>> {
    try {
      return new Success(
        await this.prisma.answer.create({
          data: {
            id: uuidv4(),
            body: answer.body,
            questionId: answer.questionId,
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString(),
          },
        }),
      );
    } catch (err) {
      return this.errorHandler(this.create.name, err);
    }
  }
}
