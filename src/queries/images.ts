import { createFetch, createSchema } from '@better-fetch/fetch';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { z } from 'zod/v4';

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

const $fetch = createFetch({
  baseURL: import.meta.env.VITE_PUBLIC_TMDB_API_BASE_URL,
  schema: createSchema({
    '@get/movie/:movie_id/images': {
      headers: {
        'cache-control': 'no-cache',
      },
      params: z.object({
        movie_id: z.string().or(z.number()),
      }),
      query: z.object({
        api_key: z.string(),
        language: z.enum(['fa', 'en']),
      }),
    },
  }),
});

export const images = createQueryKeys('images', {
  all: (movieId: number | string) => {
    return {
      queryFn: () => {
        return $fetch<AllImagesResponseSchema>('@get/movie/:movie_id/images', {
          headers: {
            'cache-control': 'no-cache',
          },
          params: { movie_id: movieId },
          query: {
            api_key: import.meta.env.VITE_PUBLIC_TMDB_API_KEY,
            language: 'en',
          },
        });
      },
      queryKey: ['movie', movieId, 'images'],
    };
  },
});
