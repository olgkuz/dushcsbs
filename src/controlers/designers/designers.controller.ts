import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { MailService } from '@app/services/mail/mail.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';

interface DesignerRequest extends Request {
  user?: {
    email?: string;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

@Controller('designers')
export class DesignersController {
  constructor(
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = join(process.cwd(), 'uploads');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  async handleDesignerUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('objectName') objectName: string,
    @Body('phone') phone: string,
    @Body('comment') comment: string,
    @Req() req: DesignerRequest,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Uploaded file is required for designer tasks.',
      );
    }
    if (!objectName || !phone) {
      throw new BadRequestException('Object name and phone must be provided.');
    }
    if (!req.user?.email) {
      throw new BadRequestException('Authenticated user email is required.');
    }

    const receiverEnv = this.config.get<string>('RECEIVER_EMAIL');
    const receiver = (receiverEnv ?? '').trim().toLowerCase();
    const userEmailRaw = req.user.email ?? '';
    const userEmail = userEmailRaw.trim().toLowerCase();

    const cc = isEmail(userEmail) ? [userEmail] : [];
    const replyTo = isEmail(userEmail) ? userEmail : undefined;

    try {
      await this.mailService.sendDesignerAssignment({
        to: receiver, // default recipient for designer assignments
        cc, // optionally copy the authenticated designer
        replyTo, // replies should reach the designer directly
        filePath: file.path,
        fileName: file.filename,
        objectName,
        phone,
        comment,
      });
      return { success: true };
    } catch (exception: unknown) {
      // log SMTP failure for diagnostics without exposing secrets
      const meta = isRecord(exception) ? exception : {};
      const code =
        typeof meta.code === 'string' || typeof meta.code === 'number'
          ? meta.code
          : undefined;
      const responseCode =
        typeof meta.responseCode === 'number' ? meta.responseCode : undefined;
      const message =
        typeof meta.message === 'string' ? meta.message : 'unknown';
      console.error('SMTP FAIL:', {
        code,
        responseCode,
        message,
      });
      if (
        isRecord(exception) &&
        typeof exception.status === 'number' &&
        'response' in exception
      ) {
        throw exception;
      }
      throw new InternalServerErrorException(`SMTP error: ${message}`);
    }
  }
}
