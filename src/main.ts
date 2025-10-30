import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import type { RequestHandler } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PUBLIC_UPLOADS_DIR } from './constans';

const DEFAULT_ORIGIN = 'http://localhost:4200';

const parseOrigins = (src?: string | null): string[] =>
  (src ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normaliseBaseUrl = (
  baseUrl?: string | null,
  host?: string,
  port?: number,
) => {
  if (baseUrl && baseUrl.trim()) {
    return baseUrl.replace(/\/+$/, '');
  }
  const resolvedHost = host ?? '0.0.0.0';
  const resolvedPort = port ?? 3000;
  return `http://${resolvedHost}:${resolvedPort}`;
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', {
    exclude: ['health', 'public/(.*)', 'uploads/(.*)'],
  });

  app.use(helmet());
  const compressionMiddleware = (
    compression as unknown as () => RequestHandler
  )();
  app.use(compressionMiddleware);

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  const envOrigins = configService.get<string>('FRONTEND_ORIGIN');
  const allowedOrigins = parseOrigins(envOrigins);
  if (!allowedOrigins.length) {
    allowedOrigins.push(DEFAULT_ORIGIN);
  }
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Content-Disposition'],
  });

  app.useStaticAssets(PUBLIC_UPLOADS_DIR, {
    prefix: '/public/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.set('trust proxy', 1);
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3000);
  const host = configService.get<string>('HOST', '0.0.0.0');
  const baseUrl = normaliseBaseUrl(
    configService.get<string>('APP_BASE_URL'),
    host,
    port,
  );

  await app.listen(port, host);
  console.log(`API ready on ${baseUrl}/api`);
}

void bootstrap();
