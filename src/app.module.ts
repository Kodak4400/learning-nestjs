import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
// import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [
    // DatabaseModule,
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
