import { type FC } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import {
  ConfirmDialogProvider,
  type ConfirmOptions,
} from '@/components/ui/confirm-dialog';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/libraries/tailwind-utilities';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { RouterProvider } from '@/providers/router-provider';
import { StylesProvider } from '@/providers/styles-provider';
import { ThemeProvider } from '@/providers/theme-provider';

const confirmDialogConfig: ConfirmOptions = {
  alertDialogDescription: {
    className: cn('text-center md:text-start'),
  },
  alertDialogFooter: {
    className: cn('gap-3'),
  },
  alertDialogTitle: {
    className: cn('text-center md:text-start'),
  },
  cancelButton: {
    className: cn('!me-2 mt-2 w-full md:me-2 md:mt-0 md:w-auto'),
  },
  confirmButton: {
    className: cn('!m-0 w-full md:w-auto'),
  },
};

export const Providers: FC = () => {
  return (
    <HelmetProvider>
      <Toaster
        richColors
        toastOptions={{ classNames: { title: 'font-sans' } }}
      />
      <StylesProvider />
      <QueryClientProvider>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <ConfirmDialogProvider defaultOptions={confirmDialogConfig}>
            <RouterProvider />
          </ConfirmDialogProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
