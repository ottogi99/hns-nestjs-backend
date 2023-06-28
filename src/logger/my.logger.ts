import { ConsoleLogger, LoggerService } from "@nestjs/common";

export class MyLogger extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    super.log.apply(this, arguments);
    this.doSomething('log');
  }
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.doSomething('error');
  }
  warn(message: any, stack?: string, context?: string) {
    super.warn.apply(this, arguments);
    this.doSomething('warn');
  }
  debug(message: any, stack?: string, context?: string) {
    super.debug.apply(this, arguments);
    this.doSomething(message);
  }
  verbose(message: any, stack?: string, context?: string) {
    super.verbose.apply(this, arguments);
    this.doSomething('verbose');
  }

  private doSomething(message: string) {
    console.log(message);
    // 여기에 로깅에 관련된 부가 로직을 추가합니다.
    // ex. DB 저장
  }
}