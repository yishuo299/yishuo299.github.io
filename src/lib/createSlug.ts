// Adapted from https://equk.co.uk/2023/02/02/generating-slug-from-title-in-astro/

import { GENERATE_SLUG_FROM_TITLE } from '../config'

export default function (title: string, staticSlug: string) {
  if (!GENERATE_SLUG_FROM_TITLE) return staticSlug;

  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    // Keep Unicode letters/numbers so Chinese titles produce valid slugs.
    .replace(/[^\p{L}\p{N}_-]/gu, '')
    .replace(/^-+|-+$/g, '');

  // A title made only of punctuation should still have a stable route.
  return slug || staticSlug;
}
