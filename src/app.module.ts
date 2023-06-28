import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/email.config';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { UserController } from './user/user.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import authConfig from './config/authConfig';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';
// import { LoggerModule } from './logger/logger.module';
import * as winston from 'winston';
import {
  utilities as nestWinstoneModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: MySqlConfigProvider,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + `/**/entity/*.entity{.ts,.js}`],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
      logging: process.env.DTABASE_LOGGING === 'true',
    }),
    UserModule, 
    CoreModule, 
    EmailModule, 
    AuthModule,
    // LoggerModule,
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.Console({  // transport 옵션 설정
    //       level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',  // 로그 레벨을 개발환경에 따라 다르도록 지정
    //       format: winston.format.combine(
    //         winston.format.timestamp(), // 로그를 남긴 시각을 함께 표시하도록
    //         nestWinstoneModuleUtilities.format.nestLike('MyApp', { prettyPrint: true }),  // 어디에서 로그를 남겼는지를 구분하는 appName('MyApp')과 로그를 읽기 쉽도록 하는 옵션인 prettyPrint 옵션 설정
    //       )
    //     })
    //   ]
    // })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    AppService, ConfigService,
    Logger
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(LoggerMiddleware, Logger2Middleware).forRoutes('/user');
    consumer.apply(LoggerMiddleware, Logger2Middleware)
    .exclude({ path: '/users', method: RequestMethod.GET })
    .forRoutes(UserController);
  }
}
