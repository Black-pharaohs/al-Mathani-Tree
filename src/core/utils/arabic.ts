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
