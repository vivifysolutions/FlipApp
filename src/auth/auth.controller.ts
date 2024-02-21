import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
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

    /**
     * User Sign Up 
     * @method Post
     */
    @Post('signup')
    @ApiOperation({ summary: 'Signup User' })
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto)
    }

    /**
     * User Login
     * @method post
     */
    @Post('login')
    @ApiOperation({ summary: 'Login User' })
    signIn(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto)
    }
    // testing purpose only 
    googleLogin() { }

    facebookLogin() { }

    twitterLogin() { }

    // 
    /**
     * 
     * verify phone number 
     * @method Post
     */
    @UseGuards(AuthGuard)
    @Post('verifynumber')
    @ApiOperation({ summary: 'User verify Phone number via otp' })
    verifyPhoneNumber(@Request() req) {
        const user: UserDto = req.user;
        const body = req.body;
        return this.authService.verifyPhonNumber(body.otp, user.id)
    }

    /**
     * controller to verify email address 
     * @method Post
     */
    @UseGuards(AuthGuard)
    @Post('verifyemail')
    @ApiOperation({ summary: 'User verify email address' })
    verifyEmail(@Request() req) {
        const user: UserDto = req.user;
        const body = req.body;
        return this.authService.verifyEmailAddress(body.otp, user.id);
    }

    /**
     * 
     * Change the password
     * @method PUT
     */ 
    @UseGuards(AuthGuard)
    @Put('changePassword')
    changePassword(@Request() req){
        const user = req.user;
        let payload = req.body;
        payload = {
            ...payload,
            userId: user.id,
        }
        return this.authService.changePassword(payload);  
    }

}
