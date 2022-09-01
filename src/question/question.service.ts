import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma.service';
import { Question } from './interface/question.interface';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.question.findMany();
  }

  async findById(id: string) {
    return this.prisma.question.findUnique({
      where: {
        id: id,
      },
    });
  }

  async create(question: Question) {
    this.logger.log(question);
    console.log('title', question.title);
    console.log('question', question.question);
    return this.prisma.question.create({
      data: {
        id: uuidv4(),
        title: question.title,
        question: question.question,
      },
    });
  }
}
