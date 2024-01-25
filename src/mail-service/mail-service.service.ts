import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mailReqDto } from './Dto/email.dto';
import * as pug from 'pug'



@Injectable()
export class MailService {
    private readonly logger = new Logger(MailerService.name)
    private readonly contentEnum: any;
    constructor(private mailerService: MailerService, private readonly configService: ConfigService) {
        this.contentEnum = {
            otp: {
                template: 'otp',
                subject: 'Login otp'
            }
        }

    }


    async sendMail(content, to, context: any, contentRep: string) {
        console.log(this.contentEnum[contentRep].template)
        try {
            // console.log(this.contentEnum[content].template)
            this.logger.log(`Sending email to ${to} with the content ${content}`);

            const html = pug.renderFile(process.cwd() +
                '/templates/' +
                this.contentEnum[contentRep].template +
                '.pug', context);


            await this.mailerService.sendMail({
                to: to,
                from: this.configService.get('SES_FROM_MAIL'),
                subject: this.contentEnum[contentRep].subject,
                html: html
            })

            this.logger.log(`Email sent successfully to ${to}`)
        }
        catch (err) {
            this.logger.error(`Failed to send email to ${to}`)
            this.logger.error(err)
        }
    }
}
