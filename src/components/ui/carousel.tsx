import { type EmblaOptionsType } from 'embla-carousel';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createContext } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/libraries/tailwind-utilities';

type CarouselContextProps = {
  carouselOptions?: EmblaOptionsType;
  orientation?: 'horizontal' | 'vertical';
  plugins?: Parameters<typeof useEmblaCarousel>[1];
};

type CarouselContextType = {
  activeIndex: number;
  canScrollNext: boolean;
  canScrollPrev: boolean;
  direction: DirectionOption;
  emblaMainApi: ReturnType<typeof useEmblaCarousel>[1];
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  mainRef: ReturnType<typeof useEmblaCarousel>[0];
  onThumbClick: (index: number) => void;
  orientation: 'horizontal' | 'vertical';
  scrollNext: () => void;
  scrollPrev: () => void;
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0];
} & CarouselContextProps;

type DirectionOption = 'ltr' | 'rtl' | undefined;

const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
};

const CarouselContext = createContext<CarouselContextType | null>(null);

/**
 * Carousel Docs: {@link: https://shadcn-extension.vercel.app/docs/carousel}
 */

const Carousel = forwardRef<
  HTMLDivElement,
  { dir?: string } & CarouselContextProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      carouselOptions,
      children,
      className,
      dir,
      orientation = 'horizontal',
      plugins,
      ...props
    },
    reference,
  ) => {
    const [emblaMainReference, emblaMainApi] = useEmblaCarousel(
      {
        ...carouselOptions,
        axis: orientation === 'vertical' ? 'y' : 'x',
        direction: carouselOptions?.direction ?? (dir as DirectionOption),
      },
      plugins,
    );

    const [emblaThumbsReference, emblaThumbsApi] = useEmblaCarousel(
      {
        ...carouselOptions,
        axis: orientation === 'vertical' ? 'y' : 'x',
        containScroll: 'keepSnaps',
        direction: carouselOptions?.direction ?? (dir as DirectionOption),
        dragFree: true,
      },
      plugins,
    );

    const [canScrollPrevious, setCanScrollPrevious] = useState<boolean>(false);
    const [canScrollNext, setCanScrollNext] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const ScrollNext = useCallback(() => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollNext();
    }, [emblaMainApi]);

    const ScrollPrevious = useCallback(() => {
      if (!emblaMainApi) return;
      emblaMainApi.scrollPrev();
    }, [emblaMainApi]);

    const direction = carouselOptions?.direction ?? (dir as DirectionOption);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!emblaMainApi) return;
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            if (orientation === 'vertical') {
              ScrollNext();
            }
            break;
          }
          case 'ArrowLeft': {
            event.preventDefault();
            if (orientation === 'horizontal') {
              if (direction === 'rtl') {
                ScrollNext();
                return;
              }
              ScrollPrevious();
            }
            break;
          }
          case 'ArrowRight': {
            event.preventDefault();
            if (orientation === 'horizontal') {
              if (direction === 'rtl') {
                ScrollPrevious();
                return;
              }
              ScrollNext();
            }
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            if (orientation === 'vertical') {
              ScrollPrevious();
            }
            break;
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [emblaMainApi, orientation, direction],
    );

    const onThumbClick = useCallback(
      (index: number) => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        emblaMainApi.scrollTo(index);
      },
      [emblaMainApi, emblaThumbsApi],
    );

    const onSelect = useCallback(() => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      const selected = emblaMainApi.selectedScrollSnap();
      setActiveIndex(selected);
      emblaThumbsApi.scrollTo(selected);
      setCanScrollPrevious(emblaMainApi.canScrollPrev());
      setCanScrollNext(emblaMainApi.canScrollNext());
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
      if (!emblaMainApi) return;
      onSelect();
      emblaMainApi.on('select', onSelect);
      emblaMainApi.on('reInit', onSelect);
      return () => {
        emblaMainApi.off('select', onSelect);
      };
    }, [emblaMainApi, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          activeIndex,
          canScrollNext,
          canScrollPrev: canScrollPrevious,
          carouselOptions,
          direction,
          emblaMainApi,
          handleKeyDown,
          mainRef: emblaMainReference,
          onThumbClick,
          orientation:
            orientation ||
            (carouselOptions?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollNext: ScrollNext,
          scrollPrev: ScrollPrevious,
          thumbsRef: emblaThumbsReference,
        }}
      >
        <div
          {...props}
          className={cn(
            'relative grid w-full gap-2 focus:outline-none',
            className,
          )}
          dir={direction}
          onKeyDownCapture={handleKeyDown}
          ref={reference}
          tabIndex={0}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);

Carousel.displayName = 'Carousel';

