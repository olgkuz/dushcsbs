import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import type { RequestHandler } from 'express';
import helmet from 'helmet';
import { existsSync, mkdirSync, statSync } from 'fs';

import { AppModule } from './app.module';
import { PUBLIC_UPLOADS_DIR } from './constans';

const DEFAULT_ORIGIN = 'http://localhost:4200';
const REQUIRED_PROD_ORIGINS = ['https://showerglass.netlify.app'];
const DEFAULT_DEV_ORIGINS = [DEFAULT_ORIGIN];

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

const ensureUploadsDirectory = (dir: string) => {
  try {
    if (existsSync(dir)) {
      const stats = statSync(dir);
      if (!stats.isDirectory()) {
        throw new Error(`Path "${dir}" exists but is not a directory.`);
      }
      return;
    }
    mkdirSync(dir, { recursive: true });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Failed to prepare uploads directory "${dir}": ${reason}`);
  }
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv =
    configService.get<string>('NODE_ENV')?.toLowerCase() ?? 'development';

  app.setGlobalPrefix('api', {
    exclude: ['health', 'public/*path', 'uploads/*path'],
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  const compressionMiddleware = (
    compression as unknown as () => RequestHandler
  )();
  app.use(compressionMiddleware);

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  const envOrigins = configService.get<string>('FRONTEND_ORIGIN');
  let allowedOrigins = parseOrigins(envOrigins);
  const isProduction = nodeEnv === 'production';

  console.log('NODE_ENV =', nodeEnv);
  console.log('FRONTEND_ORIGIN =', envOrigins);
  console.log('allowedOrigins (after parse) =', allowedOrigins);

  if (!allowedOrigins.length && isProduction) {
    throw new Error(
      'FRONTEND_ORIGIN must be configured in production environment.',
    );
  }

  if (!allowedOrigins.length) {
    console.warn(
      'FRONTEND_ORIGIN is not set; falling back to default development origin.',
    );
    allowedOrigins = [...DEFAULT_DEV_ORIGINS];
  }

  const enforcedOrigins = isProduction
    ? REQUIRED_PROD_ORIGINS
    : [...DEFAULT_DEV_ORIGINS, ...REQUIRED_PROD_ORIGINS];

  allowedOrigins = Array.from(
    new Set([...allowedOrigins, ...enforcedOrigins]),
  );
  console.log('Final allowedOrigins =', allowedOrigins);
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

  ensureUploadsDirectory(PUBLIC_UPLOADS_DIR);

  app.useStaticAssets(PUBLIC_UPLOADS_DIR, {
    prefix: '/uploads/',
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

  const trustProxyRaw = configService.get<string>('TRUST_PROXY')?.trim();
  const shouldTrustProxy =
    trustProxyRaw == null
      ? true
      : ['true', '1', 'yes'].includes(trustProxyRaw.toLowerCase());
  if (shouldTrustProxy) {
    app.set('trust proxy', 1);
  }
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
