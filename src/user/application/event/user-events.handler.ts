import { Inject, Injectable } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailService } from "src/email/email.service";
import { TestEvent } from "./test.event";
import { UserCreatedEvent } from "../../domain/user-created.event";
import { IEmailService } from "../adapter/iemail.service";

@Injectable()
@EventsHandler(UserCreatedEvent, TestEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent | TestEvent> {
  constructor(
    @Inject('EmailService') private emailService: IEmailService,
    // private emailService: EmailService,
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