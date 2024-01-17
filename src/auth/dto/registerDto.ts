import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto{
    @IsNotEmpty()
    firstName: string;
    @IsNotEmpty()
    lastName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @MinLength(6,{message:"Passwords must be six or more chartactrers"} )
    password: string;
    @MaxLength(20,{message:"Phone  number is invalid"} )
    @MinLength(9, {message:"Enter a valid phone number"})
    phone_number?: string;
} 


export class LoginDto{
    @IsEmail()
    email?: string;
    @IsString()
    password: string;
}