import { Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from 'src/mail/providers/mail.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { OtpProvider } from './otp.provider';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {

    constructor(
        private readonly signInProvider: SignInProvider,

        private readonly usersService: UsersService,

        private readonly otpProvider: OtpProvider,

        private readonly mailService: MailService,
    ) { }

    async signIn(signInDto: SignInDto): Promise<object> {
        return this.signInProvider.signIn(signInDto);
    }

    async signUp(createUserDto: CreateUserDto): Promise<object> {
        return this.usersService.create(createUserDto);
    }

    async verifyOTP(email: string, otp: string): Promise<object> {
        const user = await this.usersService.findUserByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.otpProvider.verifyOtp(user, otp);
        await this.usersService.update(user.id, { otp: null, otpExpiration: null, isVerified: true });
        return {
            success: true,
            message: 'OTP verified successfully',
        }
    }

    async requestOtp(email: string): Promise<object> {
        const user: User = await this.usersService.findUserByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { otp, otpExpiration } = this.otpProvider.generateOtp();

        try {
            await this.mailService.sendEmailVerificationMail(user.email, user.name, otp);
        } catch (error) {
            throw new Error('Failed to send OTP');
        }

        await this.usersService.update(user.id, { otp, otpExpiration });

        return {
            success: true,
            message: 'OTP sent successfully',
        }
    }

    async resetPassword(email: string, password: string): Promise<object> {
        return await this.usersService.resetPassword(email, password);
    }
}
