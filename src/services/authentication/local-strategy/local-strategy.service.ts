import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'name', passwordField: 'password' });
  }

  async validate(name: string, password: string): Promise<any> {
    const raw = await this.usersService.checkAuthUser(name, password);
    if (!raw) throw new UnauthorizedException('Неверное имя или пароль');

    // Нормализуем id/name
    const id = raw.id ?? raw._id?.toString?.();
    const safeName = raw.name ?? raw.login;

    return { id, name: safeName, email: raw.email };
  }
}

