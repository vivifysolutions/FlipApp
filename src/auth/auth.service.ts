import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
    ForgotPasswordDto,
    LoginDto,
    RegisterDto,
    changePasswordDto
} from './dto/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { MailService } from 'src/mail-service/mail-service.service';
import { TwilioService } from 'src/shared/Twilio/twilio.service';
import { SmsDto } from 'src/shared/Twilio/dto/sms-dto';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private utilityService: UtilitiesService, private emailService: MailService, private smsService: TwilioService) { }


    // normal way to register  user 
    async signUp(registerDto: RegisterDto) {
        // generate hashed password 
        if (registerDto.password !== registerDto.confirm_password) {
            throw new HttpException('Password mismatch!', HttpStatus.BAD_REQUEST)

        }
        const hashPassword = await argon2.hash(registerDto.password)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    email: registerDto.email,
                    phonenumber: registerDto.phone_number,
                    above_18: registerDto.above_18,
                    accept_terms: registerDto.accept_terms,
                    location: registerDto.location,
                    password: hashPassword

                }
            })
            // send otp to phone number 
            const otpSMS = this.utilityService.getOtp()
            const otpEmail = this.utilityService.getOtp()
            const messageBody: SmsDto = {
                to: user.phonenumber,
                body: `Hello ${user.firstName} here is the otp ${otpSMS}`
            }
            // this.smsService.sendTextMessaeg(messageBody)
            // await this.emailService.sendMail(otpEmail, user.email, { otpEmail, name: user.firstName }, "otp")
            await this.prismaService.otp.create({
                data: {
                    otpPhone: otpSMS,
                    otpEmail: otpEmail,
                    userId: user.id,
                }
            })
            delete user.password;
            const accessToken = await this.utilityService.signPayload(user)
            return this.utilityService.apiResponse('success', 200, 'User created successfully', [accessToken]);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw Error;
        }
    }

    // normal way for users to login n
    async signIn(loginDto: LoginDto) {
        const { email, password } = loginDto;
        // check if the user exists 
        let user = await this.prismaService.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user) throw new ForbiddenException("Invalid credentials")
        const useractivities = await this.prismaService.userActivity.findMany({
            where: {
                userId: user.id
            }
        })
        const passwordMatch = await argon2.verify(user.password, password)
        if (!passwordMatch) throw new ForbiddenException("Invalid credentials")

        const modifiedUser = {
            ...user,
            activities: useractivities
        }

        const accessToken = await this.utilityService.signPayload(modifiedUser)


        return this.utilityService.apiResponse("Success", 200, "User logged in successfully", [accessToken])

    }

    // user sign  in using google 
    googleLogin() { }

    // user sign in using facebook 
    facebook() { }

    // user signin using twitter => currently X 
    twitter() { }


    // forgot password
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        // check if the user exist 
        const user = this.prismaService.user.findFirst({
            where: {
                email: forgotPasswordDto.email
            }
        })
        if (!user) return this.utilityService.apiResponse("Forbidden", 403, "Please recheck your password", []) ;
    }

    // function to verify phone number 
    async verifyPhonNumber(otp: number, userId: number) {
      try {
        const otpv = await this.prismaService.otp.findFirst({
            where: {
                otpPhone: otp,
                userId: userId,
                isOtpPhoneUsed: false
            }
        })

        if (otpv.otpPhone === otp) {
            return await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    is_phone_number_verified: true
                }
            })
        }
        else {
            return this.utilityService.apiResponse("Not Found", 504, "Token Expired", [] )
        }
      } catch (error) {
        return this.utilityService.apiResponse("Not Found", 504,  error.message,[] )
      }
    }

    // FUNCTION TO VERIFY EMAIL ADDRESS 

    async verifyEmailAddress(otp: number, userId: number) {
        try {
            const otpv = await this.prismaService.otp.findFirst({
                where: {
                    otpEmail: otp,
                    userId: userId,
                    isOtpEmailUsed: false

                }
            })
            if (otpv.otpEmail === otp) {
                return await this.prismaService.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        is_email_verified: true
                    }
                })
            }
            else {

                throw new HttpException('Token Expired', HttpStatus.NOT_FOUND)
            }
        } catch (error) {
            throw new HttpException('Token Expired', HttpStatus.NOT_FOUND)
        }
    }


    async changePassword(payload:changePasswordDto) {
        try {
            const getUser = await this.prismaService.user.findFirst({
                where: {
                    id: payload.userId,
                }
            })
            const decryptedPassword = await argon2.verify(getUser.password, payload.oldPassword); 
            if(!decryptedPassword){
                throw new HttpException('Your old password is incorrect', HttpStatus.NO_CONTENT)
            }
            
            if(!getUser){
                throw new HttpException('User does not Exist', HttpStatus.NO_CONTENT)
            }
            const decNewPassword = await argon2.hash(payload.newPassword);
            await this.prismaService.user.update({
                data:{
                    password: decNewPassword,
                },
                where:{
                    id: payload.userId,
                }
            })
            return this.utilityService.apiResponse('Success', 200, "Password updated successfully",[])
        } catch (error) {
            throw new HttpException('An Error Occured', HttpStatus.BAD_REQUEST)
        }

    }


    // end of forgot password  funtion 
}
