import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { User } from './interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService: EmailService
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
    console.log(result);
  }

  verifyEmail(signupVerifyToken: string): string | PromiseLike<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
    // 2. 바로 로그인 상태가 퇴도록 JWT 발급

    throw new Error('Method not implemented.');
  }

  login(email: string, password: string): string | PromiseLike<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급

    throw new Error('Method not implemented.');
  }

  async getUser(userId: string): Promise<User> {
    // TODO
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 User 타입으로 응답

    throw new Error('Method not implemented.');
  }

  delete(userId: number) {
    return `This action remove a #${userId} user`;
  }
}
