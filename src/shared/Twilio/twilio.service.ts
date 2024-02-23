import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from "twilio";
import { SmsDto } from "./dto/sms-dto";
;

@Injectable()
export class TwilioService {
    
    constructor(private config: ConfigService) { }

    //    function to send text messages => dynamic 
    sendTextMessaeg(textBody: SmsDto) {
        try {
            const client = new Twilio(this.config.get('TWILIO_ACCOUNTID'), this.config.get('TWILIO_AUTHTOKEN'))
            client.messages.create({
                body: textBody.body,
                from: this.config.get('TWILIO_NUMBER'),
                to: textBody.to
            }).then(message => console.log(message.sid));
        } catch (error) {
            throw new Error(error.message)
        }


    }

    // end of the function to send messages 





}