import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from '@app/services/cards/cards.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from '@app/static/privte/constants';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from '@app/schemas/card.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstant.secret
    })
  ],
  controllers: [CardsController],
  providers: [CardsService, JwtStrategyService],
})
export class CardsModule {}
