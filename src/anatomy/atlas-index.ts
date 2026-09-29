import type {Atlas, Concept, SystemId} from '@/atlas/anatomy';
import {normalizeTerm} from './text';

interface AtlasIndex {
  /** Concept id to concept, so a planner that already speaks concept ids resolves directly. */
  byId: Map<string, Concept>;
  /** Normalized concept name to concept. First writer wins, so the general concept is kept. */
  exact: Map<string, Concept>;
  /** Every concept, short names first, so a lookup prefers "stomach" over "wall of stomach". */
  byBrevity: Concept[];
  /** Normalized concept name to concept, for substring scans. */
  searchable: {name: string; concept: Concept}[];
  partSystem: Map<string, SystemId>;
}

const cache = new WeakMap<Atlas, AtlasIndex>();

export function atlasIndex(atlas: Atlas): AtlasIndex {
  let index = cache.get(atlas);
  if (!index) {
    const byId = new Map<string, Concept>();
    const exact = new Map<string, Concept>();
    const searchable: {name: string; concept: Concept}[] = [];
    for (const concept of atlas.concepts) {
      byId.set(concept.id, concept);
      const name = normalizeTerm(concept.name);
      if (!exact.has(name)) exact.set(name, concept);
      searchable.push({name, concept});
    }
    const partSystem = new Map<string, SystemId>();
    for (const part of atlas.parts) partSystem.set(part.id, part.system);
    index = {
      byId,
      exact,
      byBrevity: [...atlas.concepts].sort((a, b) => a.name.length - b.name.length),
      searchable,
      partSystem,
    };
    cache.set(atlas, index);
  }
  return index;
}

export function conceptById(atlas: Atlas, conceptId: string): Concept | undefined {
  return atlas.concepts.find((concept) => concept.id === conceptId);
}

export function partIdsForConcept(atlas: Atlas, conceptId: string): string[] {
  return conceptById(atlas, conceptId)?.elements ?? [];
}