const CarouselMainContainer = forwardRef<
  HTMLDivElement,
  {} & { dir?: string } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, dir, ...props }, reference) => {
  const { direction, mainRef, orientation } = useCarousel();

  return (
    <div {...props} className="overflow-hidden" dir={direction} ref={mainRef}>
      <div
        className={cn(
          'flex',
          `${orientation === 'vertical' ? 'flex-col' : ''}`,
          className,
        )}
        ref={reference}
      >
        {children}
      </div>
    </div>
  );
});

CarouselMainContainer.displayName = 'CarouselMainContainer';

const CarouselThumbsContainer = forwardRef<
  HTMLDivElement,
  {} & { dir?: string } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, dir, ...props }, reference) => {
  const { direction, orientation, thumbsRef } = useCarousel();

  return (
    <div {...props} className="overflow-hidden" dir={direction} ref={thumbsRef}>
      <div
        className={cn(
          'flex',
          `${orientation === 'vertical' ? 'flex-col' : ''}`,
          className,
        )}
        ref={reference}
      >
        {children}
      </div>
    </div>
  );
});

CarouselThumbsContainer.displayName = 'CarouselThumbsContainer';

const SliderMainItem = forwardRef<
  HTMLDivElement,
  {} & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, reference) => {
  const { orientation } = useCarousel();
  return (
    <div
      {...props}
      className={cn(
        `min-w-0 shrink-0 grow-0 basis-full bg-background p-1 ${
          orientation === 'vertical' ? 'pb-1' : 'pr-1'
        }`,
        className,
      )}
      ref={reference}
    >
      {children}
    </div>
  );
});

SliderMainItem.displayName = 'SliderMainItem';

const SliderThumbItem = forwardRef<
  HTMLDivElement,
  {
    index: number;
  } & React.HTMLAttributes<HTMLDivElement>
>(({ children, className, index, ...props }, reference) => {
  const { activeIndex, onThumbClick, orientation } = useCarousel();
  const isSlideActive = activeIndex === index;
  return (
    <div
      {...props}
      className={cn(
        'flex min-w-0 shrink-0 grow-0 basis-1/3 bg-background p-1',
        `${orientation === 'vertical' ? 'pt-1' : 'pr-1'}`,
        className,
      )}
      onClick={() => onThumbClick(index)}
      ref={reference}
    >
      <div
        className={`relative aspect-square h-20 w-full rounded-lg opacity-50 transition-opacity ${
          isSlideActive ? '!opacity-100' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
});

SliderThumbItem.displayName = 'SliderThumbItem';

const CarouselIndicator = forwardRef<
  HTMLButtonElement,
  { index: number } & React.ComponentProps<typeof Button>
>(({ children, className, index, ...props }, reference) => {
  const { activeIndex, onThumbClick } = useCarousel();
  const isSlideActive = activeIndex === index;
  return (
    <Button
      className={cn(
        'h-1.5 w-6 rounded-full',
        "data-[active='false']:bg-primary/50 data-[active='true']:bg-primary",
        className,
      )}
      data-active={isSlideActive}
      onClick={() => onThumbClick(index)}
      ref={reference}
      size="icon"
      {...props}
    >
      <span className="sr-only">slide {index + 1} </span>
    </Button>
  );
});

CarouselIndicator.displayName = 'CarouselIndicator';

const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    { className, dir, size = 'icon', variant = 'outline', ...props },
    reference,
  ) => {
    const {
      canScrollNext,
      canScrollPrev,
      direction,
      orientation,
      scrollNext,
      scrollPrev,
    } = useCarousel();

    const scroll = direction === 'rtl' ? scrollNext : scrollPrev;
    const canScroll = direction === 'rtl' ? canScrollNext : canScrollPrev;
    return (
      <Button
        className={cn(
          'absolute z-10 h-6 w-6 rounded-full',
          orientation === 'vertical'
            ? '-top-2 left-1/2 -translate-x-1/2 rotate-90'
            : 'top-1/2 -left-2 -translate-y-1/2',
          className,
        )}
        disabled={!canScroll}
        onClick={scroll}
        ref={reference}
        size={size}
        variant={variant}
        {...props}
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  (
    { className, dir, size = 'icon', variant = 'outline', ...props },
    reference,
  ) => {
    const {
      canScrollNext,
      canScrollPrev,
      direction,
      orientation,
      scrollNext,
      scrollPrev,
    } = useCarousel();
    const scroll = direction === 'rtl' ? scrollPrev : scrollNext;
    const canScroll = direction === 'rtl' ? canScrollPrev : canScrollNext;
    return (
      <Button
        className={cn(
          'absolute z-10 h-6 w-6 rounded-full',
          orientation === 'vertical'
            ? '-bottom-2 left-1/2 -translate-x-1/2 rotate-90'
            : 'top-1/2 -right-2 -translate-y-1/2',
          className,
        )}
        disabled={!canScroll}
        onClick={scroll}
        ref={reference}
        size={size}
        variant={variant}
        {...props}
      >
        <ChevronRightIcon className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);

CarouselNext.displayName = 'CarouselNext';

export {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
  useCarousel,
};
