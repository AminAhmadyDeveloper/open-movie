import { createQueryKeys } from '@lukemorales/query-key-factory';
import { z } from 'zod/v4';

import { proxiedUrl } from '@/libraries/string-utilities';

export const allImagesResponseSchema = z.object({
  backdrops: z.array(
    z.object({
      aspect_ratio: z.number(),
      file_path: z.string(),
      height: z.number(),
      iso_639_1: z.string(),
      vote_average: z.number(),
      vote_count: z.number(),
      width: z.number(),
    }),
  ),
  id: z.number(),
  logos: z.array(
    z.object({
      aspect_ratio: z.number(),
      file_path: z.string(),
      height: z.number(),
      iso_639_1: z.string(),
      vote_average: z.number(),
      vote_count: z.number(),
      width: z.number(),
    }),
  ),
  posters: z.array(
    z.object({
      aspect_ratio: z.number(),
      file_path: z.string(),
      height: z.number(),
      iso_639_1: z.string(),
      vote_average: z.number(),
      vote_count: z.number(),
      width: z.number(),
    }),
  ),
});

export type AllImagesResponseSchema = z.infer<typeof allImagesResponseSchema>;

export const images = createQueryKeys('images', {
  all: (movieId: number | string) => {
    return {
      queryFn: async () => {
        const response = await fetch(
          proxiedUrl(`/movie/${movieId}/images`, { language: 'fa' }),
        );
        return (await response.json()) as AllImagesResponseSchema;
      },
      queryKey: ['movie', movieId, 'images'],
    };
  },
});
