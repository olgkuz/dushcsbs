import { Module } from '@nestjs/common';
import { DesignersController } from './designers.controller';
import { MailModule } from '@app/controlers/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MailModule, JwtModule], // если jwt-guard требует
  controllers: [DesignersController],
})
export class DesignersModule {}
