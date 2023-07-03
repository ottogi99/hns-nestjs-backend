import { Injectable } from "@nestjs/common";
import { IEmailService } from "src/user/application/adapter/iemail.service";
import { EmailService as ExternalEmailService } from "src/email/email.service";

@Injectable()
export class EmailService implements IEmailService {
  constructor(
    private emailService: ExternalEmailService,
  ) { }

  async sendMemberJoinVerification(email: any, signupVerifyToken: any): Promise<void> {
    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}