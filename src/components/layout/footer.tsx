import { CodeIcon } from 'lucide-react';
import type { FC } from 'react';

import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { cn } from '@/libraries/tailwind-utilities';

const twitterUrl = 'https://twitter.com/MorningStartHero';

export const Footer: FC<ReactHtmlElement> = ({ className, ...props }) => {
  return (
    <footer className={cn(className, 'px-4 py-6')} {...props}>
      <div className="flex items-center p-0">
        <CodeIcon className="me-2 size-6" />
        <p className="text-xs md:text-sm">
          برنامه نویسی شده توسط{' '}
          <a className="underline underline-offset-4" href={twitterUrl}>
            اپن فیلم
          </a>
          .
        </p>
        <div className="ms-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
};
