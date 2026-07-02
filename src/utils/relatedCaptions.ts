// Curated one-line captions for related-dog recommendations.
// Keyed by (source slug -> target slug). Falls back to city/country when missing.

export const relatedCaptions: Record<string, Record<string, string>> = {
  "seattle-dog": {
    "merguez-dog": "Spiced sausage energy, different continent",
    "mishkaki-hot-dog": "Street-grill cousin from Zanzibar",
    "alaska-reindeer-dog": "Northern oddball with a Pacific pedigree",
  },
};

export function getRelatedCaption(fromSlug: string, toSlug: string): string | null {
  return relatedCaptions[fromSlug]?.[toSlug] ?? null;
}
