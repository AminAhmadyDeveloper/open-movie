import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { images } from '@/queries/images';
import { movies } from '@/queries/movies';
import { tv } from '@/queries/tv';

export const queries = mergeQueryKeys(movies, images, tv);
