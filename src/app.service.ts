import { Injectable, Logger } from '@nestjs/common';
import { SurveyService } from './survey/survey.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private surveyService: SurveyService) {}

  async index() {
    const surveys = await this.surveyService.findAll();
    return {
      message: surveys,
    };
  }

  async detail(id: string) {
    const survey = await this.surveyService.findById(id);
    return {
      id: survey.id,
      text: survey.text,
    };
  }
}
