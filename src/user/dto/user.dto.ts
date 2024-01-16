import {
  IsEmail,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @MinLength(50, {
    message: 'Username is too long',
  })
  @IsString()
  username: string;

  @IsEmail()
  email: string;
  profilePic: string;

  @MaxLength(15, {
    message: ' Phone number must not exceed the 15 chahracters',
  })
  @IsInt()
  phoneNumber: number;
  @IsString()
  location: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
