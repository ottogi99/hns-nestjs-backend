import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { User } from './interface/user.interface';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService){}

  async createUser(email: string, password: string, username: string) {
    await this.checkUserExist(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(email, password, username, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExist(email: string) {
    return false; //TODO: DB연동
  }

  saveUser(email: string, password: string, username: string, signupVerifyToken: string) {
    return; //TODO: DB연동
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
