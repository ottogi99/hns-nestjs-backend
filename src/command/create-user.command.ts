import { ICommand } from "@nestjs/cqrs";

export class CreateUserCommnad implements ICommand {
  constructor(
    readonly email: string,
    readonly username: string,
    readonly password: string,
  ) {}
}