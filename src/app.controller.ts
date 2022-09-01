import { Body, Controller, Get, Logger, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateQuestionDto } from './question/dto/create-question';

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
  async confirm(@Body() createQuestionDto: CreateQuestionDto) {
    return this.appService.confirm(createQuestionDto);
  }

  @Post('questions/completed')
  @Render('questions/completed.hbs')
  async completed(@Body() createQuestionDto: CreateQuestionDto) {
    return this.appService.completed(createQuestionDto);
  }
}
