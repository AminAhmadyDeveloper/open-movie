import { useQueries } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { ScreenLoading } from '@/components/ui/screen-loading';
import { Show } from '@/components/utilities/show';
import { TvShowDownloadSection } from '@/pages/tv-show/components/tv-show-download-section';
import { TvShowHeroSection } from '@/pages/tv-show/components/tv-show-hero-section';
import { TvShowInformation } from '@/pages/tv-show/components/tv-show-information';
import { queries } from '@/queries';

const TVShowPage = () => {
  const { tvShowId } = useParams<{ tvShowId: string }>();

  const [tvShowDetailsQuery, tvShowEnglishDetailsQuery] = useQueries({
    queries: [
      {
        ...queries.tv['details'](tvShowId, 'fa'),
        enabled: !!tvShowId,
      },
      {
        ...queries.tv['details'](tvShowId, 'en'),
        enabled: !!tvShowId,
      },
    ],
  });

  if (tvShowDetailsQuery.isFetching || tvShowEnglishDetailsQuery.isFetching) {
    return <ScreenLoading />;
  }

  return (
    <main>
      <Show on={tvShowDetailsQuery.data}>
        {(tvShowDetails) => {
          return <TvShowHeroSection tvShowDetails={tvShowDetails} />;
        }}
      </Show>
      <div className="relative container -mt-24 grid grid-cols-1 pt-5 md:mt-0 md:grid-cols-2 xl:grid-cols-5">
        <div className="p-4 md:col-span-1 xl:col-span-3">
          <Show on={tvShowDetailsQuery.data}>
            {(tvShowDetails) => {
              return (
                <TvShowDownloadSection
                  englishName={tvShowEnglishDetailsQuery.data?.name}
                  tvShowDetails={tvShowDetails}
                />
              );
            }}
          </Show>
        </div>
        <div className="p-4 md:col-span-1 xl:col-span-2">
          <Show on={tvShowDetailsQuery.data}>
            {(tvShowDetails) => {
              return <TvShowInformation tvShowDetails={tvShowDetails} />;
            }}
          </Show>
        </div>
      </div>
    </main>
  );
};

export default TVShowPage;
