import {describe, expect, it} from 'vitest';
import {loadAtlas} from '@/testing/atlas';
import {resolveStructure} from './resolver';
import {searchConcepts} from './search';

const atlas = loadAtlas();

describe('resolveStructure', () => {
  it('resolves a registry key to its atlas concept', () => {
    const heart = resolveStructure(atlas, 'heart');
    expect(heart?.conceptId).toBe('FMA7088');
    expect(heart?.name).toBe('Heart');
    expect(heart?.partIds.length).toBeGreaterThan(0);
  });

  it('resolves Indonesian aliases', () => {
    expect(resolveStructure(atlas, 'jantung')?.key).toBe('heart');
    expect(resolveStructure(atlas, 'paru-paru')?.key).toBe('lungs');
    expect(resolveStructure(atlas, 'otak')?.key).toBe('brain');
  });

  it('unions every concept behind a multi-concept entry', () => {
    const lungs = resolveStructure(atlas, 'lungs');
    expect(lungs?.partIds.length).toBeGreaterThan(100);
  });

  it('accepts a concept id directly, so a planner that speaks ids still resolves', () => {
    expect(resolveStructure(atlas, 'FMA7088')?.conceptId).toBe('FMA7088');
  });

  it('falls back to a catalogue name that is not in the registry', () => {
    const structure = resolveStructure(atlas, 'pineal body');
    expect(structure?.conceptId).toBe('FMA62033');
    expect(structure?.name).toBe('pineal body');
  });

  it('returns null instead of inventing a structure', () => {
    expect(resolveStructure(atlas, 'quantum flux capacitor')).toBeNull();
    expect(resolveStructure(atlas, '')).toBeNull();
  });

  it('every registry entry resolves against the shipped catalogue', () => {
    const missing: string[] = [];
    for (const key of [
      'heart', 'lungs', 'trachea', 'bronchus', 'larynx', 'nose', 'diaphragm', 'mouth', 'tongue',
      'esophagus', 'stomach', 'small_intestine', 'large_intestine', 'liver', 'pancreas', 'spleen',
      'kidneys', 'bladder', 'brain', 'hypothalamus', 'brainstem', 'spinal_cord', 'nerves',
      'pituitary', 'pineal', 'adrenal', 'thymus', 'skull', 'ribs', 'spine', 'pelvis', 'femur',
      'tibia', 'humerus', 'scapula', 'skeleton', 'muscles', 'quadriceps', 'thigh', 'calf',
      'biceps', 'triceps', 'deltoid', 'aorta', 'arteries', 'veins', 'blood_vessels', 'skin',
      'eye', 'prostate', 'testis',
    ]) {
      if (!resolveStructure(atlas, key)) missing.push(key);
    }
    expect(missing).toEqual([]);
  });
});

describe('searchConcepts', () => {
  it('prefers exact names over longer partial matches', () => {
    expect(searchConcepts(atlas, 'stomach', 1)[0].name).toBe('stomach');
  });

  it('finds structures by partial name', () => {
    const results = searchConcepts(atlas, 'kidney', 5).map((concept) => concept.name.toLowerCase());
    expect(results.some((name) => name.includes('kidney'))).toBe(true);
  });

  it('returns nothing for an empty query', () => {
    expect(searchConcepts(atlas, '  ')).toEqual([]);
  });
});
