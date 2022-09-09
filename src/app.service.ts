import { Injectable, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AnswerService } from './answers/answer.service';
import { CreateAnswerDto } from './answers/dto/create-answer.dto';
import { Answer } from './answers/interface/answer.interface';
import { CreateQuestionDto } from './questions/dto/create-question.dto';
import type { QuestionId } from './questions/interface/question.interface';
import { Question } from './questions/interface/question.interface';
import { QuestionService } from './questions/question.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(
    private questionService: QuestionService,
    private answerService: AnswerService,
  ) {}

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

  async detail(
    rep: FastifyReply,
    params: QuestionId,
  ): Promise<{ token: any; question: Question; answers: Answer[] }> {
    const question = await this.questionService.findById(params.id);
    if (question.isFailure()) {
      throw question.error;
    }
    const answers = await this.answerService.findByQuestionId(params.id);
    if (answers.isFailure()) {
      throw answers.error;
    }

    return {
      token: rep.generateCsrf({
        httpOnly: true,
        // secure: true, // httpsになったら有効化
      }),
      question: question.value,
      answers: answers.value,
    };
  }

  async confirm(rep: FastifyReply, question: CreateQuestionDto) {
    return {
      token: rep.generateCsrf({
        httpOnly: true,
        // secure: true, // httpsになったら有効化
      }),
      question,
    };
  }

  async completed(question: CreateQuestionDto): Promise<Question> {
    const result = await this.questionService.create(question);
    if (result.isFailure()) {
      throw result.error;
    }
    return result.value;
  }

  async answer(answer: CreateAnswerDto): Promise<Answer> {
    const result = await this.answerService.create(answer);
    if (result.isFailure()) {
      throw result.error;
    }
    return result.value;
  }
}
