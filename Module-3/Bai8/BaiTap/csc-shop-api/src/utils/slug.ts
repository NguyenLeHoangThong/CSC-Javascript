// Turn a product/category title into a URL-friendly slug.
// "Galaxy S24 Ultra!" -> "galaxy-s24-ultra"
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD') // split accented chars into base + diacritic
    .replace(/[̀-ͯ]/g, '') // strip diacritics (cà phê -> ca phe)
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric -> dash
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}
