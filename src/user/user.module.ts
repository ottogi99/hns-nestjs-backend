import { Module, Logger } from '@nestjs/common';
import { UserController } from './interface/user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './infra/db/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from 'src/user/application/command/create-user.handler';                                  
import { UserEventsHandler } from 'src/user/application/event/user-events.handler';
import { GetUserInfoQueryHandler } from 'src/user/application/query/get-user-info.query-handler';
import { UserRepository } from './infra/db/repository/user.repository';
import { UserFactory } from './domain/user.factory';
import { EmailService } from 'src/email/email.service';
// import { LoggerModule } from 'src/logger/logger.module';

const factories = [
  UserFactory,
];

@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    // LoggerModule,
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    Logger,
    CreateUserHandler,
    UserEventsHandler,
    GetUserInfoQueryHandler,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'EmailService',
      useClass: EmailService,
    },
    ...factories
  ]
})
export class UserModule {}
