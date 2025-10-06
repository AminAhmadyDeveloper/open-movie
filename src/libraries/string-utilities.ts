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
