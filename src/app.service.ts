import { Injectable, Inject, LoggerService, Logger } from '@nestjs/common';
// import { MyLogger } from './logger/my.logger';

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}
  // constructor(private myLogger: MyLogger) {}

  getHello(): string {
    this.logger.error('level: error');
    // this.myLogger.error('level: error');
    // this.myLogger.warn('level: warn');
    // this.myLogger.log('level: log');
    // this.myLogger.verbose('level: verbose');
    // this.myLogger.debug('level: debug');

    return 'Hello World!';
  }
}
