import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {
    super({ usernameField: 'login', passwordField: 'password' });
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.userService.checkAuthUser(login, password);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.UNAUTHORIZED);
    }
    return user; 
  }
}
