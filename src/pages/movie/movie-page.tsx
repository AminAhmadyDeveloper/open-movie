import { useQueries } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { ScreenLoading } from '@/components/ui/screen-loading';
import { Show } from '@/components/utilities/show';
import { FilmDownloadSection } from '@/pages/movie/components/film-download-section';
import { FilmHeroSection } from '@/pages/movie/components/film-hero-section';
import { FilmInformation } from '@/pages/movie/components/film-inorfmation';
import { queries } from '@/queries';

const MoviePage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movieDetailsQuery, movieEnglishDetailsQuery] = useQueries({
    queries: [
      {
        ...queries.movies['details'](movieId, 'fa'),
        enabled: !!movieId,
      },
      {
        ...queries.movies['details'](movieId, 'en'),
        enabled: !!movieId,
      },
    ],
  });

  if (movieDetailsQuery.isFetching || movieEnglishDetailsQuery.isFetching) {
    return <ScreenLoading />;
  }

  return (
    <main>
      <Show on={movieDetailsQuery.data}>
        {(movieDetails) => {
          return <FilmHeroSection movieDetails={movieDetails} />;
        }}
      </Show>
      <div className="relative container -mt-24 grid grid-cols-1 pt-5 md:mt-0 md:grid-cols-2 xl:grid-cols-5">
        <div className="p-4 md:col-span-1 xl:col-span-3">
          <Show on={movieDetailsQuery.data}>
            {(movieDetails) => {
              return (
                <FilmDownloadSection
                  englishTitle={movieEnglishDetailsQuery.data?.title}
                  movieDetails={movieDetails}
                />
              );
            }}
          </Show>
        </div>
        <div className="p-4 md:col-span-1 xl:col-span-2">
          <Show on={movieDetailsQuery.data}>
            {(movieDetails) => {
              return <FilmInformation movieDetails={movieDetails} />;
            }}
          </Show>
        </div>
      </div>
    </main>
  );
};

export default MoviePage;
