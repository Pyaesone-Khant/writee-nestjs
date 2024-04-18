import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            if (this.isPublic(context)) return true
            const request: Request = context.switchToHttp().getRequest()
            return this.verifyRequest(request)
        } catch (error) {
            throw new UnauthorizedException()
        }
    }

    private verifyRequest(request: Request): boolean {
        const [type, token] = request.headers.authorization.split(" ") ?? [];
        if (type !== "Bearer") throw new UnauthorizedException();
        if (!token) throw new UnauthorizedException();
        const payload = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
        request["user"] = payload;
        return true;
    }

    private isPublic(context: ExecutionContext): boolean {
        return this.reflector.getAllAndOverride("isPublic", [
            context.getHandler(),
            context.getClass()
        ])
    }
}