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
}
