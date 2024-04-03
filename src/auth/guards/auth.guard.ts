import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractToken(request)

    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verifyAsync(accessToken, { secret: process.env.JWT_SECRET });

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