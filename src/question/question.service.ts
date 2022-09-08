import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { HttpExceptionResponse } from '../types/http-exception-response';
import { Failure, Result, Success } from '../types/result';
import { Question, QuestionBody } from './interface/question.interface';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Result<Question[], HttpExceptionResponse>> {
    try {
      return new Success(await this.prisma.question.findMany());
    } catch (err) {
      if (err instanceof Error) {
        return new Failure(
          new HttpExceptionResponse(
            this.findAll.name,
            500,
            'APP_DB_ACCESS_ERROR',
            err,
          ),
        );
      }
      return new Failure(new HttpExceptionResponse(this.findAll.name));
    }
  }

  async findById(
    id: Question['id'],
  ): Promise<Result<Question, HttpExceptionResponse>> {
    try {
      return new Success(
        await this.prisma.question.findUnique({
          where: {
            id: id,
          },
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        return new Failure(
          new HttpExceptionResponse(
            this.findById.name,
            500,
            'APP_DB_ACCESS_ERROR',
            err,
          ),
        );
      }
      return new Failure(new HttpExceptionResponse(this.findById.name));
    }
  }

  async create(
    question: QuestionBody,
  ): Promise<Result<Question, HttpExceptionResponse>> {
    try {
      return new Success(
        await this.prisma.question.create({
          data: {
            id: uuidv4(),
            title: question.title,
            question: question.question,
          },
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        return new Failure(
          new HttpExceptionResponse(
            this.create.name,
            500,
            'APP_DB_ACCESS_ERROR',
            err,
          ),
        );
      }
      return new Failure(new HttpExceptionResponse(this.create.name));
    }
  }
}
