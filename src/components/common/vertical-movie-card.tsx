import { PlaySquareIcon } from 'lucide-react';
import { type FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { $image } from '@/services/image-service';

export interface VerticalMovieCardProps {
  id: number;
  overview: string | undefined;
  posterPath: string;
  title: string;
  type: 'movie' | 'show';
}

export const VerticalMovieCard: FC<VerticalMovieCardProps> = ({
  id,
  overview,
  posterPath,
  title,
}) => {
  return (
    <Card className="group relative h-[calc(var(--spacing)*128)] w-full overflow-hidden p-0 lg:h-[calc(var(--spacing)*110)]">
      <LazyLoadImage
        className="size-full object-cover"
        loading="lazy"
        src={$image(posterPath, { size: '500' })}
      />
      <CardContent className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-card pb-4 transition-all duration-500 group-hover:opacity-100 lg:opacity-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-4">
          {(
            overview || 'هنوز توضیحات و خلاصه ای برای این عنوان ثبت نشده است'
          ).slice(0, 120)}
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
