import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/registerDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService, private utilityService: UtilitiesService) { }


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

    // user sign  in usin google 
    googleLogin() { }

    // user sign in using facebook 
    facebook() { }

    // user signin using twitter => currently X 
    twitter() { }
}
