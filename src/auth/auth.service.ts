import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { generateOtp } from 'src/helpers/generateOtp';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService
    ) { }

    async validateUser(payload: any) {
        const { email } = payload;
        const user = await this.usersService.findByEmail(email)
        if (!user) throw new BadRequestException("Email or password is wrong!");
        if (user.is_verified === false) throw new BadRequestException("Email not verified!")
        return user;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.validateUser(loginUserDto);
        const isPasswordMatch = bcrypt.compareSync(loginUserDto.password, user.password);
        if (!isPasswordMatch) throw new BadRequestException("Email or password is wrong!");
        return await this.generateAccessToken(user);
    }

    async register(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;
        const user: User = await this.usersService.findByEmail(email);
        if (user && user?.is_verified) throw new BadRequestException("Email already exists!");

        const { otp, otp_expiration } = generateOtp();

        // If user exists but not verified
        if (user && !user?.is_verified) {
            await this.usersService.update(user.id, { otp, otp_expiration });
            const sendMailDto = {
                user: { email, name: user.name },
                subject: "Email Verification",
                otp,
            }
            await this.emailService.sendEmail(sendMailDto);
            return { message: "OTP Code has been sent your email address!" }
        }

        // If user not exists
        const hashedPassword = await this.hashPassword(password)
        const newUser: CreateUserDto = { ...createUserDto, password: hashedPassword, otp, otp_expiration };
        await this.usersService.create(newUser)
        const sendMailDto = {
            user: newUser,
            subject: "Email Verification",
            otp,
        }
        await this.emailService.sendEmail(sendMailDto)
        return { message: "OTP Code has been sent your email address!" }
    }

    async refreshToken(user: any) {
        const { id, exp } = user
        const userFromDb = await this.usersService.findOne(+id);
        if (!userFromDb) throw new NotFoundException("User not found!");
        const isTokenExpired = exp * 1000 < Date.now();
        if (!isTokenExpired) throw new BadRequestException("Token not expired!");
        return await this.generateAccessToken(userFromDb);
    }

    async generateAccessToken(user: User) {
        const expiredAt = Date.now() + (24 * 60 * 60 * 1000);
        const payload = { email: user.email, id: user.id }
        return { accessToken: this.jwtService.sign(payload), expiredAt }
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }

    isVerified(user: User) {
        if (user.is_verified) throw new BadRequestException("Email already verified!");
    }

    async requestOtp(requestOtpDto: RequestOtpDto) {
        const newEmail = requestOtpDto?.newEmail;
        if (newEmail) {
            const isEmailAlreadyExist = await this.usersService.findByEmail(newEmail);
            if (isEmailAlreadyExist) throw new BadRequestException("Email already exists!");

            const user = await this.usersService.findByEmail(requestOtpDto.email);
            if (!user) throw new NotFoundException("Email not found!");

            const { otp, otp_expiration } = generateOtp()
            await this.usersService.update(user.id, { otp, otp_expiration, is_verified: false, email: newEmail });

            const sendMailDto = {
                user: { email: newEmail, name: user.name },
                subject: "Email Verification",
                otp,
            }
            await this.emailService.sendEmail(sendMailDto);

            return { message: "OTP sent successfully to your new email address!" };
        } else {
            const { email } = requestOtpDto;
            const user = await this.usersService.findByEmail(email);
            if (!user) throw new NotFoundException("Email not found!");

            this.isVerified(user);

            const { otp, otp_expiration } = generateOtp();
            await this.usersService.update(user.id, { otp, otp_expiration, is_verified: false });

            const sendMailDto = {
                user: { email: email, name: user.name },
                subject: "Email Verification",
                otp,
            }
            await this.emailService.sendEmail(sendMailDto);
            return { message: "OTP sent successfully!" };
        }
    }

    async verifyOtp(verifyOtp: VerifyOtpDto) {
        const { otp, email } = verifyOtp;
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException("Email not found!");
        this.isVerified(user);
        if (user.otp !== otp) throw new BadRequestException("Invalid OTP!");

        if (+user.otp_expiration < Date.now()) throw new BadRequestException("OTP expired!");
        await this.usersService.update(user.id, { otp: null, otp_expiration: null, is_verified: true });

        return { message: "Email verified successfully!" };
    }

    async resentOtp(email: string) {
        const { otp, otp_expiration } = generateOtp();
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException("Email not found!");
        this.isVerified(user);
        await this.usersService.update(user.id, { otp, otp_expiration });

        const sendMailDto = {
            user: { email: email, name: user.name },
            subject: "Email Verification",
            otp,
        }
        await this.emailService.sendEmail(sendMailDto);

        return { message: "OTP resent successfully!" };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException("Email not found!");

        const { otp, otp_expiration } = generateOtp();
        await this.usersService.update(user.id, { otp, otp_expiration, is_verified: false });

        const sendMailDto = {
            user: { email: email, name: user.name },
            subject: "Forgot Password",
            otp,
        }
        await this.emailService.sendEmail(sendMailDto);

        return { message: "OTP sent successfully!" };
    }

}
