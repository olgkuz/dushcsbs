// src/modules/others/others.module.ts
import { Module } from '@nestjs/common';
import { OthersController } from './others.controller';
import { OthersService } from '@app/services/others/others.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { OtherEntity, OtherSchema } from '@app/schemas/other.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OtherEntity.name, schema: OtherSchema },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET')?.trim();
        if (!secret) {
          throw new Error('JWT_SECRET is not configured.');
        }
        return { secret };
      },
    }),
  ],
  controllers: [OthersController],
  providers: [OthersService, JwtStrategyService, JwtAuthGuard],
  exports: [OthersService],
})
export class OthersModule {}
