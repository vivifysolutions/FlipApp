import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/registerDto';
import { AuthGuard } from './auth.guard';
import { UserDto } from 'src/user/dto/user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto)
    }

    @Post('login')
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto)
    }



    // testing purpose only 



    googleLogin() { }

    facebookLogin() { }

    twitterLogin() { }

    // verify phone number 
    @UseGuards(AuthGuard)
    @Post('verifynumber')
    verifyPhoneNumber(@Request() req) {
        const user: UserDto = req.user;
        console.log(user.id)
        const body = req.body;
        return this.authService.verifyPhonNumber(body.otp, user.id)
    }

    // controller to verify email address 
    @UseGuards(AuthGuard)
    @Post('verifyemail')
    verifyEmail(@Request() req) {
        const user: UserDto = req.user;
        console.log(user.id)
        const body = req.body;
        return this.authService.verifyEmailAddress(body.otp, user.id);
    }

}
