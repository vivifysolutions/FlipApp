import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommunityPostService } from './community-post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommunityPostDto } from './Dto/communityPostDto';

@Controller('community-post')
export class CommunityPostController {
    constructor(private communitPostService:CommunityPostService){} 

    /**
     * 
     * User create Post
     */
    @UseGuards(AuthGuard)
    @Post('post')
    CreateCommunityPost(@Request() req, @Body() body:CommunityPostDto){
        const user = req.user;
        return this.communitPostService.CreateCommunityPost(+user.id, body)
    }

    /**
     * user update post
     */
    @UseGuards(AuthGuard)
    @Put('updatePost/:postId')
    UpdateCommunityPost(@Param('postId') postId:number, @Request() req, @Body() body:CommunityPostDto){
        const user = req.user;
        const payload = {
            ...body,
            postId:postId
        }
        return this.communitPostService.UpdateCommunityPost(user.id, payload)
    }

    /**
     * get all users post
     */
    @UseGuards(AuthGuard)
    @Get("allPosts")
    getAllUsersPosts(@Request() req){
        const id = req.user.id;
        return this.communitPostService.getAllUsersPosts(+id);
    }

    /**
     * user delete post
     */
    @UseGuards(AuthGuard)
    @Delete('deletePost/:postId')
    deletePost(@Param('postId') postId:number, @Request() req){
        const user = req.user
        return this.communitPostService.deletePost(user.id, postId)
    }

}
