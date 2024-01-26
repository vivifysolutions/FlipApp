import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {

    constructor(){}
/**
 * 
 * @param req 
 * @returns user profile information
 */
    @UseGuards(AuthGuard)
    @Get('profile')
    userProfile(@Request() req){
        let user = req.user
        console.log(user)
        delete user.password;
        return req.user;
    }

}
