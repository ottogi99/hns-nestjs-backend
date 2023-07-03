import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUSerRepository } from "src/user/domain/repository/iuser.repository";
import UserEntity from "../entity/user.entity";
import { Connection, Repository } from "typeorm";
import { UserFactory } from "src/user/domain/user.factory";
import { User } from "src/user/domain/user";

@Injectable()
export class UserRepository implements IUSerRepository {
  constructor(
    private connection: Connection,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private userFactory: UserFactory,
  ) { }

  async findByEmail(email: string):  Promise<User | null> {
    const UserEntity = await this.userRepository.findOne({
      where: { email }
    });

    if (!UserEntity) {
      return null;
    }

    const { id, username, signupVerifyToken, password } = UserEntity;

    // UserFactory의 create 함수로 로직 내에는 UserCreateEvent를 발행하는 로직이 포함되어 있어 재사용할 수 없습니다.
    // 유저 도메인 객체를 생성하는 reconstitute 함수를 사용합니다.
    return this.userFactory.reconstitute(id, username, email, signupVerifyToken, password);   
  }

  async save(email: string, username: string, pasword: string, signupVerifyToken: string): Promise<void> {
    await this.connection.transaction(async manager => {
      const user = new UserEntity();
      user.email = email;
      user.username = username;
      user.password = pasword;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    })
  }
}