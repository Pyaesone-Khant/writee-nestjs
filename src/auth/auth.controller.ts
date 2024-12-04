import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { AuthType } from './enums/auth-type.enum';
import { AuthService } from './providers/auth.service';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('/sign-in')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @Post('/sign-up')
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto)
    }

    @Post('/forgot-password')
    forgotPassword(@Body() { email }: { email: string }) {
        return this.authService.requestOtp(email)
    }

    @Post('/verify-otp')
    verifyOTP(@Body() { email, otp }: { email: string, otp: string }) {
        return this.authService.verifyOTP(email, otp)
    }

    @Post('/request-otp')
    requestOTP(@Body() { email }: { email: string }) {
        return this.authService.requestOtp(email)
    }

    @Post('/reset-password')
    resetPassword(@Body() { email, password }: { email: string, password: string }) {
        return this.authService.resetPassword(email, password)
    }
}
