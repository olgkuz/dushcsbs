// src/schemas/other.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { buildPublicAssetUrl } from '@app/utils/public-asset-url';

export type OtherDocument = OtherEntity & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'others',
})
export class OtherEntity {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  img?: string; // имя файла, если загружаем на сервер
}

export const OtherSchema = SchemaFactory.createForClass(OtherEntity);

// Виртуальный URL на картинку
OtherSchema.virtual('imgUrl').get(function (this: OtherDocument) {
  return buildPublicAssetUrl(this.img);
});
