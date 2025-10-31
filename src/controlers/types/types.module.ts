import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from '@app/services/types/types.service';
import { JwtStrategyService } from '@app/services/authentication/jwt-strategy/jwt-strategy.service';
import { JwtAuthGuard } from '@app/services/authentication/jwt-auth.guard/jwt-auth.guard.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeEntity, TypeSchema } from '@app/schemas/type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TypeEntity.name, schema: TypeSchema }]),
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
  controllers: [TypesController],
  providers: [TypesService, JwtStrategyService, JwtAuthGuard],
  exports: [TypesService],
})
export class TypesModule {}
