'use client';

import {
  QueryClientProvider as QueryClientProviderPrimitive,
  type QueryClientProviderProps,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { FC } from 'react';
import { Fragment, useState } from 'react';

import { getQueryClient } from '@/libraries/query-client-utilities';

export const QueryClientProvider: FC<
  Omit<QueryClientProviderProps, 'client'>
> = (props) => {
  const [queryClient] = useState(getQueryClient());

  return (
    <Fragment>
      <QueryClientProviderPrimitive client={queryClient} {...props} />
      <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
    </Fragment>
  );
};
