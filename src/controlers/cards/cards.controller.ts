import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { CardsService } from '@app/services/cards/cards.service';
import { ICard } from '@app/interfaces/card';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  async getCards(): Promise<ICard[]> {
    return this.cardsService.getCards();
  }

  @Get(':id')
  async getCardById(@Param('id') id: string): Promise<ICard | null> {
    return this.cardsService.getCardById(id);
  }

  @Post()
  async uploadCard(@Body() body: ICard): Promise<ICard> {
    return this.cardsService.uploadCard(body);
  }

  @Delete()
  async deleteCards() {
    return this.cardsService.deleteCards();
  }

  @Delete(':id')
  async deleteCardById(@Param('id') id: string) {
    return this.cardsService.deleteCardById(id);
  }
}
