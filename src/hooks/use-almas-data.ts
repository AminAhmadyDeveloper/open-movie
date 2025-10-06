import { useCallback, useEffect, useRef, useState } from 'react';

export type AlmasResult = {
  result: MovieQuality[] | null | Season[];
  type: AlmasType;
};

export type AlmasType = 'movie' | 'tvshow';

export type MovieQuality = {
  downloadLink?: null | string;
  info?: ReturnType<typeof detectMovieOrTVShowInfo>;
  quality: string;
  size?: null | string;
  subtitleLink?: null | string;
};

export type Season = {
  qualities: MovieQuality[];
  season: number;
};

const CORS_PROXY = 'https://corsproxy.io/?';
const DEFAULT_TIMEOUT_MS = 15_000;

export function useAlmasMovieData(url: string) {
  const [data, setData] = useState<AlmasResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const abortReference = useRef<AbortController | null>(null);
  const safeSetState = useRef(true);

  useEffect(() => {
    safeSetState.current = true;
    return () => {
      safeSetState.current = false;
      abortReference.current?.abort();
    };
  }, []);

  const fetchHtml = useCallback(
    async (
      targetUrl: string,
      options?: { body?: string; method?: 'GET' | 'POST'; timeoutMs?: number },
    ) => {
      const controller = new AbortController();
      abortReference.current = controller;
      const signal = controller.signal;

      const timeout = setTimeout(
        () => controller.abort(),
        options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      );

      try {
        const response = await fetch(
          CORS_PROXY + encodeURIComponent(targetUrl),
          {
            body: options?.body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: options?.method ?? 'GET',
            signal,
          },
        );
        if (!response.ok)
          throw new Error(`${response.status} ${response.statusText}`);
        return await response.text();
      } finally {
        clearTimeout(timeout);
      }
    },
    [],
  );

  const fetchData = useCallback(
    async (signalUrl?: string) => {
      if (!signalUrl) return;
      setLoading(true);
      setError(null);
      try {
        const pageHtml = await fetchHtml(signalUrl, { method: 'GET' });
        if (!pageHtml) throw new Error('Failed to fetch page HTML');

        const extracted = parseJsonInfoFromHtml(pageHtml);
        if (!extracted)
          throw new Error('Could not extract JSON info from page');

        const postBody = `action=getPostLinksAjax&id=${encodeURIComponent(
          extracted.id,
        )}&posttype=${encodeURIComponent(extracted.type)}`;
        const downloadPageHtml = await fetchHtml(
          'https://almasmovie.website/wp-admin/admin-ajax.php',
          {
            body: postBody,
            method: 'POST',
          },
        );
        if (!downloadPageHtml) throw new Error('Failed to fetch download HTML');

        const result =
          extracted.type === 'tvshow'
            ? extractSeries(downloadPageHtml)
            : extractMovie(downloadPageHtml);

        if (safeSetState.current) setData({ result, type: extracted.type });
      } catch (error_) {
        if ((error_ as Error).name === 'AbortError') return;
        if (safeSetState.current) {
          setError((error_ as Error).message || 'Unknown error');
        }
      } finally {
        if (safeSetState.current) setLoading(false);
      }
    },
    [fetchHtml],
  );

  useEffect(() => {
    if (!url) return;
    abortReference.current?.abort();
    fetchData(url);
  }, [url, fetchData]);

  const refetch = useCallback(() => {
    if (!url) return;
    abortReference.current?.abort();
    fetchData(url);
  }, [url, fetchData]);

  return { data, error, loading, refetch } as const;
}

function detectAudio(filename: string) {
  const lower = filename.toLowerCase();
  if (
    lower.includes('5.1') ||
    lower.includes('aac5.1') ||
    lower.includes('5ch')
  )
    return { en: '5.1 Channels', fa: '۵.۱ کانال' };
  if (
    lower.includes('7.1') ||
    lower.includes('aac7.1') ||
    lower.includes('7ch')
  )
    return { en: '7.1 Channels', fa: '۷.۱ کانال' };
  if (
    lower.includes('6ch') ||
    lower.includes('aac6.0') ||
    lower.includes('6ch')
  )
    return { en: '6 Channels', fa: '۶ کانال' };
  if (
    lower.includes('2.0') ||
    lower.includes('aac2.0') ||
    lower.includes('2ch')
  )
    return { en: '2 Channels', fa: '۲ کانال' };
  if (lower.includes('stereo')) return { en: 'Stereo', fa: 'استریو' };
  if (lower.includes('aac')) return { en: 'AAC Audio', fa: 'صدای AAC' };
  if (lower.includes('dts')) return { en: 'DTS Audio', fa: 'صدای DTS' };
  if (lower.includes('truehd'))
    return { en: 'Dolby TrueHD', fa: 'دالبی TrueHD' };
  if (lower.includes('atmos')) return { en: 'Dolby Atmos', fa: 'دالبی اتموس' };
  return { en: 'Unknown', fa: 'نامشخص' };
}

