import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect';

function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: RefObject<MediaQueryList>,
  options?: AddEventListenerOptions | boolean,
): void;

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: AddEventListenerOptions | boolean,
): void;

function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap
    ? HTMLDivElement
    : SVGElement,
>(
  eventName: K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  element: RefObject<T>,
  options?: AddEventListenerOptions | boolean,
): void;

function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: RefObject<Document>,
  options?: AddEventListenerOptions | boolean,
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | MediaQueryList | SVGAElement = HTMLElement,
>(
  eventName: KH | KM | KW,
  handler: (
    event:
      | Event
      | HTMLElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | SVGElementEventMap[KH]
      | WindowEventMap[KW],
  ) => void,
  element?: RefObject<T>,
  options?: AddEventListenerOptions | boolean,
) {
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | typeof globalThis | Window =
      element?.current ?? globalThis;

    if (!targetElement?.addEventListener) {
      return;
    }

    const listener: typeof handler = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, listener, options);

    return () => {
      targetElement.removeEventListener(eventName, listener, options);
    };
  }, [eventName, element, options]);
}

export { useEventListener };
