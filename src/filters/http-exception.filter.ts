import { ArgumentsHost, Catch, HttpException, InternalServerErrorException, Logger } from "@nestjs/common";

@Catch()  // @Catch 데커레이터는 처리되지 않은 모든 예외를 잡으려고 할 때 사용합니다.
export class HttpExceptionFilter implements HttpExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {  // HttpException 이 아닌 예외는 알 수 없는 에러이므로 InternalServerErrorException으로 처리되도록 합니다.
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack,
    };

    // console.log(log);
    this.logger.log(log);

    res
    .status((exception as HttpException).getStatus())
    .json(response);
  }
}