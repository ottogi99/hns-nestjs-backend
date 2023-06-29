import { BadGatewayException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`${ErrorsInterceptor.name} Before...`);  // 요청이 전달되기 전에 로그를 출력합니다.
    const now = Date.now();

    return next
      .handle()
      .pipe(
        catchError(err => throwError(() => new BadGatewayException())),
      )
      .pipe(
        tap(() => console.log(`${ErrorsInterceptor.name} After... ${Date.now() - now}ms`)),  // 요청을 처리한 후 로그를 출력합니다.
      )
  }
}
