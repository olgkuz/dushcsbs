import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';

@Module({
    imports: [],
  controllers: [CardsController],
  providers: [],
})
export class CardsModule {}
