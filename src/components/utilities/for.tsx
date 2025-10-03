import { Fragment, type ReactElement, type ReactNode } from 'react';

interface ForProps<GEach> {
  children: (item: GEach, index: number) => ReactNode;
  each: readonly GEach[] | undefined;
  fallback?: ReactNode;
}

export const For = <GEach,>({
  children,
  each,
  fallback,
}: ForProps<GEach>): null | ReactElement => {
  if (each?.length === 0 && fallback) return <Fragment>{fallback}</Fragment>;

  return (
    <Fragment>{each?.map((item, index) => children(item, index))}</Fragment>
  );
};
