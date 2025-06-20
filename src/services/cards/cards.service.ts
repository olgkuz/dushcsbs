import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';
import { Card, CardDocument } from '@app/schemas/card.shema';
import { ICard } from '@app/interfaces/card';
import { CardDto } from '@app/dto/card.dto';

@Injectable()
export class CardsService {
  private cardsCount = 10;

  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>
  ) {}

  async generateCards(): Promise<ICard[]> {
    const createdCards: ICard[] = [];
    for (let i = 0; i < this.cardsCount; i++) {
      const cardDto = new CardDto(
        `Тестовая карточка ${i + 1}`,
        'Описание карточки',
        `img${i + 1}.jpg`
      );
      const cardData = new this.cardModel(cardDto);
      const saved = await cardData.save();
      createdCards.push(saved);
    }
    return createdCards;
  }

  async getCards(): Promise<ICard[]> {
    return this.cardModel.find().exec();
  }

  async getCardById(id: string): Promise<ICard | null> {
    return this.cardModel.findById(id).exec();
  }

  async uploadCard(body: ICard): Promise<ICard> {
    const cardDto = new CardDto(body.name, body.description, body.img);
    const cardData = new this.cardModel(cardDto);
    return cardData.save();
  }

  async deleteCards(): Promise<DeleteResult> {
    return this.cardModel.deleteMany().exec();
  }

  async deleteCardById(id: string): Promise<ICard | null> {
    return this.cardModel.findByIdAndDelete(id).exec();
  }
}

