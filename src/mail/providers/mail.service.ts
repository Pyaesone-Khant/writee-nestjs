import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendEmailVerificationMail(email: string, name: string, otp: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Verify your Email',
            template: './email-verification',
            context: {
                name: name,
                otp: otp,
            }
        })
    }

    async sendPasswordResetMail(user: User): Promise<void> {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset your Password',
            template: './reset-password',
            context: {
                name: user.name,
                otp: user.otp,
            }
        })
    }
}
