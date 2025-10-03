import { type FC, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ScreenLoading } from '@/components/ui/screen-loading';
import { MoviesList } from '@/pages/home/components/movies-list';
import { Slider } from '@/pages/home/components/slider';
import { TrendingMovieWeekSlider } from '@/pages/home/components/trending-movie-week-slider';

const HomePage: FC = () => {
  return (
    <main>
      <ErrorBoundary fallback="">
        <Suspense fallback={<ScreenLoading />}>
          <Slider />
          <h2 className="block p-4 pb-2 font-bold md:hidden">آخرین فیلم ها</h2>
          <TrendingMovieWeekSlider />
          <MoviesList />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default HomePage;
