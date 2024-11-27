import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/configs/jwt.config';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException("Token not found!");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

            request[REQUEST_USER_KEY] = payload
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    public extractToken(request: Request): string {
        const [bearer, token] = request.headers.authorization?.split(" ") ?? [];

        if (bearer?.toLowerCase() !== 'bearer') {
            return null;
        }

        return token;
    }
}
