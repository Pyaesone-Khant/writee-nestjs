import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY || "secret"
        })
    }

    async validate(loginUserDto: LoginUserDto): Promise<User> {
        const user = await this.authService.validateUser(loginUserDto)
        if (!user) throw new UnauthorizedException();

        return user;
    }
}