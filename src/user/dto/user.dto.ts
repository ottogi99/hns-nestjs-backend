import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

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

