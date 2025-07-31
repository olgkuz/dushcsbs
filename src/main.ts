import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Используем NestExpressApplication, чтобы подключить статические файлы
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  // Статические файлы из папки "public"
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/', // доступно по адресу http://localhost:3000/public/filename.jpg
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Запуск
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
