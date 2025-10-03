import type { ReactNode } from 'react';

type ShowProps<TValue> = {
  children: (on: NonNullable<TValue>) => ReactNode;
  on: TValue;
};

export const Show = <TValue,>({ children, on }: ShowProps<TValue>) => {
  return on ? children(on) : null;
};
