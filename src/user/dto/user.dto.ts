export class CreateUserDto {
  readonly email: string;
  readonly password: string;
  readonly username: string;
}

export class VerifyEmailDto {
  signupVerifyToken: string;
}

export class UserLoginDto {
  email: string;
  password: string;
}

