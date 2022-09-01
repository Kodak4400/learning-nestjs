import { Injectable, Logger } from '@nestjs/common';
import { Question } from './question/interface/question.interface';
import { QuestionService } from './question/question.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private questionService: QuestionService) {}

  async index() {
    const questions = await this.questionService.findAll();
    this.logger.log(questions);
    return {
      questions: questions,
    };
  }

  async ask() {
    return {
      message: 'Success!!',
    };
  }

  async confirm(question: Question) {
    // validation処理追加予定.
    return question;
  }

  async completed(question: Question) {
    console.log('createQuestionDto', question);
    await this.questionService.create(question);
    // DB登録処理追加予定.
    return question;
  }
}
