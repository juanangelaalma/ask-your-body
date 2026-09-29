/** Lowercase, strip accents, and reduce punctuation to single spaces so lookups are forgiving. */
export function normalizeTerm(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenize(value: string): string[] {
  const normalized = normalizeTerm(value);
  return normalized ? normalized.split(' ') : [];
}
