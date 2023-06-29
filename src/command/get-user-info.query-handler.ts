import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Repository } from "typeorm";
import { GetUserInfoQuery } from "./get-user-info.query";
import UserEntity from "src/user/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/interface/user.interface";
import { NotFoundException } from "@nestjs/common";

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ){ }

  async execute(query: GetUserInfoQuery): Promise<User> {
    const { userId } = query;

    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username
    };
  }
}