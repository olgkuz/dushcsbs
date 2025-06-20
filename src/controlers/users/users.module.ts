// src/controlers/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/authentication/auth/auth.service';
import { JwtStrategyService } from '../../services/authentication/jwt-strategy/jwt-strategy.service';

import { User, UserSchema } from '../../schemas/user.shema';
import { jwtConstant } from '../../static/privte/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstant.secret,
      signOptions: { expiresIn: '12h' } // Рекомендую добавить срок действия токена
    })
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategyService
  ],
  exports: [
    UsersService // Если вдруг захочешь использовать UsersService в других модулях
  ]
})
export class UsersModule {}

