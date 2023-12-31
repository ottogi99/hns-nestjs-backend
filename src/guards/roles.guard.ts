import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = 'user-id';  // JWT를 검증해서 얻은 유저 id라고 가정. request.user 객체에서 얻음
    const userRole = this.getUserRole(userId);
    console.log(userRole);
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(roles);

    return userRole.some((role) => {
      if (roles?.includes(role))
        return true;
    });
    // return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string[] {
    // return ['admin', 'user'];
    return ['user'];
    // return 'user';
  }
}

