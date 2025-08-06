import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendContactMail(name: string, phone: string, message: string) {
    await this.mailerService.sendMail({
      to: 'your-email@gmail.com',
      subject: 'Новая заявка с сайта ShowerGlass',
      text: `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`,
    });
  }
}
