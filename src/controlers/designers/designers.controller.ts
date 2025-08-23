import {
  Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Req,
  BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MailService } from '@app/services/mail/mail.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';

@Controller('designers')
export class DesignersController {
  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const dir = join(process.cwd(), 'uploads');
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        cb(null, dir);
      },
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    })
  }))
  async handleDesignerUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('objectName') objectName: string,
    @Body('phone') phone: string,
    @Body('comment') comment: string,
    @Req() req: any
  ) {
    if (!file) throw new BadRequestException('Файл не получен.');
    if (!objectName || !phone) throw new BadRequestException('Заполните название объекта и телефон.');
    if (!req?.user?.email) throw new BadRequestException('В токене не найден email пользователя.');

    const receiver = (this.config.get<string>('RECEIVER_EMAIL') || '').trim().toLowerCase();
    const userEmail = (req.user.email || '').trim().toLowerCase();

    const cc = isEmail(userEmail) ? [userEmail] : [];
    const replyTo = isEmail(userEmail) ? userEmail : undefined;

    try {
      await this.mailService.sendDesignerAssignment({
        to: receiver,                   // ← основной адрес (гарантированно принимает)
        cc,                             // ← копия пользователю (если валиден)
        replyTo,                        // ← ответ уйдёт автору
        filePath: file.path,
        fileName: file.filename,
        objectName,
        phone,
        comment,
      });
      return { success: true };
    } catch (e: any) {
      // лог оставь для дебага
      console.error('SMTP FAIL:', {
        code: e?.code, responseCode: e?.responseCode, message: e?.message
      });
      if (e?.status && e?.response) throw e;
      throw new InternalServerErrorException(`SMTP error: ${e?.message || 'unknown'}`);
    }
  }
}
