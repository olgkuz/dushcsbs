import { isAbsolute, join } from 'path';

const uploadsDirEnv = process.env.UPLOADS_DIR?.trim();

/**
 * Absolute path to the directory with public static assets.
 */
export const PUBLIC_UPLOADS_DIR = uploadsDirEnv
  ? isAbsolute(uploadsDirEnv)
    ? uploadsDirEnv
    : join(process.cwd(), uploadsDirEnv)
  : join(process.cwd(), 'public');

/**
 * Public URL prefix that will be prepended to asset filenames.
 * Example: https://cdn.example.com/public
 */
export const PUBLIC_UPLOADS_URL = (() => {
  const raw = process.env.PUBLIC_UPLOADS_URL?.trim();
  if (!raw) {
    return '';
  }
  return raw.replace(/\/+$/, '');
})();

// Backward compatibility with older imports.
export const PUBLIC_PATH = PUBLIC_UPLOADS_DIR;
