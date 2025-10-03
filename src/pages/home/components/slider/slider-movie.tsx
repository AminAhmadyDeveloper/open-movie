import type { ComponentProps, FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { SliderMainItem } from '@/components/ui/carousel';
import { Show } from '@/components/utilities/show';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AllImagesResponseSchema } from '@/queries/images';
import type { TrendingMovieWeekResponseSchema } from '@/queries/movies';
import { $image } from '@/services/image-service';

export interface SliderMovieProps
  extends Omit<ComponentProps<typeof SliderMainItem>, 'children'> {
  movie: TrendingMovieWeekResponseSchema['results'][0];
  movieBackdrop: AllImagesResponseSchema['backdrops'][0] | undefined;
  movieLogo: AllImagesResponseSchema['logos'][0] | undefined;
}

export const SliderMovie: FC<SliderMovieProps> = ({
  movie,
  movieBackdrop,
  movieLogo,
  ...props
}) => {
  const isMobile = useIsMobile();

  return (
    <SliderMainItem
      className="relative overflow-hidden rounded-b-xl"
      key={movie.id}
      {...props}
    >
      <img
        className="relative size-full rounded-b-xl object-cover object-center"
        src={$image(movieBackdrop?.file_path || movie.backdrop_path, {
          size: isMobile ? '1280' : 'original',
          type: 'cover',
        })}
      />
      <div className="absolute inset-0 bg-gradient-to-l from-background to-transparent" />
      <div className="absolute top-1/2 right-5 flex max-w-xs -translate-y-8/12 flex-col items-start justify-start md:right-12 md:max-w-md md:justify-center lg:right-20">
        <Show on={movieLogo?.file_path}>
          {(filePath) => {
            return (
              <LazyLoadImage
                className="size-48 object-contain md:size-60 lg:size-72"
                loading="lazy"
                src={$image(filePath, { size: '500' })}
              />
            );
          }}
        </Show>
        <h3 className="font-bold">{movie.overview.slice(0, 120)}...</h3>
        <div className="mt-4 flex w-full items-center justify-start">
          <Button asChild type="button">
            <Link to={`/movie/${movie.id}`}>دانلود و تماشا</Link>
          </Button>
        </div>
      </div>
    </SliderMainItem>
  );
};
