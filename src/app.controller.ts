import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Redirect,
  Render,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CreateAnswerDto } from './answers/dto/create-answer.dto';
import { AppService } from './app.service';
import { CsrfGuard } from './csrf/csrf.guard';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { CreateQuestionDto } from './questions/dto/create-question.dto';
import type { QuestionId } from './questions/interface/question.interface';
import { AnswerValidationPipe } from './validation/answer-validation.pipe';
import { QuestionValidationPipe } from './validation/question-validation.pipe';

@Controller()
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @Get('404')
  @Render('404.hbs')
  async 404() {
    return '';
  }

  @Get('500')
  @Render('500.hbs')
  async 500() {
    return '';
  }

  @Get('questions/500')
  @Render('questions/500.hbs')
  async question500() {
    return '';
  }

  @Get('')
  @Render('index.hbs')
  @UseFilters(new HttpExceptionFilter())
  async index() {
    return this.appService.index();
  }

  @Get('questions/ask')
  @Render('questions/ask.hbs')
  async ask() {
    return this.appService.ask();
  }

  @Get('questions/:id')
  @Render('questions/detail.hbs')
  @UseFilters(new HttpExceptionFilter())
  async detail(@Res() rep: FastifyReply, @Param() params: QuestionId) {
    return this.appService.detail(rep, params);
  }

  @Post('questions/confirm')
  @Render('questions/confirm.hbs')
  @UseFilters(new HttpExceptionFilter())
  async confirm(
    @Res() rep: FastifyReply,
    @Body(new QuestionValidationPipe()) createQuestionDto: CreateQuestionDto,
  ) {
    return this.appService.confirm(rep, createQuestionDto);
  }

  @Post('questions/completed')
  @Render('questions/completed.hbs')
  @UseGuards(CsrfGuard)
  @UseFilters(new HttpExceptionFilter())
  async completed(@Body() createQuestionDto: CreateQuestionDto) {
    console.log(createQuestionDto);
    return this.appService.completed(createQuestionDto);
  }

  @Post('questions/:id/answer')
  @Redirect('/questions/:id')
  @UseGuards(CsrfGuard)
  @UseFilters(new HttpExceptionFilter())
  async answer(
    @Body(new AnswerValidationPipe()) createAnswerDto: CreateAnswerDto,
  ) {
    this.appService.answer(createAnswerDto);
    return { url: `/questions/${createAnswerDto.questionId}` };
  }
}
