import { useSuspenseQuery } from '@tanstack/react-query';
import type { FC } from 'react';

import { HorizontalMovieCard } from '@/components/common/horizontal-movie-card';
import { For } from '@/components/utilities/for';
import { queries } from '@/queries';

export const MoviesList: FC = () => {
  const trendingMovieWeekQuery = useSuspenseQuery(queries.movies.all);

  return (
    <div className="container">
      <h3 className="mt-4 mb-3 text-lg font-bold">لیست فیلم ها</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <For each={trendingMovieWeekQuery.data?.results}>
          {(movie) => {
            return (
              <HorizontalMovieCard
                id={movie.id}
                overview={movie.overview}
                posterPath={movie.poster_path}
                title={movie.title}
                type="movie"
                voteAverage={movie.vote_average}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
};
