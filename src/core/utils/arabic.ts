/**
 * Arabic Text Normalization & Search Utilities
 * Implements section 36 and 76 of Engineering Specification V1
 */

export function normalizeArabicText(text: string): string {
  if (!text) return '';

  return text
    // Remove Tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove Tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alef variants (أ, إ, آ -> ا)
    .replace(/[أإآ]/g, 'ا')
    // Normalize Yeh / Alef Maksura (ى -> ي)
    .replace(/ى/g, 'ي')
    // Normalize Teh Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Remove punctuation & special characters
    .replace(/[،؛؟«»""'']/g, ' ')
    // Collapse whitespaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function searchArabicMatch(query: string, target: string): boolean {
  if (!query || !target) return false;
  const normQuery = normalizeArabicText(query);
  const normTarget = normalizeArabicText(target);
  return normTarget.includes(normQuery);
}

/**
 * Simulates PostgreSQL pg_trgm similarity coefficient for Arabic fuzzy search
 * Matches the PostgreSQL pg_trgm extension used in Supabase
 */
export function calculateTrigramSimilarity(str1: string, str2: string): number {
  const s1 = normalizeArabicText(str1);
  const s2 = normalizeArabicText(str2);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.85;

  const getTrigrams = (str: string): Set<string> => {
    const padded = `  ${str} `;
    const trigrams = new Set<string>();
    for (let i = 0; i < padded.length - 2; i++) {
      trigrams.add(padded.substring(i, i + 3));
    }
    return trigrams;
  };

  const set1 = getTrigrams(s1);
  const set2 = getTrigrams(s2);

  let intersection = 0;
  set1.forEach(tri => {
    if (set2.has(tri)) intersection++;
  });

  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
