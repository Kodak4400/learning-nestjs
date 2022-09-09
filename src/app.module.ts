import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AnswerModule } from './answers/answer.module';
// import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CsrfModule } from './csrf/csrf.module';
import { QuestionModule } from './questions/question.module';

@Module({
  imports: [
    // DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        useLevel: `${process.env.NODE_ENV}` !== 'production' ? 'info' : 'info',
        timestamp: () =>
          `,"time":"${new Date().toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
          })}"`,
        formatters: {
          level: (label) => {
            return { level: label };
          },
          bindings: (bindings) => {
            return {
              env: `${process.env.NODE_ENV}`,
              // pid: bindings.pid,
              // hostname: bindings.hostname,
            };
          },
          log: (object) => {
            return object;
          },
        },
      },
    }),
    QuestionModule,
    AnswerModule,
    CsrfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CsrfMiddleware)
  //     .forRoutes({ path: 'questions/completed', method: RequestMethod.POST });
  // }
}
