import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AnswerService } from './answer.service';

@Module({
  providers: [AnswerService, PrismaService],
  exports: [AnswerService],
})
export class AnswerModule {}
