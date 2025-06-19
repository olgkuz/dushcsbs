import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId = new Types.ObjectId();

  @Prop({ required: true })
  password: string = '';

  @Prop({ required: true, unique: true })
  login: string = '';

  @Prop()
  email?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Добавляем transform для автоматического преобразования _id в строку
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password;
    return ret;
  }
});