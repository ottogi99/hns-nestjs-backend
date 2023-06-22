import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto, UserLoginDto, VerifyEmailDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  
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
    return;
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<User> {
    console.log(userId);
    return
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
