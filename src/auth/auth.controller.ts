import { BadRequestException, Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService) { }

    @Post("login")
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto)
    }

    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto)
    }

    @Post("request-otp")
    async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
        return this.authService.requestOtp(requestOtpDto)
    }

    @Post("verify-otp")
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto)
    }

    @Post("resent-otp")
    async resentOtp(@Body() resentOtpDto: { email: string }) {
        return this.authService.resentOtp(resentOtpDto.email)
    }

    @UseGuards(AuthGuard)
    @Get("refresh-token")
    async getRefreshToken(@Req() request: Request) {
        const token = request?.headers?.authorization.split(" ")[1];
        if (!token) throw new UnauthorizedException("Token not found")

        const isRefreshToken = request.headers?.isrefreshtoken === "true" ? true : false;
        if (!isRefreshToken) throw new BadRequestException("IsRefreshToken header not found!")

        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET, ignoreExpiration: isRefreshToken })
        return this.authService.refreshToken(decoded)
    }

    @Post("forgot-password")
    async forgotPassword(@Body() body: { email: string }) {
        return this.authService.forgotPassword(body.email)
    }
}
