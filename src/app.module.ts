import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import authConfig from './config/authConfig';
import { AuthModule } from './auth/auth.module';

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
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    AppService, ConfigService
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
