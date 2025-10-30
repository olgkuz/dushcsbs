import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

type AuthenticatedUser = {
  id: string;
  name: string;
  email?: string;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'name', passwordField: 'password' });
  }

  async validate(name: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.usersService.checkAuthUser(name, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }
}
