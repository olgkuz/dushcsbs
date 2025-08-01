import { IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CardDto {
  @Expose()
  @IsString()
  @MinLength(2)
  name: string;

  @Expose()
  @IsString()
  @MinLength(5)
  description: string;

  img?: string;

  constructor(name: string, description: string, img?: string) {
    this.name = name;
    this.description = description;
    this.img = img;
  }
}
