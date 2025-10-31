import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from '@app/services/cards/cards.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '@app/schemas/card.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
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
  controllers: [CardsController],
  providers: [CardsService, JwtStrategyService, JwtAuthGuard],
})
export class CardsModule {}
