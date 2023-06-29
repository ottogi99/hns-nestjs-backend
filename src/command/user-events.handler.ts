import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TestEvent } from "./test.event";
import { UserCreatedEvent } from "./user-created.event";
import { EmailService } from "src/email/email.service";
import { Injectable } from "@nestjs/common";

@Injectable()
@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent | TestEvent> {
  constructor(
    private emailService: EmailService,
  ) {}

  async handle(event: UserCreatedEvent | TestEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
        break;
      }
      case TestEvent.name: {
        console.log('TestEvent');
        break;
      }
      default:
        break;
    }
  }
}