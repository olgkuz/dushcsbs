import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendContactMail(name: string, phone: string, message: string): Promise<void> {
    const toEmail = this.configService.get<string>('RECEIVER_EMAIL');

    if (!toEmail) {
      throw new Error('Не указана почта получателя (RECEIVER_EMAIL)');
    }

    await this.mailerService.sendMail({
      to: toEmail,
      subject: 'Новая заявка с сайта ShowerGlass',
      text: `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`,
    });
  }
  async sendDesignerAssignment(params: {
  to: string;
  filePath: string;
  fileName: string;
  objectName: string;
  phone: string;
  comment: string;
}): Promise<void> {
  const { to, filePath, fileName, objectName, phone, comment } = params;

  await this.mailerService.sendMail({
    to,
    subject: 'Новое задание от дизайнера',
    text: `
Объект: ${objectName}
Телефон: ${phone}

Комментарий:
${comment}
    `,
    attachments: [
      {
        filename: fileName,
        path: filePath,
      },
    ],
  });
}

}
