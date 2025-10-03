import { useEffect, useLayoutEffect } from 'react';

export const useIsomorphicLayoutEffect =
  // eslint-disable-next-line unicorn/no-negated-condition, unicorn/no-typeof-undefined
  typeof globalThis.window !== 'undefined' ? useLayoutEffect : useEffect;
