import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../schemas/user.shema';
import { AuthDto, RegisterDto } from '../../dto/user.dto';

function resolveName(u: any): string {
  // Поддержка legacy: берём name, иначе login (если вдруг он есть в старой записи)
  return u?.name ?? u?.login;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  issueTokenFromUserObject(user: { id: string; name: string; email?: string }) {
    const payload = { name: user.name, sub: user.id, email: user.email ?? undefined };
    return { token: this.jwtService.sign(payload), user };
  }

  async registerUser(registerDto: RegisterDto) {
    // Совместимость по поиску: позволяем логин совпасть со старым полем login
    const existing = await this.userModel.findOne({
      $or: [{ name: registerDto.name }, { login: registerDto.name }]
    });
    if (existing) throw new BadRequestException('Такой пользователь уже существует');

    const hash = await bcrypt.hash(registerDto.password, 10);
    const created = await new this.userModel({
      name: registerDto.name,
      password: hash,
      email: registerDto.email
    }).save();

    return this.issueTokenFromUserObject({
      id: created.id,
      name: created.name,
      email: created.email
    });
  }

  async login(authDto: AuthDto) {
    // Ищем по name и legacy login, но дальше НИКОГДА не обращаемся к user.login напрямую
    const user = await this.userModel.findOne({
      $or: [{ name: authDto.name }, { login: authDto.name }]
    });
    if (!user) throw new BadRequestException('Неверное имя или пароль');

    const ok = await bcrypt.compare(authDto.password, user.password);
    if (!ok) throw new BadRequestException('Неверное имя или пароль');

    const safeName = resolveName(user); // ❗️никаких user.login
    return this.issueTokenFromUserObject({
      id: user.id,
      name: safeName,
      email: user.email
    });
  }

  async getAllUsers() {
    const users = await this.userModel.find().select('-password').exec();
    return users.map((u: any) => ({
      id: u.id,
      name: resolveName(u),
      email: u.email,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
  }

  async getUserById(id: string) {
    const u: any = await this.userModel.findById(id).select('-password').exec();
    if (!u) return null;

    return {
      id: u.id,
      name: resolveName(u),
      email: u.email,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    };
  }

  async deleteUsers() {
    const res = await this.userModel.deleteMany().exec();
    return { deletedCount: res.deletedCount };
  }

  async deleteUserById(id: string) {
    const u: any = await this.userModel.findByIdAndDelete(id).exec();
    if (!u) return null;

    return { id: u.id, name: resolveName(u), email: u.email };
  }

  async checkAuthUser(name: string, password: string) {
    const u: any = await this.userModel.findOne({ $or: [{ name }, { login: name }] });
    if (!u) throw new BadRequestException('Имя указано неверно');

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) throw new BadRequestException('Пароль указан неверно');

    // Возвращаем plain object, LocalStrategy потом нормализует
    return u.toObject();
  }
}
