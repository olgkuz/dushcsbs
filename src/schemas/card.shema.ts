import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ICard } from '@app/interfaces/card';

@Schema({ timestamps: true })
export class Card implements ICard {
  @Prop({ type: Types.ObjectId }) // Mongoose сам создаёт _id, не указываем default вручную
  _id: Types.ObjectId | undefined;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description!: string;

  @Prop()
  img?: string;

  // Виртуальное поле — полный URL изображения
  imgUrl?: string;
}

export type CardDocument = Card & Document;

export const CardSchema = SchemaFactory.createForClass(Card);

// Добавляем виртуальное поле imgUrl
CardSchema.virtual('imgUrl').get(function (this: CardDocument) {
  return this.img ? `http://localhost:3000/public/${this.img}` : null;
});

// Настройки сериализации
CardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.imgUrl = ret.img ? `/public/${ret.img}` : null;
    delete ret._id;
  }
});


