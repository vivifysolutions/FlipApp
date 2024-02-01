import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { RoleGuard } from './RoleGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }
    /**
     * 
     * @param req 
     * @returns user profile information
     */

    // this is for admins only 
    @UseGuards(AuthGuard, RoleGuard)
    @Get('users')
    async Profile(@Request() req) {
        return this.userService.getUsers();
    }


    
    // user update profiles 
    @UseGuards(AuthGuard)
    @Put('updateProfile/:id')
    @UseInterceptors(FileInterceptor('file'))
    async userUpdateProfile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: UserDto) {
        const fileBufferuffer = file.buffer;
        const filename = file.originalname;
        const s3Url = await this.userService.uploadProfilePicService(fileBufferuffer, filename);
        const location = JSON.parse(body.location as string)
        console.log(location.name)
        const payload = {
            ...body,
            photoUrl: s3Url,
            location:{
                name:location.name,
                lat:location.lat,
                long:location.long
            }
        }
        return this.userService.updateUserProfile(+id, payload)
    }
    // end of user updating profiles 
    // get user profile 
    @Get('userProfile/:id')
    getUserProfile(@Param('id') id: string){
        return this.userService.getUserProfile(id)
    }

}
