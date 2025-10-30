import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name!: string; // legacy login

  @Prop({ required: true })
  password!: string;

  @Prop()
  email?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

type MutableUser = Record<string, unknown> & {
  _id?: unknown;
  id?: unknown;
  password?: unknown;
};

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: MutableUser) => {
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

    if ('password' in ret) {
      delete ret.password;
    }

    return ret;
  },
});
