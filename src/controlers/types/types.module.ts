import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from '@app/services/types/types.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from '@app/static/privte/constants';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeEntity, TypeSchema } from '@app/schemas/type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TypeEntity.name, schema: TypeSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstant.secret,
    }),
  ],
  controllers: [TypesController],
  providers: [TypesService, JwtStrategyService],
  exports: [TypesService],
})
export class TypesModule {}
