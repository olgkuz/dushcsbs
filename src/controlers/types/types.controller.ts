import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync } from 'fs';

import { TypesService } from '@app/services/types/types.service';
import { IType } from '@app/interfaces/type';
import { PUBLIC_PATH } from '@app/constans';
import { TypeDto } from '@app/dto/type.dto';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import {
  MAX_IMAGE_FILE_SIZE,
  imageFileFilter,
} from '@app/utils/image-upload';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get()
  async getAllTypes(): Promise<IType[]> {
    return this.typesService.getTypes();
  }

  @Get(':id')
  async getTypeById(@Param('id') id: string): Promise<IType> {
    return this.typesService.getTypeById(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(PUBLIC_PATH)) {
            console.warn('Upload directory is missing:', PUBLIC_PATH);
          }
          cb(null, PUBLIC_PATH);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `type-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: MAX_IMAGE_FILE_SIZE },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadType(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TypeDto,
  ): Promise<IType> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.typesService.uploadType({ ...body, img: file.filename });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteType(@Param('id') id: string): Promise<IType | null> {
    return this.typesService.deleteTypeById(id);
  }
}
