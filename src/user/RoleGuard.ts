import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { extractTokenFromHeader } from 'src/utilities/getToken';


@Injectable()
export class RoleGuard implements CanActivate {
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
            if (payload.role !== 'ADMIN') {
                throw new HttpException('Not authorized to access this page', HttpStatus.UNAUTHORIZED)
            }
            else {
                return true;
            }

        } catch {
            throw new UnauthorizedException();
        }



    }


    // fucntion to get the token from the header 

}