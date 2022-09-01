import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
// import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
