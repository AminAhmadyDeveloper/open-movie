export const formatPrice = (
  price: number,
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale).format(price);
};
