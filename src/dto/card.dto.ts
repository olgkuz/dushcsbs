import { ICard } from '../interfaces/card';

export class CardDto implements ICard {
  id?: string;
  name: string;
  description: string;
  img?: string;

  constructor(name: string, description: string, img?: string) {
    this.name = name;
    this.description = description;
    this.img = img;
  }
}
