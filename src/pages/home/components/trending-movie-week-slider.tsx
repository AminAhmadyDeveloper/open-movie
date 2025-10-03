import { useSuspenseQuery } from '@tanstack/react-query';

import { VerticalMovieCard } from '@/components/common/vertical-movie-card';
import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
} from '@/components/ui/carousel';
import { For } from '@/components/utilities/for';
import { queries } from '@/queries';

export const TrendingMovieWeekSlider = () => {
  const trendingMovieWeekQuery = useSuspenseQuery(queries.movies.all);

  return (
    <Carousel
      carouselOptions={{
        align: 'start',
        loop: true,
      }}
      className="container mb-12 bg-transparent md:-mt-20 lg:-mt-30 xl:-mt-40"
      dir="rtl"
    >
      <CarouselMainContainer className="bg-transparent">
        <For each={trendingMovieWeekQuery.data?.data?.results}>
          {(movie) => {
            return (
              <SliderMainItem
                className="bg-transparent pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                key={movie.id}
              >
                <VerticalMovieCard
                  id={movie.id}
                  overview={movie.overview}
                  posterPath={movie.poster_path}
                  title={movie.title}
                  type="movie"
                />
              </SliderMainItem>
            );
          }}
        </For>
      </CarouselMainContainer>
      <div className="bottom-2 left-1/2 hidden -translate-x-1/2">
        <CarouselThumbsContainer className="gap-x-1">
          <For
            each={Array.from({
              length: trendingMovieWeekQuery.data?.data?.results.length || 0,
            })}
          >
            {(_, index) => <CarouselIndicator index={index} key={index} />}
          </For>
        </CarouselThumbsContainer>
      </div>
      <CarouselNext className="absolute top-15 right-auto bottom-0 left-24 size-12 !bg-background/35 backdrop-blur-xl lg:top-10 lg:left-[calc(var(--spacing)*38)] xl:top-auto xl:left-16 dark:!bg-background/35" />
      <CarouselPrevious className="absolute top-15 right-auto bottom-0 left-10 size-12 !bg-background/35 backdrop-blur-xl lg:top-10 lg:left-24 xl:top-auto xl:left-2 dark:!bg-background/35" />
    </Carousel>
  );
};
