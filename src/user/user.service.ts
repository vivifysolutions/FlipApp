import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as AWS from "aws-sdk"
import { ConfigService } from '@nestjs/config';
import { PutObjectAclCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UserService {

    private s3Client: S3Client;

    constructor(private prismaService: PrismaService, private config: ConfigService) {
         // configure aws s3 creds
        this.s3Client = new S3Client({
            region:'us-east-1',
            credentials:{
                accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
                
            }
            
        })
           
    // end of configuring aws 
     }

   
 

    // get user information 

    async getUsers() {
        const users = await this.prismaService.user.findMany()
        return users;
    }

    async updateUserProfile(userId: number, userInfo:UserDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: userId
                }
            })

            if (!user) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND)

            await this.prismaService.user.updateMany({
                data: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    bio: userInfo.bio,
                    gender: userInfo.gender,
                    photoUrl: userInfo.photoUrl,
                    username: userInfo.username,
                    // location: {
                    //     name:userInfo.location.name,
                    //     lat: userInfo.location.lat,
                    //     long: userInfo.location.long
                    // }
                },
                where: {
                    id: userId
                }
            }) 

            const updateUser = await this.prismaService.user.findFirst({
                where:{
                    id: userId
                }
            })

            return updateUser;

        } catch (error) {
            throw new HttpException("Username Already exist", HttpStatus.NOT_ACCEPTABLE)
        }

    }


    async uploadProfilePicService(fileBuffer:Buffer, filename:string){
        try {
            const params = {
                Bucket: this.config.get('AWS_STORAGE_BUCKET_NAME'),
                Key: filename,
                Body: fileBuffer,
            }
            const result = await this.s3Client.send(new PutObjectCommand(params));
            return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
        } catch (error) {
            throw new HttpException("Failed to upload profile picture", HttpStatus.BAD_REQUEST)
        }
    }

}
