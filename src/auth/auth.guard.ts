import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { log } from 'console';
import { Request } from 'express';
import { extractTokenFromHeader } from 'src/utilities/getToken';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            })
            request['user'] = payload;

        } catch {
            throw new HttpException('Please Login again, Session expired', HttpStatus.NOT_FOUND)
        }
        return true;

    }


    // fucntion to get the token from the header 
   
}