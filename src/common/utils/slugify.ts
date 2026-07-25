/**
 * Converts an arbitrary string into a URL-safe slug.
 * Diacritics are stripped so Romanian names produce clean ASCII slugs
 * (e.g. "Crama Gîrboiu" -> "crama-girboiu").
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
