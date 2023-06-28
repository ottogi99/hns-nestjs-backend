import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { User } from './interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MyLogger } from 'src/logger/my.logger';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService,
    private authService: AuthService,
    // private logger: MyLogger,
  ){}

  async createUser(email: string, password: string, username: string) {
    const userExist = await this.checkUserExist(email);

    if (userExist) {
      // 422 에러 발생
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    try {
      // await this.saveUser(email, password, username, signupVerifyToken);
      await this.saveUserUsingQueryRunner(email, password, username, signupVerifyToken);      
      await this.sendMemberJoinEmail(email, signupVerifyToken);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  private async checkUserExist(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email }
    });

    return user !== null;
  }

  async saveUser(email: string, password: string, username: string, signupVerifyToken: string) {
    const user = new UserEntity();
    // user.id = ulid();
    user.email = email;
    user.password = password;
    user.username = username;
    user.signupVerifyToken = signupVerifyToken;
    await this.userRepository.save(user);
  }

  private async saveUserUsingQueryRunner(email: string, password: string, username: string, signupVerifyToken: string) {
    const querryRunner = this.dataSource.createQueryRunner();

    await querryRunner.connect();
    await querryRunner.startTransaction();

    try {
      const user = new UserEntity();
      // user.id = ulid();
      user.email = email;
      user.password = password;
      user.username = username;
      user.signupVerifyToken = signupVerifyToken;

      await querryRunner.manager.save(user);

      // throw new InternalServerErrorException();  // 일부러 에러를 발생시켜 본다.

      await querryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await querryRunner.rollbackTransaction();
      throw (e);
    } finally {
      await querryRunner.manager.release();
    }
  }

  private async saveUserUsingTransaction(email: string, password: string, username: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();

      user.email = email;
      user.password = password;
      user.username = username;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    })
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    const result = await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    // console.log(result);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email, password }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }

  @UseGuards(AuthGuard)
  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  }

  getAllUser(): any {
    // this.logger.debug('모든사용자');
    return 'This action returns all users';
  }

  delete(userId: number) {
    return `This action remove a #${userId} user`;
  }
}
