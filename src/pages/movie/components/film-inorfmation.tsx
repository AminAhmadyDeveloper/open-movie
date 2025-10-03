import { type FC } from 'react';
import { Link } from 'react-router';

import { IMDBLogo } from '@/components/svg/imdb';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/libraries/string-utilities';
import { minutesToHoursMinutes } from '@/libraries/time-utilities';
import type { MovieDetailsResponseSchema } from '@/queries/movies';

interface FilmInformationProps {
  movieDetails: MovieDetailsResponseSchema;
}

export const FilmInformation: FC<FilmInformationProps> = ({ movieDetails }) => {
  return (
    <div className="grid max-h-max grid-cols-1 gap-y-2">
      <Badge>اطلاعات فیلم</Badge>
      <Link
        className="mb-3 flex gap-x-2 rounded-lg border bg-[#e2b616] p-2.5 text-black underline"
        to={`https://www.imdb.com/title/${movieDetails?.imdb_id}`}
      >
        <IMDBLogo />
        صفحه IMDB
      </Link>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          ژانر
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {movieDetails?.genres.map((genre) => genre.name).join(' - ')}
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          بودجه
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {formatPrice(movieDetails?.budget || 0)} دلار
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          مدت زمان
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {minutesToHoursMinutes(movieDetails?.runtime || 0)}
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          زبان‌ها
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {movieDetails?.spoken_languages
            .map((language) => language.name)
            .join(' - ')}
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          محصول کشور
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {movieDetails?.production_countries.at(0)?.name}
        </span>
      </div>
    </div>
  );
};
