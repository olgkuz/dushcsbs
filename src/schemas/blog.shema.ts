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

type MutableBlog = Record<string, unknown> & {
  _id?: unknown;
  id?: unknown;
};

BlogSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: MutableBlog) => {
    const rawId = ret._id;
    if (typeof rawId === 'string') {
      ret.id = rawId;
    } else if (
      rawId &&
      typeof rawId === 'object' &&
      'toString' in rawId &&
      typeof (rawId as { toString: unknown }).toString === 'function'
    ) {
      ret.id = (rawId as { toString: () => string }).toString();
    }

    if ('_id' in ret) {
      delete ret._id;
    }
    return ret;
  },
});
