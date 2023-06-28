import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('[LoggingIntercepter] Before...');  // 요청이 전달되기 전에 로그를 출력합니다.

    const { method, url, body } = context.getArgByIndex(0);
    this.logger.log(`Requests to ${method} ${url}`);

    const now = Date.now();
    return next
      .handle()
      // .pipe(
      //   tap(() => console.log(`[LoggingIntercepter] After... ${Date.now() - now}ms`)),  // 요청을 처리한 후 로그를 출력합니다.
      // )
      .pipe(
        tap(data => this.logger.log(`Response from ${method} ${url} \n response: ${JSON.stringify(data)}`)),  // 요청을 처리한 후 로그를 출력합니다.
      );

    // return next.handle();
  }
}
