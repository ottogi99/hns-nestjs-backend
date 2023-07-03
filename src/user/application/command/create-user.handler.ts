import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommnad } from "./create-user.command";
import * as uuid from 'uuid';
import { UserFactory } from "../../domain/user.factory";
import { IUSerRepository } from "src/user/domain/repository/iuser.repository";


@Injectable()
@CommandHandler(CreateUserCommnad)
export class CreateUserHandler implements ICommandHandler<CreateUserCommnad> {
  constructor(
    private userFactory: UserFactory,
    @Inject('UserRepository') private userRepository: IUSerRepository,
    // @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    // private emailService: EmailService,
    // private authService: AuthService,
    // private dataSource: DataSource,
    // private eventBus: EventBus,
  ){}

  async execute(command: CreateUserCommnad): Promise<any> {
    const { email, password, username } = command;

    const user = await this.userRepository.findByEmail(email);
    // const userExist = await this.checkUserExist(email);

    if (user !== null) {
    // if (userExist) {
      // 422 에러 발생
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    try {
      await this.userRepository.save(email, username, password, signupVerifyToken);

      this.userFactory.create(email, username, password, signupVerifyToken);
      // // await this.saveUser(email, password, username, signupVerifyToken);
      // await this.saveUserUsingQueryRunner(email, password, username, signupVerifyToken);      
      // // await this.sendMemberJoinEmail(email, signupVerifyToken);

      // this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
      // this.eventBus.publish(new TestEvent());
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  private async checkUserExist(email: string) {
    // const user = await this.userRepository.findOne({
    //   where: { email: email }
    // });

    // return user !== null;
  }

  private async saveUserUsingQueryRunner(email: string, password: string, username: string, signupVerifyToken: string) {
    // const querryRunner = this.dataSource.createQueryRunner();

    // await querryRunner.connect();
    // await querryRunner.startTransaction();

    // try {
    //   const user = new UserEntity();
    //   // user.id = ulid();
    //   user.email = email;
    //   user.password = password;
    //   user.username = username;
    //   user.signupVerifyToken = signupVerifyToken;

    //   await querryRunner.manager.save(user);

    //   // throw new InternalServerErrorException();  // 일부러 에러를 발생시켜 본다.

    //   await querryRunner.commitTransaction();
    // } catch (e) {
    //   // 에러가 발생하면 롤백
    //   await querryRunner.rollbackTransaction();
    //   throw (e);
    // } finally {
    //   await querryRunner.manager.release();
    // }
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // const result = await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    // // console.log(result);
  }

  // async verifyEmail(signupVerifyToken: string): Promise<string> {
  //   const user = await this.userRepository.findOne({
  //     where: { signupVerifyToken }
  //   });

  //   if (!user) {
  //     throw new NotFoundException('유저가 존재하지 않습니다.');
  //   }

  //   return this.authService.login({
  //     id: user.id,
  //     username: user.username,
  //     email: user.email,
  //   });
  // }
}