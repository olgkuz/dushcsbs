/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../schemas/user.shema';
import { AuthDto, RegisterDto } from '../../dto/user.dto';

type NameCarrier = Pick<UserDocument, 'name'> & { login?: string };

const resolveName = (user: NameCarrier): string =>
  user.name ?? user.login ?? '';

export interface AuthenticatedUserPayload {
  id: string;
  name: string;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  issueTokenFromUserObject(user: AuthenticatedUserPayload) {
    const payload = {
      name: user.name,
      sub: user.id,
      email: user.email ?? undefined,
    };
    return { token: this.jwtService.sign(payload), user };
  }

  private mapUserDocument(user: UserDocument) {
    return {
      id: user.id,
      name: resolveName(user as NameCarrier),
      email: user.email ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async registerUser(registerDto: RegisterDto) {
    const existing: UserDocument | null = await this.userModel
      .findOne({
        $or: [{ name: registerDto.name }, { login: registerDto.name }],
      })
      .exec();
    if (existing) {
      throw new BadRequestException(
        'User with the same name/login already exists.',
      );
    }

    const hash = await bcrypt.hash(registerDto.password, 10);

    const created: UserDocument = await new this.userModel({
      name: registerDto.name,
      password: hash,
      email: registerDto.email,
    }).save();

    return this.issueTokenFromUserObject({
      id: created.id,
      name: created.name,
      email: created.email ?? undefined,
    });
  }

  async login(authDto: AuthDto) {
    const user: UserDocument | null = await this.userModel
      .findOne({
        $or: [{ name: authDto.name }, { login: authDto.name }],
      })
      .exec();
    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }

    const ok = await bcrypt.compare(authDto.password, user.password);
    if (!ok) {
      throw new BadRequestException('Invalid credentials.');
    }

    const safeName = resolveName(user as NameCarrier);
    return this.issueTokenFromUserObject({
      id: user.id,
      name: safeName,
      email: user.email ?? undefined,
    });
  }

  async getAllUsers() {
    const users: UserDocument[] = await this.userModel
      .find()
      .select('-password')
      .exec();
    return users.map((user) => this.mapUserDocument(user));
  }

  async getUserById(id: string) {
    const foundUser: UserDocument | null = await this.userModel
      .findById(id)
      .select('-password')
      .exec();
    if (!foundUser) return null;

    return this.mapUserDocument(foundUser);
  }

  async deleteUsers() {
    const res: { deletedCount?: number } = await this.userModel
      .deleteMany()
      .exec();
    return { deletedCount: res.deletedCount ?? 0 };
  }

  async deleteUserById(id: string) {
    const deletedUser: UserDocument | null = await this.userModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedUser) return null;

    return {
      id: deletedUser.id,
      name: resolveName(deletedUser as NameCarrier),
      email: deletedUser.email ?? undefined,
    };
  }

  async checkAuthUser(
    name: string,
    password: string,
  ): Promise<AuthenticatedUserPayload> {
    const authUser: UserDocument | null = await this.userModel
      .findOne({
        $or: [{ name }, { login: name }],
      })
      .exec();
    if (!authUser) {
      throw new BadRequestException('Invalid credentials.');
    }

    const ok = await bcrypt.compare(password, authUser.password);
    if (!ok) {
      throw new BadRequestException('Invalid credentials.');
    }

    return {
      id: authUser.id,
      name: resolveName(authUser as NameCarrier),
      email: authUser.email ?? undefined,
    };
  }
}
