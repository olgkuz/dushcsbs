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

      // для ясности: если SMTP вернул rejected — считаем ошибкой
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

  // sendContactMail оставляй как есть — он у тебя уже работает
}


