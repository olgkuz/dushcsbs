// mail.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { lookup as mimeLookup } from 'mime-types';

const lookupMimeType: (path: string) => string | false = mimeLookup as (
  path: string,
) => string | false;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractMessage = (value: unknown): string =>
  isRecord(value) && typeof value.message === 'string'
    ? value.message
    : 'unknown';

const extractResponseCode = (value: unknown): number | undefined =>
  isRecord(value) && typeof value.responseCode === 'number'
    ? value.responseCode
    : undefined;

const extractRejected = (value: unknown): string[] =>
  isRecord(value) && Array.isArray(value.rejected)
    ? value.rejected.filter(
        (item): item is string => typeof item === 'string' && item.length > 0,
      )
    : [];

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService,
  ) {}

  // === Contact form notifications ===
  async sendContactMail(
    name?: string | null,
    phone?: string | null,
    message?: string | null,
  ): Promise<void> {
    const safeName = typeof name === 'string' ? name.trim() : '';
    const safePhone = typeof phone === 'string' ? phone.trim() : '';
    const safeMessage = typeof message === 'string' ? message.trim() : '';

    const toEmail = this.config.get<string>('RECEIVER_EMAIL');
    const fromEmail = this.config.get<string>('MAIL_USER');

    if (!toEmail) {
      throw new BadRequestException(
        'Receiver email is not configured (RECEIVER_EMAIL).',
      );
    }
    if (!fromEmail) {
      throw new InternalServerErrorException(
        'MAIL_USER is not configured on the server.',
      );
    }

    const looksLikeEmail = safePhone.includes('@');

    try {
      await this.mailerService.sendMail({
        from: `"ShowerGlass" <${fromEmail}>`,
        to: toEmail,
        replyTo: looksLikeEmail ? safePhone : undefined,
        subject: 'ShowerGlass contact form submission',
        text: `Name: ${safeName || '-'}
Phone/Email: ${safePhone || '-'}
Message:
${safeMessage || '-'}`,
      });
    } catch (error: unknown) {
      if (extractResponseCode(error) === 550) {
        throw new BadRequestException(
          'SMTP rejected the recipient address (response code 550).',
        );
      }
      throw new InternalServerErrorException(
        `Failed to send contact email: ${extractMessage(error)}`,
      );
    }
  }

  // === Designer assignment notifications ===
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
    const { to, filePath, fileName, objectName, phone, comment, cc, replyTo } =
      params;
    const fromEmail = this.config.get<string>('MAIL_USER');

    if (!to) {
      throw new BadRequestException('Recipient email is required.');
    }
    if (!fromEmail) {
      throw new InternalServerErrorException(
        'MAIL_USER is not configured on the server.',
      );
    }
    if (!filePath || !existsSync(filePath)) {
      throw new BadRequestException('Attachment file not found on disk.');
    }
    if (!objectName || !phone) {
      throw new BadRequestException(
        'Object name and phone number must be provided.',
      );
    }

    const safeName = fileName
      .normalize('NFKD')
      .replace(/[^\w.-]+/g, '_')
      .replace(/_+/g, '_');

    const mimeType = lookupMimeType(filePath);
    const contentType = typeof mimeType === 'string' ? mimeType : undefined;

    try {
      const info: unknown = await this.mailerService.sendMail({
        from: `"ShowerGlass" <${fromEmail}>`,
        to,
        cc: cc && cc.length ? cc : undefined,
        replyTo,
        subject: 'New designer assignment',
        text: `Object: ${objectName}
Phone: ${phone}

Comment:
${comment ?? '-'}`,
        attachments: [
          {
            filename: safeName,
            path: filePath,
            contentType,
          },
        ],
      });

      const rejected = extractRejected(info);
      if (rejected.length) {
        throw new BadRequestException(
          `SMTP rejected recipients: ${rejected.join(', ')}`,
        );
      }
    } catch (error: unknown) {
      if (extractResponseCode(error) === 550) {
        throw new BadRequestException(
          'SMTP rejected the recipient address (response code 550).',
        );
      }
      throw new InternalServerErrorException(
        `Failed to send designer assignment email: ${extractMessage(error)}`,
      );
    }
  }
}
