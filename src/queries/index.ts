import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { images } from '@/queries/images';
import { movies } from '@/queries/movies';
import { tv } from '@/queries/tv';
import { videos } from '@/queries/videos';

export const queries = mergeQueryKeys(movies, images, videos, tv);
