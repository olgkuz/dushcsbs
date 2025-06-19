import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.shema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, RegisterDto } from '../../dto/user.dto';
import { IUser } from '@app/interfaces/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({
      login: registerDto.login,
      password: hashedPassword,
      email: registerDto.email
    });
    
    const user = await newUser.save();
    const payload = { login: user.login, sub: user.id };
    
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        login: user.login,
        email: user.email
      }
    };
  }
async login(authDto: AuthDto) {
    const user = await this.userModel.findOne({ login: authDto.login });
    if (!user) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    const payload = { login: user.login, sub: user.id };
    
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }


  async getAllUsers() {
    const users = await this.userModel.find().select('-password').exec();
    return users.map(user => ({
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) return null;
    
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async deleteUsers() {
    const result = await this.userModel.deleteMany().exec();
    return { deletedCount: result.deletedCount };
  }

  async deleteUserById(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) return null;
    
    return {
      id: user.id,
      login: user.login,
      email: user.email
    };
  }
   async checkAuthUser(login: string, password: string): Promise<IUser> {
    const user = await this.userModel.findOne({ login });
    if (!user) {
      throw new BadRequestException('Логин указан неверно');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Пароль указан неверно');
    }
    
    return user.toObject();
  }
}