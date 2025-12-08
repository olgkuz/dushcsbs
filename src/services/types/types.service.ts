import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, isValidObjectId } from 'mongoose';
import { TypeEntity, TypeDocument } from '@app/schemas/type.schema';
import { IType } from '@app/interfaces/type';
import { TypeDto } from '@app/dto/type.dto';

@Injectable()
export class TypesService {
  constructor(
    @InjectModel(TypeEntity.name)
    private readonly typeModel: Model<TypeDocument>,
  ) {}

  async getTypes(): Promise<IType[]> {
    return this.typeModel.find().exec();
  }

  async getTypeById(id: string): Promise<IType> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid type id format');
    }

    const type = await this.typeModel.findById(id).exec();
    if (!type) {
      throw new NotFoundException('Type not found');
    }

    return type;
  }

  async uploadType(data: TypeDto): Promise<IType> {
    const created = new this.typeModel(data);
    return created.save();
  }

  async deleteTypeById(id: string): Promise<IType | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid type id format');
    }
    return this.typeModel.findByIdAndDelete(id).exec();
  }

  async deleteAllTypes(): Promise<DeleteResult> {
    return this.typeModel.deleteMany().exec();
  }
}
