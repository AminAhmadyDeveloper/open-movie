import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { createQueryKeys } from '@lukemorales/query-key-factory';
import { z } from 'zod/v4';

export const tvResponseSchema = z.object({
  page: z.number(),
  results: z.array(
    z.object({
      adult: z.boolean(),
      backdrop_path: z.string(),
      first_air_date: z.string(),
      genre_ids: z.array(z.number()),
      id: z.number(),
      media_type: z.string(),
      name: z.string(),
      origin_country: z.array(z.string()),
      original_language: z.string(),
      original_name: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
      vote_average: z.number(),
      vote_count: z.number(),
    }),
  ),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TvResponseSchema = z.infer<typeof tvResponseSchema>;

export const tvShowDetailsResponseSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string(),
  created_by: z.array(
    z.object({
      credit_id: z.string(),
      gender: z.number(),
      id: z.number(),
      name: z.string(),
      original_name: z.string(),
      profile_path: z.string(),
    }),
  ),
  episode_run_time: z.array(z.unknown()),
  external_ids: z.object({
    facebook_id: z.string(),
    freebase_id: z.null(),
    freebase_mid: z.null(),
    imdb_id: z.string(),
    instagram_id: z.string(),
    tvdb_id: z.number(),
    tvrage_id: z.null(),
    twitter_id: z.string(),
    wikidata_id: z.string(),
  }),
  first_air_date: z.string(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  homepage: z.string(),
  id: z.number(),
  in_production: z.boolean(),
  languages: z.array(z.string()),
  last_air_date: z.string(),
  last_episode_to_air: z.object({
    air_date: z.string(),
    episode_number: z.number(),
    episode_type: z.string(),
    id: z.number(),
    name: z.string(),
    overview: z.string(),
    production_code: z.string(),
    runtime: z.number(),
    season_number: z.number(),
    show_id: z.number(),
    still_path: z.string(),
    vote_average: z.number(),
    vote_count: z.number(),
  }),
  name: z.string(),
  networks: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  next_episode_to_air: z.object({
    air_date: z.string(),
    episode_number: z.number(),
    episode_type: z.string(),
    id: z.number(),
    name: z.string(),
    overview: z.string(),
    production_code: z.string(),
    runtime: z.null(),
    season_number: z.number(),
    show_id: z.number(),
    still_path: z.null(),
    vote_average: z.number(),
    vote_count: z.number(),
  }),
  number_of_episodes: z.number(),
  number_of_seasons: z.number(),
  origin_country: z.array(z.string()),
  original_language: z.string(),
  original_name: z.string(),
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
  seasons: z.array(
    z.object({
      air_date: z.string(),
      episode_count: z.number(),
      id: z.number(),
      name: z.string(),
      overview: z.string(),
      poster_path: z.string(),
      season_number: z.number(),
      vote_average: z.number(),
    }),
  ),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string(),
  type: z.string(),
  videos: z.object({ results: z.array(z.unknown()) }),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type TvShowDetailsResponseSchema = z.infer<
  typeof tvShowDetailsResponseSchema
>;

const $fetch = createFetch({
  baseURL: import.meta.env.VITE_PUBLIC_TMDB_API_BASE_URL,
  plugins: [logger()],
  schema: createSchema({
    '@get/trending/tv/week': {
      query: z.object({
        api_key: z.string(),
        language: z.enum(['fa']),
      }),
    },
    '@get/tv/:tv_id': {
      params: z.object({
        tv_id: z.string().or(z.number()),
      }),
      query: z.object({
        api_key: z.string(),
        append_to_response: z.string().or(z.number()),
        language: z.enum(['fa']),
      }),
    },
  }),
});

export const tv = createQueryKeys('tv', {
  all: {
    queryFn: () => {
      return $fetch<TvResponseSchema>('@get/trending/tv/week', {
        headers: {
          'cache-control': 'no-cache',
        },
        query: {
          api_key: import.meta.env.VITE_PUBLIC_TMDB_API_KEY,
          language: 'fa',
        },
      });
    },
    queryKey: ['trending', 'tv', 'week'],
  },
  details: (tvId: string | undefined) => {
    return {
      queryFn: () => {
        return $fetch<TvShowDetailsResponseSchema>('@get/tv/:tv_id', {
          headers: {
            'cache-control': 'no-cache',
          },
          params: {
            tv_id: tvId || '',
          },
          query: {
            api_key: import.meta.env.VITE_PUBLIC_TMDB_API_KEY,
            append_to_response: 'external_ids,videos,backdrop_path',
            language: 'fa',
          },
        });
      },
      queryKey: ['tv', 'details', tvId],
    };
  },
});
