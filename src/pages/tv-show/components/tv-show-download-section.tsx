import { DownloadCloudIcon } from 'lucide-react';
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
import { type Season, useAlmasMovieData } from '@/hooks/use-almas-data';
import { slugify } from '@/libraries/string-utilities';
import type { TvShowDetailsResponseSchema } from '@/queries/tv';

interface TvShowDownloadSectionProps {
  tvShowDetails: TvShowDetailsResponseSchema;
}

export const TvShowDownloadSection: FC<TvShowDownloadSectionProps> = ({
  tvShowDetails,
}) => {
  const links = useMemo<{
    imdbId: string;
    seasons: {
      qualities: {
        link: string;
        quality: number;
      }[];
      season: number;
    }[];
    success: true;
  }>(() => {
    if (
      !tvShowDetails.external_ids.imdb_id ||
      tvShowDetails.seasons.length === 0
    ) {
      console.warn(
        'Cannot generate download links: Missing IMDb ID or number of seasons.',
      );
      return {
        message: 'لینک‌های دانلود در حال حاضر در دسترس نیستند.',
        success: false,
      };
    }

    const result = {
      imdbId: tvShowDetails.external_ids.imdb_id,
      seasons: [],
      success: true,
    } as {
      imdbId: string;
      seasons: {
        qualities: {
          link: string;
          quality: number;
        }[];
        season: number;
      }[];
      success: true;
    };

    for (let season = 1; season <= tvShowDetails.seasons.length; season++) {
      const qualities: {
        link: string;
        quality: number;
      }[] = [];

      for (let quality = 1; quality <= 4; quality++) {
        qualities.push({
          link: `https://subtitle.saymyname.website/DL/filmgir/?i=${tvShowDetails.external_ids.imdb_id}&f=${season}&q=${quality}`,
          quality,
        });
      }

      result.seasons.push({
        qualities,
        season,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
  }, [tvShowDetails.external_ids.imdb_id, tvShowDetails.seasons.length]);

  const moviePath = useMemo(() => {
    const path = slugify(`${tvShowDetails?.original_name}`);
    return `https://almasmovie.website/series/${path}`;
  }, [tvShowDetails?.original_name]);

  const { data: movieLinks, loading } = useAlmasMovieData(moviePath);

  return (
    <div>
      <Badge>لینک های دانلود (الماس مووی)</Badge>
      <div className="mt-2 grid w-full grid-cols-1 gap-4">
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
                <For each={movieLinks?.result as Season[]}>
                  {(link) => {
                    return (
                      <Accordion
                        collapsible
                        key={`download-link-trigger-${link.season}`}
                        type="single"
                      >
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="flex h-11 w-full items-center justify-between border bg-secondary px-2 data-[state=open]:!rounded-b-none">
                            <div className="flex items-center gap-x-3">
                              <span>فصل {link.season}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent
                            asChild
                            className="rounded-xl !rounded-t-none border !border-t-0 bg-secondary p-2"
                            key={`download-link-content-${link.season}`}
                          >
                            <div className="grid gap-2 xl:grid-cols-2">
                              <For each={link.qualities}>
                                {(quality) => {
                                  return (
                                    <Button
                                      asChild
                                      className="h-11 w-full"
                                      size="lg"
                                    >
                                      <Link
                                        target="_blank"
                                        to={quality.downloadLink || ''}
                                      >
                                        <DownloadCloudIcon />
                                        برو به دانلود {quality.info?.quality.fa}
                                        <Show on={quality.info?.x265}>
                                          {() => {
                                            return (
                                              <Badge variant="secondary">
                                                x265
                                              </Badge>
                                            );
                                          }}
                                        </Show>
                                        <Show on={quality.info?.dubbed}>
                                          {() => {
                                            return (
                                              <Badge variant="secondary">
                                                دوبله فارسی
                                              </Badge>
                                            );
                                          }}
                                        </Show>
                                        <Show
                                          on={
                                            quality.info?.encoder !== 'نامشخص'
                                          }
                                        >
                                          {() => {
                                            return (
                                              <Badge variant="secondary">
                                                انکودر: {quality.info?.encoder}
                                              </Badge>
                                            );
                                          }}
                                        </Show>
                                      </Link>
                                    </Button>
                                  );
                                }}
                              </For>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  }}
                </For>
              </Case>
              <Default>
                <For each={links.seasons}>
                  {(season, seasonIndex) => {
                    return (
                      <div
                        className="relative mt-5 grid w-full grid-cols-2 gap-2 rounded-xl border border-dashed p-4 xl:grid-cols-4"
                        key={season.season}
                      >
                        <Badge className="absolute -top-3 right-0">
                          فصل {seasonIndex + 1}
                        </Badge>
                        <For each={season.qualities}>
                          {(quality, qualityIndex) => {
                            return (
                              <Button
                                asChild
                                className="h-11 w-full"
                                key={quality.link}
                                size="lg"
                              >
                                <Link target="_blank" to={quality.link}>
                                  <DownloadCloudIcon />
                                  کیفیت {qualityIndex + 1}
                                </Link>
                              </Button>
                            );
                          }}
                        </For>
                      </div>
                    );
                  }}
                </For>
              </Default>
            </Switch>
          </Default>
        </Switch>
      </div>
      <Button
        asChild
        className="mt-4 h-11 w-full"
        size="lg"
        variant="secondary"
      >
        {/* <Link target="_blank" to={links.subtitleLink}>
          <DownloadCloudIcon />
          دانلود زیرنویس
        </Link> */}
      </Button>
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
