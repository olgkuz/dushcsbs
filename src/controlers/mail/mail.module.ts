import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '@app/services/mail/mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.mail.ru', // ✅ правильный хост для Mail.ru
          port: 465,
          secure: true,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"ShowerGlass" <${config.get<string>('SMTP_USER')}>`,
        },
      }),
    }),
  ],
  controllers: [MailController], // ✅ ← ВОТ ЗДЕСЬ ДОЛЖНО БЫТЬ
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

