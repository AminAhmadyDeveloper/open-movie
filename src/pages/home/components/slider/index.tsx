import { useQueries, useSuspenseQuery } from '@tanstack/react-query';
import { type FC, useMemo } from 'react';

import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
} from '@/components/ui/carousel';
import { For } from '@/components/utilities/for';
import { SliderMovie } from '@/pages/home/components/slider/slider-movie';
import { queries } from '@/queries';

export const Slider: FC = () => {
  const sliderMoviesQuery = useSuspenseQuery(queries.movies.all);

  const sliderMovies = useMemo(
    () =>
      sliderMoviesQuery.data?.results
        .filter((movie) => !!movie.overview)
        .filter((movie) => !!movie.backdrop_path)
        .slice(0, 6) || [],
    [sliderMoviesQuery.data?.results],
  );

  const sliderMoviesImagesQueries = useQueries({
    queries: sliderMovies?.map((slider) => {
      return queries.images.all(slider.id);
    }),
  });

  return (
    <Carousel dir="rtl">
      <CarouselNext className="absolute top-auto right-auto bottom-10 left-24 size-12 !bg-background/35 backdrop-blur-xl md:bottom-20 lg:bottom-30 dark:!bg-background/35" />
      <CarouselPrevious className="absolute top-auto right-auto bottom-10 left-10 size-12 !bg-background/35 backdrop-blur-xl md:bottom-20 lg:bottom-30 dark:!bg-background/35" />
      <CarouselMainContainer className="h-[70vh] lg:h-[calc(100vh-4rem)]">
        <For each={sliderMovies}>
          {(movie, movieIndex) => {
            const movieLogo = sliderMoviesImagesQueries
              .at(movieIndex)
              ?.data?.data?.logos?.at(0);

            const movieBackdrop = sliderMoviesImagesQueries
              .at(movieIndex)
              ?.data?.data?.backdrops?.at(0);

            return (
              <SliderMovie
                movie={movie}
                movieBackdrop={movieBackdrop}
                movieLogo={movieLogo}
              />
            );
          }}
        </For>
      </CarouselMainContainer>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <CarouselThumbsContainer className="gap-x-1">
          <For each={Array.from({ length: 6 })}>
            {(_, index) => <CarouselIndicator index={index} key={index} />}
          </For>
        </CarouselThumbsContainer>
      </div>
    </Carousel>
  );
};
