
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './controlers/users/users.module';
import { CardsModule } from './controlers/cards/cards.module';
import { BlogModule } from './controlers/blog/blog.module';
import { MailModule } from './controlers/mail/mail.module';
import { DesignersModule } from './controlers/designers/designers/designers.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest', {
      
    }),
     ConfigModule.forRoot({
      isGlobal: true, // делает доступным во всех модулях
    }),
    UsersModule,
    CardsModule,
    BlogModule,
    MailModule,
    DesignersModule

  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

