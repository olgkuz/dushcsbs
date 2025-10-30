import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model } from 'mongoose';
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

  getOtherById(id: string): Promise<IOther | null> {
    return this.model.findById(id).exec();
  }

  uploadOther(data: OtherDto): Promise<IOther> {
    const created = new this.model(data);
    return created.save();
  }

  deleteOtherById(id: string): Promise<IOther | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteAllOthers(): Promise<DeleteResult> {
    return this.model.deleteMany().exec();
  }
}
