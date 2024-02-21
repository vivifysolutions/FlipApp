import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';


export class RegisterDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6, { message: "Passwords must be six or more chartactrers" })
  password: string;
  @IsNotEmpty({message: "Please confirm Password"})
  confirm_password:string;
  @MaxLength(20, { message: "Phone  number is invalid" })
  @MinLength(9, { message: "Enter a valid phone number" })
  phone_number?: string;

  
  location: {
    name: string;
    lat: GLfloat;
    long: GLfloat;
  };

  @IsNotEmpty({message:"Confirm if you're above 18 years"})
  above_18: boolean;
  @IsNotEmpty({message:"Please accept terms and conditions to proceed"})
  accept_terms: boolean;


}


export class LoginDto {
  @IsEmail()
  email?: string;
  @IsString()
  password: string;
}


export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

}


export interface verifyPhoneNumber {
  otp: number;
  userId: number;
}


export interface changePasswordDto{
  userId?: number;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

