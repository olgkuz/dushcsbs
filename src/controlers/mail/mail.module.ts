// controlers/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '@app/services/mail/mail.service';
import { MailController } from './mail.controller';  // ← добавь импорт контроллера

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: 'smtp.mail.ru',
          port: 465,
          secure: true,
          auth: {
            user: cfg.get<string>('MAIL_USER'),
            pass: cfg.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"ShowerGlass" <${cfg.get<string>('MAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],          // ← ЭТО ВАЖНО
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}


