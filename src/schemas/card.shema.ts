import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Card {
 @Prop({ required: true })
name!: string;

@Prop({ required: true })
description!: string;


  @Prop()
  img?: string;
}

export type CardDocument = Card & Document;

export const CardSchema = SchemaFactory.createForClass(Card);

// Автоматическое добавление id и imgUrl в JSON
CardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.imgUrl = ret.img ? `http://localhost:3000/public/${ret.img}` : null; // ✅
    delete ret._id;
  }
});

