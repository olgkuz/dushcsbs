
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IBlog } from '../interfaces/blog';

@Schema({ timestamps: true })
export class Blog implements IBlog {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  previewText!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  readingTime!: number;

  @Prop({ type: [String] })
  tags!: string[];

  createdAt?: Date;
  updatedAt?: Date;
}


export type BlogDocument = Blog & Document;

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});