function detectEncoder(filename: string) {
  const knownEncoders = [
    'ganool',
    'pahe',
    'tigole',
    'yify',
    'rarbg',
    'ettv',
    'shaanig',
    'anoXmous',
    'juggs',
    'nimitmak',
  ];
  const lower = filename.toLowerCase();
  for (const enc of knownEncoders) {
    if (lower.includes(enc)) return enc;
  }
  return 'نامشخص';
}

function detectMovieOrTVShowInfo(filename: string) {
  const lower = filename.toLowerCase();

  let qualityEn = 'Unknown',
    qualityFa = 'نامشخص';
  if (lower.includes('2160p') || lower.includes('4k')) {
    qualityEn = '4K';
    qualityFa = '۴کی';
  } else if (lower.includes('1440p') || lower.includes('2k')) {
    qualityEn = '2K';
    qualityFa = '۲کی';
  } else if (lower.includes('1080p')) {
    qualityEn = '1080p';
    qualityFa = '۱۰۸۰p';
  } else if (lower.includes('720p')) {
    qualityEn = '720p';
    qualityFa = '۷۲۰p';
  } else if (lower.includes('480p')) {
    qualityEn = '480p';
    qualityFa = '۴۸۰p';
  } else if (lower.includes('360p')) {
    qualityEn = '360p';
    qualityFa = '۳۶۰p';
  } else if (lower.includes('240p')) {
    qualityEn = '240p';
    qualityFa = '۲۴۰p';
  }

  let sourceEn = 'Unknown',
    sourceFa = 'نامشخص';
  if (lower.includes('bluray')) {
    sourceEn = 'BluRay';
    sourceFa = 'بلوری';
  } else if (lower.includes('brrip')) {
    sourceEn = 'BRRip';
    sourceFa = 'بی‌ریپ';
  } else if (lower.includes('webrip')) {
    sourceEn = 'WEBRip';
    sourceFa = 'وب‌ریپ';
  } else if (lower.includes('web-dl') || lower.includes('webdl')) {
    sourceEn = 'WEB-DL';
    sourceFa = 'وب-دی‌ال';
  } else if (lower.includes('hdrip')) {
    sourceEn = 'HDRip';
    sourceFa = 'اچ‌دی‌ریپ';
  } else if (lower.includes('dvdrip')) {
    sourceEn = 'DVDRip';
    sourceFa = 'دی‌وی‌دی‌ریپ';
  } else if (lower.includes('cam')) {
    sourceEn = 'CAM';
    sourceFa = 'کَم (دوربینی)';
  }

  const dubbed =
    lower.includes('dubbed') ||
    lower.includes('dual audio') ||
    lower.includes('dual-audio') ||
    lower.includes('farsi') ||
    lower.includes('persian');

  return {
    audio: detectAudio(filename),
    bit10: lower.includes('10bit'),
    dubbed,
    encoder: detectEncoder(filename),
    imax: lower.includes('imax'),
    quality: { en: qualityEn, fa: qualityFa },
    source: { en: sourceEn, fa: sourceFa },
    x265: lower.includes('x265') || lower.includes('hevc'),
  };
}

function enrichQualityWithInfo(quality: MovieQuality): MovieQuality {
  const filename = quality.downloadLink || '';
  return {
    ...quality,
    info: detectMovieOrTVShowInfo(filename),
  };
}

