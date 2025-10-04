import { DownloadCloudIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { For } from '@/components/utilities/for';
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

  return (
    <div>
      <Badge>لینک های دانلود (الماس مووی)</Badge>
      <div className="mt-2">
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
                        variant={seasonIndex === 0 ? 'default' : 'destructive'}
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
