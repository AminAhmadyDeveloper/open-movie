import { createQueryKeys } from '@lukemorales/query-key-factory';
import { z } from 'zod/v4';

import { proxiedUrl } from '@/libraries/string-utilities';

export const movieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  media_type: z.string(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export const trendingMovieWeekResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TrendingMovieWeekResponseSchema = z.infer<
  typeof trendingMovieWeekResponseSchema
>;

export const movieDetailsResponseSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  budget: z.number(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  production_countries: z.array(
    z.object({ iso_3166_1: z.string(), name: z.string() }),
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type MovieDetailsResponseSchema = z.infer<
  typeof movieDetailsResponseSchema
>;

export const movies = createQueryKeys('movies', {
  all: {
    queryFn: async () => {
      const response = await fetch(
        proxiedUrl('/trending/movie/week', { language: 'fa' }),
      );
      return (await response.json()) as TrendingMovieWeekResponseSchema;
    },
    queryKey: ['trending', 'movies', 'week'],
  },
  details: (movieId: string | undefined, language: 'en' | 'fa') => {
    return {
      queryFn: async () => {
        const response = await fetch(
          proxiedUrl(`/movie/${movieId}`, { language: language }),
        );
        return (await response.json()) as MovieDetailsResponseSchema;
      },
      queryKey: ['movie', movieId, 'details', language],
    };
  },
});
