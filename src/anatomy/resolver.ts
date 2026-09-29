import type {Atlas, Concept, SystemId} from '@/atlas/anatomy';
import {atlasIndex} from './atlas-index';
import {REGISTRY, type RegistryEntry} from './registry';
import {normalizeTerm} from './text';

export interface ResolvedConcept {
  conceptId: string;
  name: string;
}

export interface ResolvedStructure {
  key: string;
  /** Primary concept, used when only one identifier fits. */
  conceptId: string;
  /** Every concept behind the entry, so "lungs" keeps both lungs. */
  conceptIds: string[];
  name: string;
  system: SystemId;
  partIds: string[];
  concepts: ResolvedConcept[];
}

const aliasIndex = new Map<string, RegistryEntry>();
for (const entry of REGISTRY) {
  aliasIndex.set(normalizeTerm(entry.key), entry);
  for (const alias of entry.aliases) aliasIndex.set(normalizeTerm(alias), entry);
}

export function findRegistryEntry(term: string): RegistryEntry | undefined {
  return aliasIndex.get(normalizeTerm(term));
}

function conceptsFromEntry(atlas: Atlas, entry: RegistryEntry): Concept[] {
  const {exact, byBrevity} = atlasIndex(atlas);
  const found: Concept[] = [];
  for (const name of entry.concepts) {
    const normalized = normalizeTerm(name);
    const hit =
      exact.get(normalized) ??
      byBrevity.find((concept) => normalizeTerm(concept.name).includes(normalized));
    if (hit && !found.some((concept) => concept.id === hit.id)) found.push(hit);
  }
  return found;
}

/**
 * `strict` matches whole words or prefixes only, which keeps a stray token like "tell"
 * from landing on "patella" when a question is not in the curated set.
 */
function conceptsFromName(atlas: Atlas, term: string, strict: boolean): Concept[] {
  const {exact, byId, byBrevity, searchable} = atlasIndex(atlas);
  const normalized = normalizeTerm(term);
  const direct = exact.get(normalized) ?? byId.get(term.trim());
  if (direct) return [direct];
  if (!normalized) return [];

  if (strict) {
    const hit = byBrevity.find((concept) => {
      const name = normalizeTerm(concept.name);
      return name.startsWith(normalized) || name.split(' ').includes(normalized);
    });
    return hit ? [hit] : [];
  }

  const partial = searchable.filter((item) => item.name.includes(normalized));
  return partial.length ? [partial[0].concept] : [];
}

/**
 * Grounds a free-text or registry term against the atlas. Returns null rather than
 * inventing an identifier, so callers can skip the visual action and keep the narration.
 */
export function resolveStructure(
  atlas: Atlas | null,
  term: string,
  options: {strict?: boolean} = {},
): ResolvedStructure | null {
  if (!atlas || !term.trim()) return null;

  const entry = options.strict ? findRegistryEntry(term) : undefined;
  const concepts = entry
    ? conceptsFromEntry(atlas, entry)
    : options.strict
      ? conceptsFromName(atlas, term, true)
      : findRegistryEntry(term)
        ? conceptsFromEntry(atlas, findRegistryEntry(term)!)
        : conceptsFromName(atlas, term, false);
  if (!concepts.length) return null;

  const partIds = [...new Set(concepts.flatMap((concept) => concept.elements))];
  if (!partIds.length) return null;

  const primary = concepts[0];
  const registryEntry = entry ?? findRegistryEntry(term);
  return {
    key: registryEntry?.key ?? primary.id,
    conceptId: primary.id,
    conceptIds: concepts.map((concept) => concept.id),
    name: registryEntry?.name ?? primary.name,
    system: registryEntry?.system ?? atlasIndex(atlas).partSystem.get(partIds[0]) ?? 'connective',
    partIds,
    // A group keeps each concept's own name, so "lungs" lists the right and left lung rather
    // than the same label twice. A single concept takes the friendlier registry name.
    concepts: concepts.map((concept) => ({
      conceptId: concept.id,
      name: concepts.length === 1 ? (registryEntry?.name ?? concept.name) : concept.name,
    })),
  };
}

export function resolveMany(atlas: Atlas | null, terms: string[]) {
  const resolved: ResolvedStructure[] = [];
  const unresolved: string[] = [];
  const seen = new Set<string>();
  for (const term of terms) {
    const structure = resolveStructure(atlas, term);
    if (!structure) {
      unresolved.push(term);
      continue;
    }
    if (seen.has(structure.key)) continue;
    seen.add(structure.key);
    resolved.push(structure);
  }
  return {resolved, unresolved};
}
