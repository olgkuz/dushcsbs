import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Настройка CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Разрешенный origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешить передачу кук
    allowedHeaders: 'Content-Type,Authorization' // Разрешенные заголовки
  });

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Автоматически удаляет лишние поля
      forbidNonWhitelisted: true, // Бросает ошибку при наличии лишних полей
      transform: true // Автоматическое преобразование типов
    })
  );

  // Запуск приложения
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
