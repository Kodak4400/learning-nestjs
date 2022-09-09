import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { HttpExceptionResponse } from '../types/http-exception-response';
import { Failure, Result, Success } from '../types/result';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './interface/question.interface';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  errorHandler(funcName: string, err: unknown) {
    if (err instanceof Error) {
      return new Failure(
        new HttpExceptionResponse(funcName, 500, 'APP_QUESTION_DB_ERROR', err),
      );
    }
    return new Failure(
      new HttpExceptionResponse(
        funcName,
        500,
        'APP_QUESTION_DB_ERROR',
        new Error('question db error.'),
      ),
    );
  }

  async findAll(): Promise<Result<Question[], HttpExceptionResponse>> {
    try {
      return new Success(await this.prisma.question.findMany());
    } catch (err) {
      return this.errorHandler(this.findAll.name, err);
    }
  }

  async findById(
    id: Question['id'],
  ): Promise<Result<Question, HttpExceptionResponse>> {
    try {
      const result = await this.prisma.question.findUnique({
        where: {
          id: id,
        },
      });
      if (!result) {
        return new Failure(
          new HttpExceptionResponse(
            this.findById.name,
            404,
            'APP_QUESTION_NOT_DATA_ERROR',
            new Error('question db error.'),
          ),
        );
      }
      return new Success(result);
    } catch (err) {
      return this.errorHandler(this.findById.name, err);
    }
  }

  async create(
    question: CreateQuestionDto,
  ): Promise<Result<Question, HttpExceptionResponse>> {
    try {
      return new Success(
        await this.prisma.question.create({
          data: {
            id: uuidv4(),
            title: question.title,
            body: question.body,
            status: 'open',
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
