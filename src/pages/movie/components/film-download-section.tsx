import { DownloadCloudIcon, TextQuoteIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Link } from 'react-router';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { For } from '@/components/utilities/for';
import { Show } from '@/components/utilities/show';
import { Case, Default, Switch } from '@/components/utilities/switch-case';
import { type MovieQuality, useAlmasMovieData } from '@/hooks/use-almas-data';
import { slugify } from '@/libraries/string-utilities';
import { cn } from '@/libraries/tailwind-utilities';
import type { MovieDetailsResponseSchema } from '@/queries/movies';

interface FilmDownloadSectionProps {
  englishTitle: string | undefined;
  movieDetails: MovieDetailsResponseSchema;
}

export const FilmDownloadSection: FC<FilmDownloadSectionProps> = ({
  englishTitle,
  movieDetails,
}) => {
  const linkGenerationData = useMemo(() => {
    const imdbShort = movieDetails?.imdb_id.replace('tt', '');
    const encodedTitle = encodeURIComponent(movieDetails?.title || '');
    const releaseYear = movieDetails?.release_date.slice(0, 4);

    return {
      encodedTitle,
      imdbShort,
      releaseYear,
    };
  }, [movieDetails]);

  const links = useMemo(() => {
    const subtitleLink = `http://subtitlestar.com/go-to.php?imdb-id=${movieDetails.imdb_id}&movie-name=${linkGenerationData.encodedTitle}`;
    const serverBaseUrls = [
      'https://berlin.saymyname.website',
      'https://tokyo.saymyname.website',
      'https://nairobi.saymyname.website',
    ];
    const downloadPath = `/Movies/${linkGenerationData.releaseYear}/${linkGenerationData.imdbShort}`;

    const downloadLinks = serverBaseUrls.map((url) => {
      return `${url}${downloadPath}`;
    });

    return { downloadLinks, subtitleLink };
  }, [
    linkGenerationData.encodedTitle,
    linkGenerationData.imdbShort,
    linkGenerationData.releaseYear,
    movieDetails.imdb_id,
  ]);

  const moviePath = useMemo(() => {
    const path = slugify(`${englishTitle}`);
    return `https://almasmovie.website/film/${path}-${movieDetails?.release_date.split('-')[0]}`;
  }, [englishTitle, movieDetails?.release_date]);

  const { data: movieLinks, loading } = useAlmasMovieData(moviePath);

  return (
    <div>
      <Badge>لینک های دانلود (الماس مووی)</Badge>
      <div
        className={cn('mt-2 grid w-full grid-cols-1 gap-4', {
          'xl:grid-cols-3': !movieLinks?.result?.length,
        })}
      >
        <Switch value={loading}>
          <Case value>
            <For each={[1, 2, 3]}>
              {(link) => {
                return (
                  <Skeleton
                    className="h-11 w-full"
                    key={`download-link-loading-${link}`}
                  />
                );
              }}
            </For>
          </Case>
          <Default>
            <Switch value={!!movieLinks?.result?.length}>
              <Case value>
                <For each={movieLinks?.result as MovieQuality[]}>
                  {(link) => {
                    return (
                      <Accordion
                        collapsible
                        key={`download-link-${link.downloadLink}`}
                        type="single"
                      >
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="flex h-11 w-full items-center justify-between border bg-secondary px-2 data-[state=open]:!rounded-b-none">
                            <div className="flex items-center gap-x-3">
                              <span>
                                کیفیت: {link.info?.quality.fa} (
                                {link.info?.quality.en})
                              </span>
                              <Show on={link.info?.x265}>
                                {() => {
                                  return <Badge>x265</Badge>;
                                }}
                              </Show>
                              <Show on={link.info?.dubbed}>
                                {() => {
                                  return <Badge>دوبله فارسی</Badge>;
                                }}
                              </Show>
                              <Show on={link.info?.encoder !== 'نامشخص'}>
                                {() => {
                                  return (
                                    <Badge>انکودر: {link.info?.encoder}</Badge>
                                  );
                                }}
                              </Show>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent
                            asChild
                            className="rounded-xl !rounded-t-none border !border-t-0 bg-secondary p-2"
                            key={`download-link-${link.downloadLink}`}
                          >
                            <div className="grid grid-cols-2 gap-x-2">
                              <Button asChild className="h-11 w-full" size="lg">
                                <Link
                                  target="_blank"
                                  to={link.downloadLink || ''}
                                >
                                  <DownloadCloudIcon />
                                  دانلود از با کیفیت {link.info?.quality.fa}
                                </Link>
                              </Button>
                              <Button asChild className="h-11 w-full" size="lg">
                                <Link
                                  target="_blank"
                                  to={link.subtitleLink || ''}
                                >
                                  <TextQuoteIcon />
                                  زیرنویس این کیفیت{' '}
                                </Link>
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }}
                </For>
              </Case>
              <Default>
                <For each={links.downloadLinks}>
                  {(link, linkIndex) => {
                    return (
                      <Button
                        asChild
                        className="h-11 w-full"
                        key={`download-link-${link}`}
                        size="lg"
                        variant={linkIndex === 0 ? 'default' : 'destructive'}
                      >
                        <Link target="_blank" to={link}>
                          <DownloadCloudIcon />
                          دانلود از سرور{' '}
                          {linkIndex === 0 ? 'اصلی' : `کمکی ${linkIndex}`}
                        </Link>
                      </Button>
                    );
                  }}
                </For>
                <Button
                  asChild
                  className="mt-4 h-11 w-full xl:col-span-3"
                  size="lg"
                  variant="secondary"
                >
                  <Link target="_blank" to={links.subtitleLink}>
                    <DownloadCloudIcon />
                    دانلود زیرنویس
                  </Link>
                </Button>
              </Default>
            </Switch>
          </Default>
        </Switch>
      </div>

      <div className="mt-4 w-full rounded-2xl border border-destructive bg-destructive/15 p-4 text-justify text-sm/relaxed text-destructive">
        این وب‌سایت تنها به‌عنوان مرجع اطلاعات فیلم و سریال فعالیت می‌کند و
        هیچ‌گونه فایل یا محتوایی را روی سرورهای خود میزبانی نمی‌کند. اطلاعات از
        APIهای عمومی جمع‌آوری شده و لینک‌های دانلود صرفاً از وب‌سایت الماس مووی
        نمایش داده می‌شوند. ما هیچ دخالتی در ایجاد یا مدیریت این لینک‌ها نداریم
        و مسئولیتی در قبال سالم بودن، فعال بودن یا ایمن بودن آن‌ها نمی‌پذیریم.
        استفاده از لینک‌ها کاملاً بر عهده کاربر است و ممکن است برخی از آن‌ها در
        هر زمان از دسترس خارج شوند. این وب‌سایت هیچ وابستگی رسمی به استودیوها یا
        ناشران ندارد و داده‌ها صرفاً برای اطلاع‌رسانی ارائه می‌شوند. با ادامه
        استفاده از سایت، شما شرایط و ضوابط ما را می‌پذیرید. برای جزئیات بیشتر
        لطفاً به صفحه «سلب مسئولیت» مراجعه کنید.
      </div>
    </div>
  );
};
