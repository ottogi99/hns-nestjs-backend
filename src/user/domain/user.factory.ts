import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { UserCreatedEvent } from "./user-created.event";
import { User } from './user';

@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) { }

  // id: string,
  create(
    email: string,
    username: string,
    password: string,
    signupVerifyToken: string,
  ): User {
    // const user = new User(id, name, email, password, signupVerifyToken);
    const user = new User(email, username, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }

  reconstitute(username: string, email: string, signupVerifyToken: string, password: string): User {
    return new User(username, email, password, signupVerifyToken);
  }
}