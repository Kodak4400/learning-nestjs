import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import type { Question } from './interface/question.interface';
import { QuestionService } from './question.service';

jest.mock('../prisma.service');
describe('QuestionService', () => {
  process.env['DATABASE_URL'] = 'file:../db/sqlitedb.db';
  let service: QuestionService;

  beforeEach(async () => {
    // PrismaServiceをMockさせる方法（１）：　カスタムプロバイダーを作る
    // const mockClassCatsService = class {
    //   findAll() {
    //     return 'hello';
    //   }
    // };
    // const customProvider = {
    //   provide: PrismaService,
    //   useFactory: (optionsProvider) => {
    //     return {
    //       question: {
    //         findMany() {
    //           return optionsProvider.findAll();
    //         },
    //       },
    //     };
    //   },
    //   inject: [mockClassCatsService],
    // };
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [QuestionService, customProvider, mockClassCatsService],
    // }).compile();
    // PrismaServiceをMockさせる方法（２）：　そのままjestでMockする
    // (PrismaService as jest.Mock).mockImplementation(() => {
    //   return {
    //     question: {
    //       async findMany(): Promise<Question[]> {
    //         return [
    //           { id: 'a1', title: 'b1', question: 'b1' },
    //           { id: 'a2', title: 'b2', question: 'b2' },
    //           { id: 'a3', title: 'b3', question: 'b3' },
    //         ];
    //       },
    //       async findById(): Promise<Question> {
    //         return { id: 'a1', title: 'b1', question: 'b1' };
    //       },
    //       async create(): Promise<string> {
    //         return 'sccess';
    //       },
    //     },
    //   };
    // });
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [QuestionService, PrismaService],
    // }).compile();
    // service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    (PrismaService as jest.Mock).mockReset();
  });

  describe('findAll', () => {
    it('成功：データの取得', async () => {
      const actual: Question[] = [
        {
          id: 'a1',
          title: 'b1',
          body: 'c1',
          status: 'open',
          createdAt: 'd1',
          updatedAt: 'e1',
        },
        {
          id: 'a2',
          title: 'b2',
          body: 'c2',
          status: 'open',
          createdAt: 'd2',
          updatedAt: 'e2',
        },
        {
          id: 'a3',
          title: 'b3',
          body: 'c3',
          status: 'open',
          createdAt: 'd3',
          updatedAt: 'e3',
        },
      ];

      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async findMany(): Promise<Question[]> {
              return actual;
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.findAll();
      expect(result.isSuccess() ? result.value : 'undefined').toEqual(actual);
    });

    it('失敗：データの取得', async () => {
      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async findMany(): Promise<any> {
              throw new Error('mock error');
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.findAll();

      expect(
        result.isSuccess() ? 'undefined' : result.error.error.message,
      ).toBe('mock error');
      expect(result.isSuccess() ? 'undefined' : result.error.functionName).toBe(
        'findAll',
      );
    });
  });

  describe('findById', () => {
    it('成功：データの取得', async () => {
      const actual = {
        id: 'a1',
        title: 'b1',
        body: 'c1',
        status: 'open',
        createdAt: 'd1',
        updatedAt: 'e1',
      };

      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async findUnique(): Promise<Question> {
              return actual;
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.findById('mockId');
      expect(result.isSuccess() ? result.value : 'undefined').toEqual(actual);
    });

    it('失敗：データの取得', async () => {
      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async findUnique(): Promise<any> {
              throw new Error('mock error');
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.findById('mockId');
      expect(
        result.isSuccess() ? 'undefined' : result.error.error.message,
      ).toBe('mock error');
      expect(result.isSuccess() ? 'undefined' : result.error.functionName).toBe(
        'findById',
      );
    });
  });

  describe('create', () => {
    it('成功：データの登録', async () => {
      const actual = {
        id: 'a1',
        title: 'b1',
        body: 'c1',
        status: 'open',
        createdAt: 'd1',
        updatedAt: 'e1',
      };

      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async create(): Promise<Question> {
              return actual;
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.create({
        title: 'b1',
        body: 'b1',
      });
      expect(result.isSuccess() ? result.value : 'undefined').toEqual(actual);
    });

    it('失敗：データの登録', async () => {
      (PrismaService as jest.Mock).mockImplementation(() => {
        return {
          question: {
            async create(): Promise<any> {
              throw new Error('mock error');
            },
          },
        };
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [QuestionService, PrismaService],
      }).compile();

      service = module.get<QuestionService>(QuestionService);

      const result = await service.create({
        title: 'b1',
        body: 'b1',
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
