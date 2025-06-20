// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './controlers/users/users.module';
import { CardsModule } from './controlers/cards/cards.module';
import { BlogModule } from './controlers/blog/blog.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest', {
      
    }),
    UsersModule,
    CardsModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

