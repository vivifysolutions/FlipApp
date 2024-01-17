import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto, RegisterDto } from './dto/registerDto';
import { register } from 'module';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private prismaService: PrismaService){}

    @Post('signup')
    signUp(@Body() registerDto: RegisterDto){
        return this.authService.signUp(registerDto)
    }

    @Post('login')
    signIn(@Body() loginDto:LoginDto){
        return this.authService.signIn(loginDto)
    }

    googleLogin(){}

    facebookLogin(){}

    twitterLogin(){}
}
