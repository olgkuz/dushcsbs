import { ICard } from '@app/interfaces/card';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Card implements ICard {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  name: string = '';

  @Prop()
  description: string = '';

  @Prop()
  img?: string;
}

export type CardDocument = Card & Document;
export const CardSchema = SchemaFactory.createForClass(Card);

// Приводим _id к id
CardSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});
