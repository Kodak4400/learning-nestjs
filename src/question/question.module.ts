import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QuestionService } from './question.service';

@Module({
  providers: [QuestionService, PrismaService],
  exports: [QuestionService],
})
export class QuestionModule {}
