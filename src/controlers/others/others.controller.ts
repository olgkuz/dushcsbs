// src/modules/others/others.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync } from 'fs';

import { OthersService } from '@app/services/others/others.service';
import { IOther } from '@app/interfaces/other';
import { PUBLIC_PATH } from '@app/constans';
import { OtherDto } from '@app/dto/other.dto';

@Controller('others')
export class OthersController {
  constructor(private readonly svc: OthersService) {}

  @Get()
  getAll(): Promise<IOther[]> {
    return this.svc.getOthers();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<IOther | null> {
    return this.svc.getOtherById(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(PUBLIC_PATH)) {
            console.warn('⚠️ PUBLIC_PATH not found:', PUBLIC_PATH);
          }
          cb(null, PUBLIC_PATH);
        },
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `other-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: OtherDto,
  ): Promise<IOther> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.svc.uploadOther({ ...body, img: file.filename });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<IOther | null> {
    return this.svc.deleteOtherById(id);
  }
}
