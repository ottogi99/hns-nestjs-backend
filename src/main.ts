import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { logger3 } from './logger/logger3.middleware';
// import { MyLogger } from './logger/my.logger';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  utilities as nestWinstoneModuleUtilities,
  WinstonModule,
} from 'nest-winston';// import * as dotenv from 'dotenv';
import * as winston from 'winston';// import * as path from 'path';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { TransformInterceptor } from './transform/transform.interceptor';

// dotenv.config({
//   path: path.resolve(
//     (process.env.NODE_ENV === 'production') ? '.production.env'
//     : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
//   )
// })

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({  // transport 옵션 설정
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',  // 로그 레벨을 개발환경에 따라 다르도록 지정
          format: winston.format.combine(
            winston.format.timestamp(), // 로그를 남긴 시각을 함께 표시하도록
            nestWinstoneModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),  // 어디에서 로그를 남겼는지를 구분하는 appName('MyApp')과 로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션 설정
          )
        })
      ],
    })
    // logger: false,
    // logger: process.env.NODE_ENV === 'production'
    // ? ['error', 'warn', 'log']
    // : ['error', 'warn', 'log', 'verbose', 'debug'],
  });
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.useLogger(app.get(MyLogger));
  // app.useGlobalGuards(new AuthGuard());
  // app.useGlobalFilters(new HttpExceptionFilter()); // 전역 필터 적용
  app.useGlobalInterceptors(
    // new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  // app.use(logger3);
  await app.listen(3000);
}
bootstrap();
