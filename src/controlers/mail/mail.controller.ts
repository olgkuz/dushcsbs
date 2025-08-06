import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './services/';

@Controller('contact')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async handleContact(@Body() body: { name: string; phone: string; message: string }) {
    await this.mailService.sendContactMail(body.name, body.phone, body.message);
    return { success: true };
  }
}
