import { useSuspenseQuery } from '@tanstack/react-query';
import type { FC } from 'react';

import { HorizontalMovieCard } from '@/components/common/horizontal-movie-card';
import { For } from '@/components/utilities/for';
import { queries } from '@/queries';

export const TVList: FC = () => {
  const trendingTvWeekQuery = useSuspenseQuery(queries.tv.all);

  return (
    <div className="container">
      <h3 className="mt-4 mb-3 text-lg font-bold">لیست سریال ها</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <For each={trendingTvWeekQuery.data.data?.results}>
          {(show) => {
            return (
              <HorizontalMovieCard
                id={show.id}
                overview={show.overview}
                posterPath={show.poster_path}
                title={show.name}
                type="show"
                voteAverage={show.vote_average}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
};
