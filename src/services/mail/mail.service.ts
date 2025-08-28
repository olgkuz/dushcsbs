// mail.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { lookup as mimeLookup } from 'mime-types';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  // === ВЕРНУЛИ метод для контактной формы ===
  async sendContactMail(name: string, phone: string, message: string): Promise<void> {
    const toEmail = this.config.get<string>('RECEIVER_EMAIL');
    const fromEmail = this.config.get<string>('MAIL_USER');

    if (!toEmail) {
      throw new BadRequestException('Не указана почта получателя (RECEIVER_EMAIL)');
    }
    if (!fromEmail) {
      throw new InternalServerErrorException('MAIL_USER не задан (отправитель)');
    }

    // Если в поле "phone" случайно пришла почта — положим её в replyTo
    const looksLikeEmail = typeof phone === 'string' && phone.includes('@');

    try {
      await this.mailerService.sendMail({
        from: `"ShowerGlass" <${fromEmail}>`,
        to: toEmail,
        replyTo: looksLikeEmail ? phone : undefined,
        subject: 'Новая заявка с сайта ShowerGlass',
        text:
`Имя: ${name || '-'}
Телефон/Email: ${phone || '-'}
Сообщение:
${message || '-'}`,
      });
    } catch (e: any) {
      if (e?.responseCode === 550) {
        throw new BadRequestException('Почтовый сервер отклонил письмо: проверьте адреса (550).');
      }
      throw new InternalServerErrorException(`Не удалось отправить письмо: ${e?.message ?? 'unknown'}`);
    }
  }

  // === уже был метод для задания от дизайнера ===
  async sendDesignerAssignment(params: {
    to: string;
    filePath: string;
    fileName: string;
    objectName: string;
    phone: string;
    comment?: string;
    cc?: string[];
    replyTo?: string;
  }): Promise<void> {
    const { to, filePath, fileName, objectName, phone, comment, cc, replyTo } = params;
    const fromEmail = this.config.get<string>('MAIL_USER');

    if (!to) throw new BadRequestException('E-mail получателя пуст.');
    if (!fromEmail) throw new InternalServerErrorException('MAIL_USER не задан (отправитель).');
    if (!filePath || !existsSync(filePath)) throw new BadRequestException('Файл для отправки не найден.');
    if (!objectName || !phone) throw new BadRequestException('Заполните название объекта и телефон.');

    const safeName = fileName
      .normalize('NFKD')
      .replace(/[^\w.\-]+/g, '_')
      .replace(/_+/g, '_');

    try {
      const info = await this.mailerService.sendMail({
        from: `"ShowerGlass" <${fromEmail}>`,
        to,
        cc: cc && cc.length ? cc : undefined,
        replyTo,
        subject: 'Новое задание от дизайнера',
        text:
`Объект: ${objectName}
Телефон: ${phone}

Комментарий:
${comment ?? '-'}`,
        attachments: [
          {
            filename: safeName,
            path: filePath,
            contentType: mimeLookup(filePath) || undefined,
          },
        ],
      });

      if ((info as any)?.rejected?.length) {
        throw new BadRequestException(
          `Почтовый сервер отклонил адрес(а): ${(info as any).rejected.join(', ')}`
        );
      }
    } catch (e: any) {
      if (e?.responseCode === 550) {
        throw new BadRequestException('Почтовый сервер отклонил письмо (550). Проверьте from/to и существование ящиков.');
      }
      throw new InternalServerErrorException(`Не удалось отправить письмо: ${e?.message ?? 'unknown'}`);
    }
  }
}
