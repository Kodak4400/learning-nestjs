import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppService } from './app.service';
import { CsrfGuard } from './csrf/csrf.guard';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { CreateQuestionDto } from './question/dto/create-question.dto';
import { QuestionValidationPipe } from './validation/question-validation.pipe';

@Controller()
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @Get('')
  @Render('index.hbs')
  async index() {
    return this.appService.index();
  }

  @Get('questions/ask')
  @Render('questions/ask.hbs')
  async ask() {
    return this.appService.ask();
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
  async completed(
    @Req() req: FastifyRequest,
    @Body(new QuestionValidationPipe()) createQuestionDto: CreateQuestionDto,
  ) {
    return this.appService.completed(createQuestionDto);
  }

  @Get('questions/500')
  @Render('questions/500.hbs')
  async 500() {
    return '';
  }
}
