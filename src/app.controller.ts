import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonService } from './common/common.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
