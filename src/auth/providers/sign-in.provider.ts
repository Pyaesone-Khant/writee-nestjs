import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/configs/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {

    constructor(
        private readonly usersService: UsersService,

        private readonly hashingProvider: HashingProvider,

        private readonly generateTokensProvider: GenerateTokensProvider,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) { }

    async signIn(signInDto: SignInDto) {

        const user: User | undefined = await this.usersService.findUserByEmail(signInDto.email);

        if (!user) {
            throw new NotFoundException()
        }

        const isPasswordValid: boolean = await this.hashingProvider.comparePassword(signInDto.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Email or password is incorrect!')
        }

        const { accessToken, refreshToken } = await this.generateTokensProvider.generateAccessToken(user);

        const expiredAt = new Date(new Date().getTime() + this.jwtConfiguration.accessTokenTTL).toISOString();

        return {
            accessToken,
            refreshToken,
            expiredAt
        }

    }

}
