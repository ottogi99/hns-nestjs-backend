import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    console.log('[TransformInterceptor] Before...');  // 요청이 전달되기 전에 로그를 출력합니다.
    const now = Date.now();

    return next
      .handle()
      .pipe( map(data => {
        return { data }
      }))
      .pipe( 
        tap(() => console.log(`[TransformInterceptor] After... ${Date.now() - now}ms`)),
      );
  }
}
