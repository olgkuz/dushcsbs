import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CardsService } from '@app/services/cards/cards.service';
import { ICard } from '@app/interfaces/card';

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
    @Body() body: { name: string; description: string }
  ): Promise<ICard> {
    const img = file?.filename;
    return this.cardsService.uploadCard({ ...body, img });
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string): Promise<ICard | null> {
    return this.cardsService.deleteCardById(id);
  }
}
