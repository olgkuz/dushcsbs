import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync } from 'fs';

import { CardsService } from '@app/services/cards/cards.service';
import { ICard } from '@app/interfaces/card';
import { PUBLIC_PATH } from '@app/constans';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import {
  MAX_IMAGE_FILE_SIZE,
  imageFileFilter,
} from '@app/utils/image-upload';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getAllCards(): Promise<ICard[]> {
    return this.cardsService.getCards();
  }

  @Get(':id')
  async getCardById(@Param('id') id: string): Promise<ICard | null> {
    return this.cardsService.getCardById(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(PUBLIC_PATH)) {
            console.warn('Upload directory is missing:', PUBLIC_PATH);
          }
          cb(null, PUBLIC_PATH);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `card-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: MAX_IMAGE_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadCard(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; description: string },
  ): Promise<ICard> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.cardsService.uploadCard({ ...body, img: file.filename });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCard(@Param('id') id: string): Promise<ICard | null> {
    return this.cardsService.deleteCardById(id);
  }
}
