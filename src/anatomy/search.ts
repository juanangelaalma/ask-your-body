import type {Atlas, Concept} from '@/atlas/anatomy';
import {atlasIndex} from './atlas-index';
import {normalizeTerm} from './text';

/**
 * Lexical anatomy search. Exact name first, then prefix, then substring, shortest name
 * winning ties, matching the retrieval strategy scoped for the MVP.
 */
export function searchConcepts(atlas: Atlas | null, query: string, limit = 12): Concept[] {
  if (!atlas) return [];
  const normalized = normalizeTerm(query);
  if (!normalized) return [];
  const {exact, byBrevity} = atlasIndex(atlas);

  const direct = exact.get(normalized);
  const prefix: Concept[] = [];
  const contains: Concept[] = [];
  for (const concept of byBrevity) {
    const name = normalizeTerm(concept.name);
    if (name === normalized) continue;
    if (name.startsWith(normalized)) prefix.push(concept);
    else if (name.includes(normalized)) contains.push(concept);
  }

  const ordered = [...(direct ? [direct] : []), ...prefix, ...contains];
  return ordered.slice(0, limit);
}
