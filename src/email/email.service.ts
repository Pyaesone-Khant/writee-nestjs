import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class EmailService {

    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendEmail(sendMailDto: SendMailDto) {
        const { user, subject, otp } = sendMailDto;
        await this.mailerService.sendMail({
            to: user.email,
            subject: subject,
            template: "./verify",
            context: {
                username: user.name,
                otp,
            }
        })
    }
}
