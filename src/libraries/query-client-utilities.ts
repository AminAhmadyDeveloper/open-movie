import { QueryClient } from '@tanstack/react-query';

export let clientQueryClientSingleton: QueryClient;

export const makeQueryClient = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  return client;
};

export const getQueryClient = () => {
  if (globalThis.window === undefined) return makeQueryClient();
  return (clientQueryClientSingleton ??= makeQueryClient());
};
