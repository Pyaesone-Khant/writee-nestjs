import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './providers/mail.service';

@Global()
@Module({
    providers: [MailService],
    exports: [MailService],
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get("appConfig.mailHost"),
                    port: config.get("appConfig.mailPort"),
                    secure: false,
                    auth: {
                        user: config.get("appConfig.mailUser"),
                        pass: config.get("appConfig.mailPass"),
                    }
                },
                defaults: {
                    from: `Writee <${config.get("appConfig.mailUser")}>`
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: false
                    }
                }
            })
        })
    ]
})
export class MailModule { }
