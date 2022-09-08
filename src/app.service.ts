import { Injectable, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import type { QuestionId } from './question/interface/question.interface';
import {
  Question,
  QuestionBody,
} from './question/interface/question.interface';
import { QuestionService } from './question/question.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private questionService: QuestionService) {}

  async index(): Promise<{ questions: Question[] }> {
    const result = await this.questionService.findAll();
    if (result.isFailure()) {
      throw result.error;
    }
    return {
      questions: result.value,
    };
  }

  async ask() {
    // 仮
    return {
      message: 'Success!!',
    };
  }

  async detail(params: QuestionId): Promise<Question> {
    const result = await this.questionService.findById(params.id);
    if (result.isFailure()) {
      throw result.error;
    }
    return result.value;
  }

  async confirm(rep: FastifyReply, question: QuestionBody) {
    return {
      token: rep.generateCsrf({
        httpOnly: true,
        // secure: true, // httpsになったら有効化
      }),
      question,
    };
  }

  async completed(question: QuestionBody): Promise<Question> {
    const result = await this.questionService.create(question);
    if (result.isFailure()) {
      throw result.error;
    }
    return result.value;
  }
}
