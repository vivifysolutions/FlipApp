import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommunityPostService } from './community-post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommunityPostDto } from './Dto/communityPostDto';

@Controller('community-post')
export class CommunityPostController {
    constructor(private communitPostService: CommunityPostService) { }
    /**
     * 
     * User create Post
     */
    @UseGuards(AuthGuard)
    @Post('post')
    CreateCommunityPost(@Request() req, @Body() body: CommunityPostDto) {
        const user = req.user;
        return this.communitPostService.CreateCommunityPost(+user.id, body)
    }

    /**
     * user update post
     */
    @UseGuards(AuthGuard)
    @Put('updatePost/:postId')
    UpdateCommunityPost(@Param('postId') postId: number, @Request() req, @Body() body: CommunityPostDto) {
        const user = req.user;
        const payload = {
            ...body,
            postId: postId
        }
        return this.communitPostService.UpdateCommunityPost(user.id, payload)
    }

    /**
     * get all users post
     */
    @UseGuards(AuthGuard)
    @Get("alluserPosts")
    getAllUsersPosts(@Request() req) {
        const id = req.user.id;
        return this.communitPostService.getAllUsersPosts(+id);
    }

    /**
     * get all posts
     */
    @UseGuards(AuthGuard)
    @Get("allPosts")
    async getTotalPosts(@Request() req, @Query('location') location: string, @Query('activity') activity: string) {
        try {
            const id = req.user.id;
            const query = req.query;
            let data = await this.communitPostService.getTotalPosts(+id);
            if (query.location) {
                data = data.filter(post => post.location.toLowerCase().includes(query.location.toLowerCase()));
            }
            if (query.activity) {
                data = data.filter(post => post.activity.toLowerCase().includes(query.activity.toLowerCase()));
            }
            return data
        } catch (error) {
            return new HttpException(error, HttpStatus.BAD_REQUEST)
        }

    }

    /**
     * user delete post
     */
    @UseGuards(AuthGuard)
    @Delete('deletePost/:postId')
    deletePost(@Param('postId') postId: number, @Request() req) {
        const user = req.user
        return this.communitPostService.deletePost(user.id, postId)
    }

}
