import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    SurveyModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
