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
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('Authentication endpoints')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @ApiOperation({ summary: 'Signup User' })
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto)
    }

    @Post('login')
    @ApiOperation({ summary: 'Login User' })
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
    @ApiOperation({ summary: 'User verify Phone number via otp' })
    verifyPhoneNumber(@Request() req) {
        const user: UserDto = req.user;
        const body = req.body;
        return this.authService.verifyPhonNumber(body.otp, user.id)
    }

    // controller to verify email address 
    @UseGuards(AuthGuard)
    @Post('verifyemail')
    @ApiOperation({ summary: 'User verify email address' })
    verifyEmail(@Request() req) {
        const user: UserDto = req.user;
        console.log(user.id)
        const body = req.body;
        return this.authService.verifyEmailAddress(body.otp, user.id);
    }

}
