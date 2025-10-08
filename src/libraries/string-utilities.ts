export const formatPrice = (
  price: number,
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale).format(price);
};

export function slugify(input: string): string {
  return input
    .toLowerCase() // make lowercase
    .replaceAll(/[^\w\s.]/g, '') // remove special chars except dots and spaces
    .replaceAll('.', '-') // replace dots with dashes
    .replaceAll(/\s+/g, '-') // replace spaces with dashes
    .replaceAll(/-+/g, '-') // collapse multiple dashes
    .replaceAll(/^-|-$/g, ''); // trim leading/trailing dashes
}

export const proxiedUrl = (path: string, params = {}) => {
  const url = new URL(import.meta.env.VITE_PUBLIC_TMDB_API_BASE_URL + path);

  url.searchParams.set('api_key', import.meta.env.VITE_PUBLIC_TMDB_API_KEY);

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v as string);
  }

  const proxied = 'https://corsproxy.io/?' + encodeURIComponent(url.toString());

  return proxied;
};
