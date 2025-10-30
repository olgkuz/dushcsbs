// src/modules/others/others.module.ts
import { Module } from '@nestjs/common';
import { OthersController } from './others.controller';
import { OthersService } from '@app/services/others/others.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from '@app/static/privte/constants';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { OtherEntity, OtherSchema } from '@app/schemas/other.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OtherEntity.name, schema: OtherSchema },
    ]),
    PassportModule,
    JwtModule.register({ secret: jwtConstant.secret }),
  ],
  controllers: [OthersController],
  providers: [OthersService, JwtStrategyService],
  exports: [OthersService],
})
export class OthersModule {}
