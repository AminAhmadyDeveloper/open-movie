import { StarIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Badge } from '@/components/ui/badge';
import { Show } from '@/components/utilities/show';
import type { MovieDetailsResponseSchema } from '@/queries/movies';
import { $image } from '@/services/image-service';

interface FilmHeroSectionProps {
  movieDetails: MovieDetailsResponseSchema;
}

export const FilmHeroSection: FC<FilmHeroSectionProps> = ({ movieDetails }) => {
  const jalaliReleaseYear = useMemo(() => {
    const year = movieDetails?.release_date.slice(0, 4);
    return year;
  }, [movieDetails?.release_date]);

  return (
    <div className="relative h-[80vh] overflow-hidden rounded-b-2xl lg:h-[calc(80vh-4rem)]">
      <img
        className="size-full object-cover object-center"
        src={$image(movieDetails.backdrop_path, { type: 'cover' })}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent">
        <div className="flex size-full flex-col items-center justify-center md:items-start md:ps-80">
          <Show on={movieDetails?.poster_path}>
            {(posterPath) => {
              return (
                <div className="relative overflow-hidden rounded-2xl outline-1 outline-border md:absolute md:start-24 md:top-1/2 md:mb-0 md:-translate-y-1/2">
                  <LazyLoadImage
                    className="w-44 md:w-52"
                    loading="eager"
                    src={$image(posterPath, { size: '500' })}
                  />
                  <Badge
                    className="absolute start-3 top-3 flex items-center"
                    variant="secondary"
                  >
                    <StarIcon />
                    <span className="mt-0.5">
                      امتیاز: {movieDetails?.vote_average}
                      /10
                    </span>
                  </Badge>
                </div>
              );
            }}
          </Show>
          <div className="container flex flex-col items-center justify-center">
            <h1 className="mt-6 w-full text-center text-lg font-bold md:mt-0 md:text-start">
              فیلم {movieDetails?.title}
            </h1>
            <p className="my-4 text-center md:w-full md:text-start">
              خلاصه داستان:{' '}
              {movieDetails?.overview.slice(0, 240) ||
                'هنوز توضیحات و خلاصه ای برای این عنوان ثبت نشده است'}
              ...
            </p>
            <div className="w-max md:w-full">
              <Badge className="mx-1 mb-1">
                سال تولید: {jalaliReleaseYear}
              </Badge>
              <Badge className="mx-1 mb-1">
                مدت زمان: {movieDetails?.runtime} دقیقه
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
