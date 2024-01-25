import { Global, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Global()
@Injectable()
export class UtilitiesService {
    constructor(private jwtService: JwtService){}

    // the function to generate the access token 
    async signPayload(payload:any){
        return {
            access_token: await this.jwtService.sign(payload)
        }
    }

    // function to handle sending of mails 
    sendEmail(){}

    // funtion to generate otp
    getOtp(){
        const digits = Math.floor(Math.random()*10000)
        return digits;
    }
    // end of the function to return the otp 

}
