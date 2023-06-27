import { Headers, Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto, UserLoginDto, VerifyEmailDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}
  
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { email, password, username } = dto;
    await this.userService.createUser(email, password, username);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.userService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.userService.login(email, password);
  }

  @Get()
  getAllUser(@Param('id') userId: string): any {
    return '모든 사용자';
  }

  @Get('/:id')
  async getUser(@Headers() headers: any, @Param('id') userId: number): Promise<User> {
    // const jwtString = headers.authorization.split('Bearer ')[1];

    // this.authService.verify(jwtString);

    return await this.userService.getUser(userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
