import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CardsService } from '@app/services/cards/cards.service';
import { ICard } from '@app/interfaces/card';
import { extname } from 'path';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `card-${uniqueSuffix}${ext}`;
          cb(null, filename);
        }
      })
    })
  )
  async uploadCard(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Pick<ICard, 'name' | 'description'>
  ): Promise<ICard> {
    const img = file.filename;
    return this.cardsService.uploadCard({ ...body, img });
  }
}
