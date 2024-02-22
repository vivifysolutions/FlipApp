import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { CommunityPostDto } from './Dto/communityPostDto';


@Injectable()
export class CommunityPostService {
    constructor(private prisma:PrismaService, private util:UtilitiesService){}
    // createPost 
    async CreateCommunityPost(userPk:number, payload:CommunityPostDto){ 
        try {
            return await this.prisma.post.create({
                data:{
                    userId:userPk,
                    title:payload.title,
                    description:payload.description,
                    date:payload.date,
                    time:payload.time,
                    activity: payload.activity
                },
            })
        } catch (error) {
            return new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
    // updatePost
    async UpdateCommunityPost(userPk:number, payload:CommunityPostDto){
        try {
            const getPost = await this.prisma.post.findFirst({where:{id:+payload.postId, userId:+userPk}})
            if(!getPost) return new HttpException("No post with that id Found", HttpStatus.NOT_FOUND)
            return await this.prisma.post.update({
                data:{
                    title:payload.title,
                    description:payload.description,
                    date:payload.date,
                    time:payload.time,
                    activity: payload.activity
                },
                where:{
                    id:+payload.postId
                }
            })
        } catch (error) {
            return new HttpException(error, HttpStatus.BAD_REQUEST)
        }
    }
    // get all users posts 
    async getAllUsersPosts(userId:number){
        try {
            const allPosts = await this.prisma.post.findMany({
                where:{
                    userId:userId,
                },
                select:{
                    id:true,
                    title: true,
                    description: true,
                    date: true,
                    time: true
                }
            }) 
            if(allPosts.length > 0) return allPosts
            return this.util.dataReponseObject("No posts founs", 204)
        } catch (error) {
            return new HttpException("Couldn't retrieve your posts,Please try again", HttpStatus.BAD_REQUEST)
        }
    }
    // deletePost
    async deletePost(userId:number, postId:number){
       try {
        const getPost = await this.prisma.post.findFirst({where:{id:+postId, userId:+userId}})
        if(!getPost) return new HttpException("No post with that id Found", HttpStatus.NOT_FOUND)
        await this.prisma.post.delete({where:{id:+postId, userId:+userId}})
        return this.util.dataReponseObject("Post deleted successfully", 200)
       } catch (error) {
            return new HttpException("Error deleting post", HttpStatus.BAD_REQUEST)
       }
    }
}
