import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MailService } from '@app/services/mail/mail.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('designers')
export class DesignersController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(JwtAuthGuard)
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  })
}))
async handleDesignerUpload(
  @UploadedFile() file: Express.Multer.File,
  @Body('objectName') objectName: string,
  @Body('phone') phone: string,
  @Body('comment') comment: string,
  @Req() req: any
) {
  console.log('Получен файл:', file); // ← для отладки
  console.log('Данные:', { objectName, phone, comment }); // ← для отладки

  try {
    await this.mailService.sendDesignerAssignment({
      to: req.user.email,
      filePath: file.path,
      fileName: file.originalname,
      objectName,
      phone,
      comment
    });
    return { success: true };
  } catch (err) {
    console.error('Ошибка:', err);
    throw new Error('Не удалось отправить файл');
  }
}}
