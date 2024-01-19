import { ForbiddenException, Injectable } from '@nestjs/common';
import { ForgotPasswordDto, LoginDto, RegisterDto, verifyPhoneNumber } from './dto/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { MailService } from 'src/mail-service/mail-service.service';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private utilityService: UtilitiesService, private emailService:MailService) { }


    // normal way to register  user 
    async signUp(registerDto: RegisterDto) {
        // generate hashed password 
        const hashPassword = await argon2.hash(registerDto.password)
        try {
            const user = await this.prismaService.user.create({
                data: {
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    email: registerDto.email,
                    phonenumber: registerDto.phone_number,
                    password: hashPassword

                }
            })
            // send otp to phone number 
            const otp = this.utilityService.getOtp()
            await this.emailService.sendMail(otp, user.email, {otp,name:user.firstName}, "otp")
            await this.prismaService.otp.create({
                data: {
                    otp: otp,
                    userId: user.id,
                }
            })
            
            delete user.password;
            return this.utilityService.signPayload(user);
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
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user) throw new ForbiddenException("Invalid credentials")
        const passwordMatch = await argon2.verify(user.password, password)
        if (!passwordMatch) throw new ForbiddenException("Invalid credentials")

        return this.utilityService.signPayload(user)

    }

    // user sign  in using google 
    googleLogin() { }

    // user sign in using facebook 
    facebook() { }

    // user signin using twitter => currently X 
    twitter() { }


    // forgot password
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        // check if hte user exist 
        const user = this.prismaService.user.findFirst({
            where: {
                email: forgotPasswordDto.email
            }
        })
        if (!user) throw new ForbiddenException("Please recheck your email address");
    }

    async verifyPhonNumber(otp: number, userId: number){
        const otpv = await this.prismaService.otp.findFirst({
            where:{
                otp: otp, 
                userId: userId
            }
        })
        if(otpv.otp === otp){
            return await this.prismaService.user.update({
                where:{
                    id: userId,
                },
                data:{
                    is_phone_number_verified:true
                }
            })
        }
        else{
            
            console.log("sdfbdsjfh")


            
        }
    }

    changePassword() {


    }

    // validate otp sent to the phone number 
    verifyPhoneNumber(){}
    // end of validating the phone number 

    // end of forgot password  funtion 
}
