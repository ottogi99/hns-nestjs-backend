import { Module, Logger } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from 'src/command/create-user.handler';
import { UserEventsHandler } from 'src/command/user-events.handler';
import { GetUserInfoQueryHandler } from 'src/command/get-user-info.query-handler';
// import { LoggerModule } from 'src/logger/logger.module';

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
  ]
})
export class UserModule {}
