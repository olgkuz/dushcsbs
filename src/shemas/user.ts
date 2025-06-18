import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser } from 'src/interfaces/user';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);