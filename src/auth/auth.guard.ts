import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = {
      name: 'sunghwa',
      // name: 1,
      email: 'sunghwa@onthesys.com',
    };

    return true;
    // return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    const jwtString = request.headers.authorization.split('Bearer ')[1];

    this.authService.verify(jwtString);

    return true;
  }
}