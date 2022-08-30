import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey';
import { SurveyService } from './survey.service';

@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get()
  // @Render('index.hbs')
  async findAll() {
    return this.surveyService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.surveyService.findById(id);
  }

  @Post('post')
  async create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.create(createSurveyDto);
  }
}
