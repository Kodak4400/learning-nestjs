import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSurveyDto } from './dto/create-survey';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger();
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.post.findMany();
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async create(createSurveyDto: CreateSurveyDto) {
    return this.prisma.post.create({
      data: {
        text: createSurveyDto.text,
      },
    });
  }
}
