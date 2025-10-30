import {
  IsString,
  IsNumber,
  IsArray,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class BlogDto {
  @Expose()
  @IsString()
  @MinLength(3)
  title: string | undefined;

  @Expose()
  @IsString()
  @MinLength(10)
  previewText: string | undefined;

  @Expose()
  @IsString()
  @MinLength(50)
  content: string | undefined;

  @Expose()
  @IsNumber()
  readingTime: number | undefined;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[] | undefined;
}
