import { PlaySquareIcon, StarIcon } from 'lucide-react';
import { type FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { $image } from '@/services/image-service';

export interface HorizontalMovieCardProps {
  id: number;
  overview: string | undefined;
  posterPath: string;
  title: string;
  type: 'movie' | 'show';
  voteAverage: number;
}

export const HorizontalMovieCard: FC<HorizontalMovieCardProps> = ({
  id,
  overview,
  posterPath,
  title,
  voteAverage,
}) => {
  return (
    <Card className="relative overflow-hidden p-0">
      <Badge className="absolute start-3 top-3 flex items-center">
        <StarIcon />
        <span className="mt-0.5">
          امتیاز: {voteAverage}
          /10
        </span>
      </Badge>
      <LazyLoadImage
        className="aspect-video size-full object-cover object-center"
        loading="lazy"
        src={$image(posterPath, { size: '500' })}
      />
      <CardContent className="flex flex-col justify-end pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-4">
          {(
            overview || 'هنوز توضیحات و خلاصه ای برای این عنوان ثبت نشده است'
          ).slice(0, 50)}
          ...
        </CardDescription>
        <CardAction className="mt-4 w-full">
          <Button asChild className="w-full">
            <Link to={`/movie/${id}`}>
              <PlaySquareIcon className="size-5" />
              دانلود و تماشا
            </Link>
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
};
