/** Convert a heading title to a URL-safe anchor id. */
export function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w]+/g, '-');
}
