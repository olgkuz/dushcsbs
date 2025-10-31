import { BadRequestException } from '@nestjs/common';
import type { Request } from 'express';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const mime = file.mimetype?.toLowerCase() ?? '';
  if (!IMAGE_MIME_TYPES.has(mime)) {
    return cb(
      new BadRequestException(
        `Unsupported image type "${file.mimetype ?? 'unknown'}".`,
      ),
      false,
    );
  }
  return cb(null, true);
};
