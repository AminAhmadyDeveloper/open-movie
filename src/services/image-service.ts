import {
  TMDB_BASE_COVER_500_IMAGE_URL_WITH_PROXY,
  TMDB_BASE_COVER_780_IMAGE_URL_WITH_PROXY,
  TMDB_BASE_COVER_1280_IMAGE_URL_WITH_PROXY,
  TMDB_BASE_COVER_IMAGE_URL_WITH_PROXY,
} from '@/constants/api-constants';
import { cover, poster } from '@/images';

export const $image = (
  paths: null | string | string[] | undefined,
  options?: {
    size?: '1280' | '500' | '780' | 'original';
    type?: 'cover' | 'poster';
  },
) => {
  if (!paths || paths?.length === 0) {
    switch (options?.type) {
      case 'cover': {
        return cover;
      }
      case 'poster': {
        return poster;
      }
      default: {
        return poster;
      }
    }
  }

  const baseUrl =
    options?.size === '500'
      ? TMDB_BASE_COVER_500_IMAGE_URL_WITH_PROXY
      : options?.size === '780'
        ? TMDB_BASE_COVER_780_IMAGE_URL_WITH_PROXY
        : options?.size === '1280'
          ? TMDB_BASE_COVER_1280_IMAGE_URL_WITH_PROXY
          : TMDB_BASE_COVER_IMAGE_URL_WITH_PROXY;

  return Array.isArray(paths)
    ? `${baseUrl}${paths.join('/')}`
    : `${baseUrl}${paths}`;
};
