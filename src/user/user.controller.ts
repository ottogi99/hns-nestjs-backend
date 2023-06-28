import { Headers, Body, Controller, Delete, Get, Param, Post, Query, Inject, LoggerService, InternalServerErrorException, Logger, BadRequestException, UseFilters } from '@nestjs/common';
import { CreateUserDto, UserLoginDto, VerifyEmailDto } from './dto/user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
// import { Logger as WinstonLogger } from 'winston';
// import { WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// @UseFilters(HttpExceptionFilter)
@Roles('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Post()
  @Roles('admin')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // this.printWinstonLog(dto);
    // this.printLoggerServiceLog(dto);
    const { email, password, username } = dto;
    await this.userService.createUser(email, password, username);
  }

  printLoggerServiceLog(dto: CreateUserDto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  printWinstonLog(dto: CreateUserDto) {
    // console.log(this.logger.name);
    
    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    // this.logger.info('info: ', dto);
    // this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    // this.logger.silly('silly: ', dto);
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
  async getAllUser(): Promise<string> {
    return await this.userService.getAllUser();
    // return '모든 사용자';
  }

  @Get('/:id')
  async getUser(@Headers() headers: any, @Param('id') userId: number): Promise<User> {
    // const jwtString = headers.authorization.split('Bearer ')[1];

    // this.authService.verify(jwtString);

    if (+userId < 1) {
      throw new BadRequestException('id는 0보다 큰 정수여야 합니다.');
      // throw new BadRequestException('id는 0보다 큰 정수여야 합니다.', 'id format exception');
    }

    return await this.userService.getUser(userId);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.delete(+id);
  }
}
