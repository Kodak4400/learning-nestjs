import { Injectable, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Question } from './question/interface/question.interface';
import { QuestionService } from './question/question.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private questionService: QuestionService) {}

  async index() {
    const questions = await this.questionService.findAll();
    return {
      questions: questions,
    };
  }

  async ask() {
    // 仮
    return {
      message: 'Success!!',
    };
  }

  async confirm(rep: FastifyReply, question: Question) {
    // validation処理追加予定.
    return {
      token: rep.generateCsrf({
        httpOnly: true,
        // secure: true, // httpsになったら有効化
      }),
      question,
    };
  }

  async completed(question: Question) {
    await this.questionService.create(question);
    return question;
  }
}
