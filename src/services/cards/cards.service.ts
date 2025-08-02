import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DeleteResult } from 'mongoose';
import { Card, CardDocument } from 'src/schemas/card.shema';
import { ICard } from '@app/interfaces/card';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>
  ) {}

  async getCards(): Promise<ICard[]> {
    return this.cardModel.find().exec();
  }

  async getCardById(id: string): Promise<ICard | null> {
    return this.cardModel.findById(id).exec();
  }

  async uploadCard(data: { name: string; description: string; img?: string }): Promise<ICard> {
    const created = new this.cardModel(data);
    return created.save();
  }

  async deleteCardById(id: string): Promise<ICard | null> {
    return this.cardModel.findByIdAndDelete(id).exec();
  }

  async deleteAllCards(): Promise<DeleteResult> {
    return this.cardModel.deleteMany().exec();
  }
}

