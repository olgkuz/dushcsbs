import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // пример для Gmail
        port: 465,
        secure: true,
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-password-or-app-password',
        },
      },
      defaults: {
        from: '"ShowerGlass" <your-email@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: null,
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
