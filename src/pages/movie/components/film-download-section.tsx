import { DownloadCloudIcon } from 'lucide-react';
import { type FC, useMemo } from 'react';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { For } from '@/components/utilities/for';
import type { MovieDetailsResponseSchema } from '@/queries/movies';

interface FilmDownloadSectionProps {
  movieDetails: MovieDetailsResponseSchema;
}

export const FilmDownloadSection: FC<FilmDownloadSectionProps> = ({
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

  return (
    <div>
      <Badge>لینک های دانلود (الماس مووی)</Badge>
      <div className="mt-2 grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
        <For each={links.downloadLinks}>
          {(link, linkIndex) => {
            return (
              <Button
                asChild
                className="h-11 w-full"
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
      </div>
      <Button
        asChild
        className="mt-4 h-11 w-full"
        size="lg"
        variant="secondary"
      >
        <Link target="_blank" to={links.subtitleLink}>
          <DownloadCloudIcon />
          دانلود زیرنویس
        </Link>
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
