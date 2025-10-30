import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { buildPublicAssetUrl } from '@app/utils/public-asset-url';

export type TypeDocument = TypeEntity & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'types',
})
export class TypeEntity {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop()
  img?: string; // имя файла (ложится в PUBLIC_PATH)
}

export const TypeSchema = SchemaFactory.createForClass(TypeEntity);

// виртуальное поле для удобного доступа к URL картинки
TypeSchema.virtual('imgUrl').get(function (this: TypeDocument) {
  return buildPublicAssetUrl(this.img);
});
