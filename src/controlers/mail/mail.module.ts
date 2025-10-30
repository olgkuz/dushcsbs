import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Если у тебя есть alias "@app/*" — оставь эту строку.
// Если alias нет, замени на относительный путь: '../../services/mail/mail.service'
import { MailService } from '@app/services/mail/mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const host = cfg.get<string>('MAIL_HOST') || 'smtp.mail.ru';
        const port = Number(cfg.get<string>('MAIL_PORT') ?? 587); // по умолчанию 587 (STARTTLS)
        const secureEnv = cfg.get<string>('MAIL_SECURE'); // 'true'/'false'
        const secure = secureEnv != null ? secureEnv === 'true' : port === 465; // 465 => SSL

        const user = cfg.get<string>('MAIL_USER');
        const pass = cfg.get<string>('MAIL_PASS');

        if (!user || !pass) {
          throw new Error('MAIL_USER/MAIL_PASS не заданы в .env');
        }

        return {
          transport: {
            host,
            port,
            secure,
            auth: { user, pass },
          },
          defaults: {
            from: `"ShowerGlass" <${cfg.get<string>('MAIL_FROM') || user}>`,
          },
        };
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
