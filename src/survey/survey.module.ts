import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, PrismaService],
  exports: [SurveyService],
})
export class SurveyModule {}
