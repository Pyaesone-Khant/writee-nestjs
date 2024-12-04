import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { OtpProvider } from 'src/auth/providers/otp.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class CreateUserProvider {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly hashingProvider: HashingProvider,

        private readonly mailService: MailService,

        private readonly otpProvider: OtpProvider
    ) { }

    async create(createUserDto: CreateUserDto): Promise<object> {
        let user: User | undefined;

        const userByUsername: User | undefined = await this.userRepository.findOne({
            where: { username: createUserDto.username }
        })
        if (userByUsername && userByUsername.isVerified) {
            throw new BadRequestException('User with this username already exists!');
        }

        const userByEmail: User | undefined = await this.userRepository.findOne({
            where: {
                email: createUserDto.email
            }
        });

        if (userByEmail && userByEmail.isVerified) {
            throw new BadRequestException('User with this email already exists!');
        }

        const hashedPassword: string = await this.hashingProvider.hashPassword(createUserDto.password);
        const { otp, otpExpiration } = this.otpProvider.generateOtp();

        if (userByEmail && !userByEmail.isVerified) {
            userByEmail.password = hashedPassword;
            userByEmail.username = createUserDto.username;
            userByEmail.name = createUserDto.name;
            userByEmail.otp = otp;
            userByEmail.otpExpiration = otpExpiration;

            await this.mailService.sendEmailVerificationMail(createUserDto.email, createUserDto.name, otp);

            try {
                await this.userRepository.save(userByEmail);
            } catch (error) {
                throw new RequestTimeoutException('Failed to create account!');
            }
        } else {
            await this.mailService.sendEmailVerificationMail(createUserDto.email, createUserDto.name, otp);

            try {
                user = this.userRepository.create({
                    ...createUserDto,
                    password: hashedPassword,
                    otp,
                    otpExpiration
                });

                await this.userRepository.save(user);
            } catch (error) {
                throw new RequestTimeoutException('Failed to create account!');
            }
        }

        return {
            success: true,
            message: 'Account registered successfully! Please verify your email to login.'
        };
    }
}
