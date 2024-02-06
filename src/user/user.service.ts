import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as AWS from "aws-sdk"
import { ConfigService } from '@nestjs/config';
import { PutObjectAclCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MailService } from 'src/mail-service/mail-service.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { SmsDto } from 'src/shared/Twilio/dto/sms-dto';
import { TwilioService } from 'src/shared/Twilio/twilio.service';
import { from, mergeMap, toArray } from 'rxjs';

@Injectable()
export class UserService {

    private s3Client: S3Client;

    constructor(private prismaService: PrismaService, private config: ConfigService, 
        private emailService: MailService, 
        private utilityService: UtilitiesService,
        private smsService: TwilioService) {
        // configure aws s3 creds
        this.s3Client = new S3Client({
            region: 'us-east-1',
            credentials: {
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

    async updateUserProfile(userId: number, userInfo: UserDto) {
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: userId
                }
            })

            if (!user) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND)

            if (user.username === userInfo.username) throw new HttpException("Username Already exist", HttpStatus.NOT_ACCEPTABLE)

              // check if the phone number or email has been update and send verification code 
              if (userInfo.phonenumber !== user.phonenumber || userInfo.email !== user.email) {
                await this.prismaService.user.updateMany({
                    data: {
                        is_email_verified: false,
                        is_phone_number_verified: false
                    }
                })

                // generate new email and phone number token 
                const otpSMS = this.utilityService.getOtp()
                const otpEmail = this.utilityService.getOtp()
                const messageBody: SmsDto = {
                    to: user.phonenumber,
                    body: `Hello ${user.firstName} here is the otp ${otpSMS}`
                }
                this.smsService.sendTextMessaeg(messageBody)
                await this.emailService.sendMail(otpEmail, userInfo.email, { otpEmail, name: userInfo.firstName }, "otp")
                await this.prismaService.otp.updateMany({
                    data: {
                        otpEmail: otpEmail,
                        otpPhone: otpSMS
                    }
                })
            }


            await this.prismaService.user.updateMany({
                data: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    bio: userInfo.bio,
                    phonenumber: userInfo.phonenumber,
                    email: userInfo.email,
                    gender: userInfo.gender,
                    photoUrl: userInfo.photoUrl,
                    username: userInfo.username,
                    location: {
                        name: userInfo.location.name,
                        lat: userInfo.location.lat,
                        long: userInfo.location.long
                    }
                },
                where: {
                    id: userId
                }
            })
            
            // get update user 
            const updateUser = await this.prismaService.user.findFirst({
                where: {
                    id: userId
                }
            })


            return {
                ...updateUser
            };

        } catch (error) {
            throw new Error(error.message)
        }

    }

    async getUserProfile(userId:string){
        try {
            const user = await this.prismaService.user.findFirst({
                where: {
                    id: +userId
                }
            })

            if (!user) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND)
            const userActivities = await this.prismaService.userActivity.findMany({
                where: {
                    userId: +userId
                }
            })
        //  for(let act of userActivities){
        //     const singleactivity = await this.prismaService.activity.findFirst({
        //         where:{
        //             id: act.activity_id
        //         }
        //     })

            
        //  }
         
            const userEvents = await this.prismaService.event.findMany({
                where: {
                    hostId: +userId
                }
            })
            return {
                ...user,
                activities: userActivities,
                events: userEvents
            };
            
        } catch (error) {
            throw new Error(error.message)
        }
    }


    async uploadProfilePicService(fileBuffer: Buffer, filename: string) {
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



 // get event attendees 
            
            // const eventatt$ = from(userEvents).pipe(
            //   mergeMap(async (event) => {
            //     const attendees = await this.prismaService.eventAttendee.findMany({
            //       where: {
            //         eventId: event.id,
            //       },
            //     });

            //     const user = 
            
            //     const userData = await this.prismaService.user.findFirst({
            //       where: {
            //         id: userId,
            //       },
            //     });
            
            //     return { event, attendees, userData };
            //   }),
            //   toArray()
            // );
            
            // eventatt$.subscribe((eventDataArray) => {
            //   // Handle the optimized result
            //   console.log(eventDataArray);
            // });
            

            // console.log(eventatt$)