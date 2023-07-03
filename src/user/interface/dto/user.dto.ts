import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)  
  readonly password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly username: string;
}

export class VerifyEmailDto {
  signupVerifyToken: string;
}
  
export class UserLoginDto {
  email: string;
  password: string;
}

