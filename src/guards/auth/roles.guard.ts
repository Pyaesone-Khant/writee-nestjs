import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const isAuthorized = this.matchRoles(roles, user.roles);
    if (!isAuthorized) {
      throw new UnauthorizedException('You are not authorized to access this resource!');
    }

    return isAuthorized;
  }

  matchRoles(roles: string[], usersRoles: string[]): boolean {
    return roles.some(role => usersRoles.includes(role));
  }
}