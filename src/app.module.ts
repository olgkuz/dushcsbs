import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './controlers/users/users.module';
import { CardsModule } from './controlers/cards/cards.module';
import { BlogModule } from './controlers/blog/blog.module';
import { MailModule } from './controlers/mail/mail.module';
import { DesignersModule } from './controlers/designers/designers.module';
import { TypesModule } from './controlers/types/types.module';
import { OthersModule } from './controlers/others/others.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает .env доступным во всех модулях
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGODB_URI'),
        dbName: cfg.get<string>('DB_NAME'),
      }),
    }),

    UsersModule,
    CardsModule,
    BlogModule,
    MailModule,
    DesignersModule,
    TypesModule,
    OthersModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
