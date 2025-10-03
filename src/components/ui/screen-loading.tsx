import { type FC } from 'react';

import { Spinner } from '@/components/ui/spinner';

export const ScreenLoading: FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <Spinner className="bg-foreground" size="lg" />
    </div>
  );
};
