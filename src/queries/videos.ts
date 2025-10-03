import { createFetch, createSchema } from '@better-fetch/fetch';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { z } from 'zod/v4';

export const allVideosResponseSchema = z.object({
  id: z.number(),
  results: z.array(
    z.object({
      id: z.string(),
      iso_3166_1: z.string(),
      iso_639_1: z.string(),
      key: z.string(),
      name: z.string(),
      official: z.boolean(),
      published_at: z.string(),
      site: z.string(),
      size: z.number(),
      type: z.string(),
    }),
  ),
});

export type AllVideosResponseSchema = z.infer<typeof allVideosResponseSchema>;

const $fetch = createFetch({
  baseURL: import.meta.env.VITE_PUBLIC_TMDB_API_BASE_URL,
  schema: createSchema({
    '@get/movie/:movie_id/videos': {
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

export const videos = createQueryKeys('videos', {
  all: (movieId: number | string | undefined) => {
    return {
      queryFn: () => {
        return $fetch<AllVideosResponseSchema>('@get/movie/:movie_id/videos', {
          headers: {
            'cache-control': 'no-cache',
          },
          params: { movie_id: movieId || '' },
          query: {
            api_key: import.meta.env.VITE_PUBLIC_TMDB_API_KEY,
            language: 'en',
          },
        });
      },
      queryKey: ['movie', movieId, 'videos'],
    };
  },
});
