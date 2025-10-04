import { type FC } from 'react';
import { Link } from 'react-router';

import { IMDBLogo } from '@/components/svg/imdb';
import { Badge } from '@/components/ui/badge';
import type { TvShowDetailsResponseSchema } from '@/queries/tv';

interface TvShowInformationProps {
  tvShowDetails: TvShowDetailsResponseSchema;
}

export const TvShowInformation: FC<TvShowInformationProps> = ({
  tvShowDetails,
}) => {
  return (
    <div className="grid max-h-max grid-cols-1 gap-y-2">
      <Badge>اطلاعات فیلم</Badge>
      <Link
        className="mb-3 flex gap-x-2 rounded-lg border bg-[#e2b616] p-2.5 text-black underline"
        to={`https://www.imdb.com/title/${tvShowDetails?.external_ids.imdb_id}`}
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
          {tvShowDetails?.genres.map((genre) => genre.name).join(' - ')}
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          کارگردان
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {tvShowDetails?.created_by.at(0)?.name}
        </span>
      </div>
      <div className="flex gap-x-1.5">
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          زبان‌ها
        </span>
        <span className="flex items-center">:</span>
        <span className="flex flex-1 items-center justify-center rounded-lg border py-3 text-xs">
          {tvShowDetails?.spoken_languages
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
          {tvShowDetails?.production_countries.at(0)?.name}
        </span>
      </div>
    </div>
  );
};
