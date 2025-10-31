import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from '../../services/users/users.service';
import { JwtStrategyService } from '../../services/authentication/jwt-strategy/jwt-strategy.service';

import { User, UserSchema } from '../../schemas/user.shema';
import { LocalStrategy } from '@app/services/authentication/local-strategy/local-strategy.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET')?.trim();
        if (!secret) {
          throw new Error('JWT_SECRET is not configured.');
        }
        return {
          secret,
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy, JwtStrategyService],
  exports: [UsersService],
})
export class UsersModule {}
