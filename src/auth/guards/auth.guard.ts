import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request)
    const isRefreshToken = request.headers?.isrefreshtoken === "true" ? true : false;

    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, { secret: process.env.JWT_SECRET, ignoreExpiration: isRefreshToken });
      request["user"] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

}