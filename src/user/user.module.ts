import { Module, Logger } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
// import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    EmailModule,
    AuthModule,
    TypeOrmModule.forFeature([UserEntity]),
    // LoggerModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    Logger,
  ]
})
export class UserModule {}
