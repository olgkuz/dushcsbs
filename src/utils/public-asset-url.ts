import { PUBLIC_UPLOADS_URL } from '@app/constans';

const sanitizeFilename = (filename: string) => filename.replace(/^\/+/, '');

export const buildPublicAssetUrl = (filename?: string | null): string => {
  if (!filename) {
    return '';
  }

  const sanitizedName = sanitizeFilename(filename);
  if (!sanitizedName) {
    return '';
  }

  if (PUBLIC_UPLOADS_URL) {
    return `${PUBLIC_UPLOADS_URL}/${sanitizedName}`;
  }

  return `/public/${sanitizedName}`;
};
