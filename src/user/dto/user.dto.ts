import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { NotIn } from "src/decorator/not-in";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.username.trim())) {
  //     throw new BadRequestException('password는 name과 같은 문자열을 포함할 수 없습니다.');
  //   }
  //   return value.trim();
  // })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;


  // @Transform(params => {
  //   console.log(params);
  //   return params.value;
  // })
  // https://escapefromcoding.tistory.com/289 : 정규식 참고
  @Transform(params => {
    const val = params.value.trim()
    return val;
  })
  @NotIn('password', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.'})
  @Matches(/^[0-9|a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/)
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

