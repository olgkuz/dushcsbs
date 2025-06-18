import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,UserDocument } from 'src/shemas/user';
import * as bcrypt from 'bcrypt';
import { AuthDto, RegisterDto } from '../../dto/user.dto';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password');
  }

  async checkRegUser(login: string): Promise<boolean> {
    const user = await this.userModel.findOne({ login });
    return !!user;
  }

  async registerUser(userData: RegisterDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [{ login: userData.login }, { email: userData.email }]
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким логином или email уже существует');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new this.userModel({
      ...userData,
      password: hashedPassword
    });

    return newUser.save();
  }

  async login(authData: AuthDto): Promise<{ user: User; token: string }> {
    const user = await this.userModel.findOne({ login: authData.login });
    if (!user) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    const isPasswordValid = await bcrypt.compare(authData.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный логин или пароль');
    }

    // В реальном приложении здесь должна быть генерация JWT токена
    const token = 'generated-jwt-token';

    return { user, token };
  }

  async deleteUsers(): Promise<{ deletedCount: number }> {
    const result = await this.userModel.deleteMany();
    return { deletedCount: result.deletedCount };
  }

  async deleteUserById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}