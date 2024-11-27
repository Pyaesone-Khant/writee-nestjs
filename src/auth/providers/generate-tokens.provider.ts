import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/configs/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class GenerateTokensProvider {

    constructor(
        private readonly jwtService: JwtService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    async generateAccessToken(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accessTokenTTL,
                {
                    email: user.email
                }
            ),
            this.signToken(
                user.id,
                this.jwtConfiguration.refreshTokenTTL,
            )
        ])

        return { accessToken, refreshToken }
    }

    async signToken<T>(
        userId: number,
        expiresIn: number,
        payload?: T
    ) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload
            },
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn
            }
        )

    }
}