function extractMovie(downloadHtml: string): MovieQuality[] {
  const qualities: MovieQuality[] = [];
  if (!downloadHtml) return qualities;

  const document_ = new DOMParser().parseFromString(downloadHtml, 'text/html');
  const headings: Element[] = [...document_.querySelectorAll('h3')].filter(
    (h) => /(HD|4K|480|720|1080|کیفیت)/i.test(h.textContent || ''),
  );

  if (headings.length > 0) {
    for (const h of headings) {
      const qualitySize = (h.textContent || '').trim();
      const [quality, size] = qualitySize.split(/\s\/\s/).map((s) => s.trim());
      const nextDiv = h.nextElementSibling;
      const links: string[] = [];
      if (nextDiv) {
        const anchors = [...nextDiv.querySelectorAll('a')].filter((a) =>
          /(دانلود فیلم با این کیفیت|دانلود زیرنویس فارسی این کیفیت)/.test(
            a.textContent || '',
          ),
        );
        for (const a of anchors) links.push(a.getAttribute('href') || '');
      }

      qualities.push(
        enrichQualityWithInfo({
          downloadLink: links[0] || null,
          quality: quality || 'unknown',
          size: size || null,
          subtitleLink: links[1] || null,
        }),
      );
    }
  } else {
    const qualityRegex =
      /<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/g;
    const linkRegex =
      /<a[^>]*href="([^"]+)"[^>]*>(?:دانلود فیلم با این کیفیت|دانلود زیرنویس فارسی این کیفیت)<\/a>/g;
    let qm: null | RegExpExecArray;
    while ((qm = qualityRegex.exec(downloadHtml))) {
      const qualitySize = qm[1].replaceAll(/<[^>]+>/g, '').trim();
      const [quality, size] = qualitySize.split(/\s\/\s/).map((s) => s.trim());
      const divContent = qm[2];
      const links: string[] = [];
      let lm: null | RegExpExecArray;
      linkRegex.lastIndex = 0;
      while ((lm = linkRegex.exec(divContent))) links.push(lm[1]);
      qualities.push(
        enrichQualityWithInfo({
          downloadLink: links[0] || null,
          quality: quality || 'unknown',
          size: size || null,
          subtitleLink: links[1] || null,
        }),
      );
    }
  }

  return qualities;
}

function extractSeries(downloadHtml: string): Season[] {
  const seasons: Season[] = [];
  if (!downloadHtml) return seasons;

  const document_ = new DOMParser().parseFromString(downloadHtml, 'text/html');
  const headings: Element[] = [...document_.querySelectorAll('h3')].filter(
    (h) => /دانلود فصل\s*\d+/i.test(h.textContent || ''),
  );

  for (let index = 0; index < headings.length; index++) {
    const h = headings[index];
    const match = (h.textContent || '').match(/(\d+)/);
    const seasonNumber = match ? Number(match[1]) : index + 1;
    const containerElements: Element[] = [];

    for (let sib = h.nextElementSibling; sib; sib = sib.nextElementSibling) {
      if (headings.includes(sib)) break;
      containerElements.push(sib);
    }

    const htmlSegment = containerElements
      .map((element) => element.outerHTML)
      .join('\n');

    const buttonRegex =
      /<button[^>]*>([\s\S]*?)<\/button>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*title="لینک های دانلود"[\s\S]*?<a[^>]*href="([^"]+)"[^>]*title="زیرنویس ها"/g;
    const qualities: MovieQuality[] = [];
    let bm: null | RegExpExecArray;
    while ((bm = buttonRegex.exec(htmlSegment))) {
      const qualitySize = (bm[1] || '').trim().replaceAll(/<[^>]+>/g, '');
      const [quality, size] = qualitySize.split(/\s\/\s/).map((s) => s.trim());
      qualities.push(
        enrichQualityWithInfo({
          downloadLink: bm[2] || null,
          quality: quality || 'unknown',
          size: size || null,
          subtitleLink: bm[3] || null,
        }),
      );
    }

    seasons.push({ qualities, season: seasonNumber });
  }

  return seasons;
}

function parseJsonInfoFromHtml(html: string) {
  if (!html) return null;
  try {
    const document_ = new DOMParser().parseFromString(html, 'text/html');
    const link = [...document_.querySelectorAll('link[rel]')].find((l) => {
      const relative = (l.getAttribute('rel') || '').toLowerCase();
      const type = (l.getAttribute('type') || '').toLowerCase();
      const title = (l.getAttribute('title') || '').toLowerCase();
      return (
        relative === 'alternate' &&
        type === 'application/json' &&
        title === 'json'
      );
    });

    if (!link) return null;
    const href = link.getAttribute('href') || '';
    const idMatch = href.match(/\/(\d+)(?=([\/\?#]|$))/);
    if (!idMatch) return null;
    const id = idMatch[1];
    const type: AlmasType = href.includes('/series/') ? 'tvshow' : 'movie';
    return { id, type };
  } catch {
    return null;
  }
}
