import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } // 💡 добавлено, если потребуется toObject()
})
export class Card {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  img?: string; // 💡 сделано опциональным, если файл не загружен
}

const CardSchema = SchemaFactory.createForClass(Card);

// 💡 Виртуальное поле для удобного доступа к изображению по URL
CardSchema.virtual('imgUrl').get(function (this: CardDocument) {
  return this.img ? `http://localhost:3000/public/${this.img}` : '';
});

export { CardSchema };


