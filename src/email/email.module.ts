import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './email.service';

@Global()
@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get("MAIL_HOST"),
                    port: config.get("MAIL_PORT"),
                    sercure: false,
                    auth: {
                        user: config.get("MAIL_USER"),
                        pass: config.get("MAIL_PASS")
                    }
                },
                defaults: {
                    from: `Writee <${config.get("MAIL_USER")}>`
                },
                template: {
                    dir: join("src", "templates"),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: false,
                    },
                },
            }),
            inject: [ConfigService]
        })],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }
