import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, isValidObjectId } from 'mongoose';
import { IOther } from '@app/interfaces/other';
import { OtherEntity, OtherDocument } from '@app/schemas/other.schema';
import { OtherDto } from '@app/dto/other.dto';

@Injectable()
export class OthersService {
  constructor(
    @InjectModel(OtherEntity.name) private readonly model: Model<OtherDocument>,
  ) {}

  getOthers(): Promise<IOther[]> {
    return this.model.find().exec();
  }

  async getOtherById(id: string): Promise<IOther> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid other id format');
    }

    const other = await this.model.findById(id).exec();
    if (!other) {
      throw new NotFoundException('Other not found');
    }

    return other;
  }

  uploadOther(data: OtherDto): Promise<IOther> {
    const created = new this.model(data);
    return created.save();
  }

  deleteOtherById(id: string): Promise<IOther | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid other id format');
    }
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteAllOthers(): Promise<DeleteResult> {
    return this.model.deleteMany().exec();
  }
}
