/**
 * Normalize candy name for grouping variants
 * Examples:
 * - "M&M's" → "mms"
 * - "M&Ms" → "mms"
 * - "Kit Kat" → "kitkat"
 * - "Snickers" → "snickers"
 */
export function normalizeCandyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
    .trim();
}

/**
 * Get the most common original spelling from a list of variants
 */
export function getMostCommonSpelling(names: string[]): string {
  const counts = new Map<string, number>();

  for (const name of names) {
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  let maxCount = 0;
  let mostCommon = names[0] || '';

  for (const [name, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = name;
    }
  }

  return mostCommon;
}
