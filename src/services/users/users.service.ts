import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../schemas/user.shema';
import { AuthDto, RegisterDto } from '../../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async registerUser(registerDto: RegisterDto) {
    // совместимость: проверим и по name, и по legacy login
    const existing = await this.userModel.findOne({
      $or: [{ name: registerDto.name }, { login: registerDto.name }]
    });

    if (existing) {
      throw new BadRequestException('Такой пользователь уже существует');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({
      name: registerDto.name,
      password: hashedPassword,
      email: registerDto.email
    });

    const user = await newUser.save();
    const payload = { name: user.name, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async login(authDto: AuthDto) {
    // совместимость: ищем и по полю name, и по старому login (если такие документы остались)
    const user = await this.userModel.findOne({
      $or: [{ name: authDto.name }, { login: authDto.name }]
    });

    if (!user) {
      throw new BadRequestException('Неверное имя или пароль');
    }

    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверное имя или пароль');
    }

    const payload = { name: user.name ?? (user as any).login, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name ?? (user as any).login,
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
      name: (user as any).name ?? (user as any).login,
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
      name: (user as any).name ?? (user as any).login,
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
      name: (user as any).name ?? (user as any).login,
      email: user.email
    };
  }

  // если где-то используется прямой метод
  async checkAuthUser(name: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ name }, { login: name }]
    });
    if (!user) {
      throw new BadRequestException('Имя указано неверно');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Пароль указан неверно');
    }

    return user.toObject();
  }
}
