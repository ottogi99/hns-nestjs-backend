import { InternalServerErrorException, Controller, Get, UseGuards, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from './common/common.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { User } from './decorator/user.decorator';
import { UserData } from './decorator/user-data.decorator';
import { IsString } from 'class-validator';

interface User {
  name: string;
  email: string;
}

class UserEntity {
  @IsString()
  name: string;

  @IsString()
  email: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/error')
  error(foo: any): string {
    return foo.bar();
  }
  
  @Get()
  getHello(@User() user:User) {
    // console.log(User);   
    return this.appService.getHello();
  }

  @Get('/username')
  getHello2(@UserData('name') name: string) {
    console.log(name);
  }

  @UseGuards(AuthGuard)
  @Get('/with-pipe')
  getHello3(@User(new ValidationPipe({ validateCustomDecorators: true })) user: UserEntity) {
    console.log(user);
  }

  @Get('/common-hello')
  getCommonHello(): string {
    return this.commonService.hello();
  }

  @Get('/db-host-from-dotenv')
  getConfigFromDotEnv(): string {
    return process.env.DATABASE_HOST;
  }

  @Get('/db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}
