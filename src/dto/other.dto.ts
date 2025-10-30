// src/dto/other.dto.ts
import { IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class OtherDto {
  @Expose()
  @IsString()
  @MinLength(2)
  name!: string;

  @Expose()
  @IsString()
  @MinLength(5)
  description!: string;

  img?: string;
}
