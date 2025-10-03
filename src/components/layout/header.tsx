import { type FC, useState } from 'react';
import { Link } from 'react-router';

import { Logo } from '@/components/svg/logo';
import { useEventListener } from '@/hooks/use-event-listener';
import { cn } from '@/libraries/tailwind-utilities';

export const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEventListener('scroll', handleScroll);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 h-20 w-full items-center justify-between bg-gradient-to-b from-background to-transparent py-4 transition-all',
        'data-[scrolled=true]:!h-16 data-[scrolled=true]:!to-background',
      )}
      data-scrolled={isScrolled}
    >
      <div className="container flex items-center justify-start gap-x-4">
        <Logo className="size-10" />
        <nav className="flex items-center gap-x-4">
          <Link className="text-sm" to="/">
            صفحه اصلی
          </Link>
          <Link className="text-sm" to="/about">
            درباره ما
          </Link>
        </nav>
      </div>
    </header>
  );
};
