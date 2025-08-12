import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { PUBLIC_PATH } from './constans';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Разрешить запросы с клиента
  app.enableCors({
  origin: 'http://localhost:4200', // URL твоего Angular-приложения
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
});
  // Раздача файлов из папки public (например, картинки)
  app.useStaticAssets(PUBLIC_PATH, {
    prefix: '/public/',
  });

  // Раздача загруженных файлов из папки uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Валидация входящих запросов
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log(`🚀 Сервер запущен на http://localhost:3000`);
}
bootstrap();
