import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { AnswerService } from './answer.service';
import type { Answer } from './interface/answer.interface';

jest.mock('../prisma.service');
describe('AnswerService', () => {
  process.env['DATABASE_URL'] = 'file:../db/sqlitedb.db';
  let service: AnswerService;

  afterEach(() => {
    (PrismaService as jest.Mock).mockReset();
  });

  describe('findByQuestionId', () => {
    it('成功：データの取得', async () => {
      const actual: Answer[] = [
        {
          id: 'b1',
          body: 'c1',
          questionId: 'a1',
          createdAt: 'd1',
          updatedAt: 'e1',
        },
        {
          id: 'b2',
          body: 'c2',
          questionId: 'a2',
          createdAt: 'd2',
          updatedAt: 'e2',
        },
        {
          id: 'b3',
          body: 'c3',
          questionId: 'a3',
          createdAt: 'd3',
          updatedAt: 'e3',
        },
      ];

      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          answer: {
            async findMany(): Promise<Answer[]> {
              return actual;
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [AnswerService, PrismaService],
      }).compile();

      service = module.get<AnswerService>(AnswerService);

      const result = await service.findByQuestionId('b1');
      expect(result.isSuccess() ? result.value : 'undefined').toEqual(actual);
    });

    it('失敗：データの取得', async () => {
      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          answer: {
            async findMany(): Promise<any> {
              throw new Error('mock error');
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [AnswerService, PrismaService],
      }).compile();

      service = module.get<AnswerService>(AnswerService);

      const result = await service.findByQuestionId('b1');

      expect(
        result.isSuccess() ? 'undefined' : result.error.error.message,
      ).toBe('mock error');
      expect(result.isSuccess() ? 'undefined' : result.error.functionName).toBe(
        'findByQuestionId',
      );
    });
  });

  describe('create', () => {
    it('成功：データの取得', async () => {
      const actual: Answer = {
        id: 'b1',
        body: 'c1',
        questionId: 'a1',
        createdAt: 'd1',
        updatedAt: 'e1',
      };

      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          answer: {
            async create(): Promise<Answer> {
              return actual;
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [AnswerService, PrismaService],
      }).compile();

      service = module.get<AnswerService>(AnswerService);

      const result = await service.create({
        body: 'c1',
        questionId: 'a1',
      });
      expect(result.isSuccess() ? result.value : 'undefined').toEqual(actual);
    });

    it('失敗：データの取得', async () => {
      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          answer: {
            async create(): Promise<any> {
              throw new Error('mock error');
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [AnswerService, PrismaService],
      }).compile();

      service = module.get<AnswerService>(AnswerService);

      const result = await service.create({
        body: 'c1',
        questionId: 'a1',
      });

      expect(
        result.isSuccess() ? 'undefined' : result.error.error.message,
      ).toBe('mock error');
      expect(result.isSuccess() ? 'undefined' : result.error.functionName).toBe(
        'create',
      );
    });
  });
});
