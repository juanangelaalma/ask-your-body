import {describe, expect, it} from 'vitest';
import type {Atlas} from '@/atlas/anatomy';
import {resolveMany, resolveStructure} from '@/anatomy/resolver';
import {loadAtlas} from '@/testing/atlas';
import {CURATED_JOURNEYS} from './journeys';
import {matchCurated, normalizeJourney, planJourney} from './planner';
import {screenQuestion} from '@/safety/medical';

const atlas: Atlas = loadAtlas();

describe('curated journey integrity', () => {
  it('has a journey for each of the ten demo questions', () => {
    const ids = CURATED_JOURNEYS.map((journey) => journey.id);
    expect(ids).toEqual([
      'run', 'breathing', 'circulation', 'eat', 'heart',
      'lungs', 'brain', 'muscle-fatigue', 'hold-breath', 'sleep',
    ]);
  });

  it('resolves 100% of the structures it references', () => {
    const unresolved: string[] = [];
    for (const journey of CURATED_JOURNEYS) {
      for (const scene of journey.scenes) {
        const result = resolveMany(atlas, scene.structures);
        for (const term of result.unresolved) unresolved.push(`${journey.id}/${scene.id}: ${term}`);
      }
    }
    expect(unresolved).toEqual([]);
  });

  it('normalizes every journey in both languages', () => {
    for (const journey of CURATED_JOURNEYS) {
      for (const language of ['en', 'id'] as const) {
        const normalized = normalizeJourney(atlas, journey, language, 'demo');
        expect(normalized, `${journey.id}/${language}`).not.toBeNull();
        expect(normalized!.scenes.length).toBe(journey.scenes.length);
        expect(normalized!.title.length).toBeGreaterThan(0);
      }
    }
  });

  it('only emits identifiers the resolver can ground', () => {
    const known = new Set(atlas.concepts.map((concept) => concept.id));
    for (const journey of CURATED_JOURNEYS) {
      const normalized = normalizeJourney(atlas, journey, 'en', 'demo')!;
      for (const scene of normalized.scenes) {
        for (const structure of scene.structures) expect(known.has(structure.conceptId)).toBe(true);
        for (const action of scene.actions) {
          const targets =
            action.type === 'focus' || action.type === 'highlight'
              ? [action.target]
              : action.type === 'isolate' || action.type === 'show' || action.type === 'hide'
                ? action.targets
                : [];
          for (const target of targets) {
            const resolved = resolveStructure(atlas, target);
            expect(resolved, `${scene.id}: ${target}`).not.toBeNull();
            expect(resolved!.partIds.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('keeps grouped structures grouped, so lungs means both lungs', () => {
    const breathing = CURATED_JOURNEYS.find((journey) => journey.id === 'breathing')!;
    const normalized = normalizeJourney(atlas, breathing, 'en', 'demo')!;
    const lungsScene = normalized.scenes.find((scene) => scene.id === 'breath-lungs')!;
    expect(lungsScene.structures.length).toBeGreaterThanOrEqual(2);
    const ids = lungsScene.structures.map((structure) => structure.conceptId);
    expect(ids).toContain('FMA7309');
    expect(ids).toContain('FMA7310');
  });
});

describe('matchCurated', () => {
  const cases: [string, string][] = [
    ['What happens when I run?', 'run'],
    ['How does breathing work?', 'breathing'],
    ['How does blood circulate through the body?', 'circulation'],
    ['What happens when I eat?', 'eat'],
    ['How does the heart work?', 'heart'],
    ['Why do we need lungs?', 'lungs'],
    ['How does the brain control the body?', 'brain'],
    ['Why do muscles get tired?', 'muscle-fatigue'],
    ['What happens when I hold my breath?', 'hold-breath'],
    ['What happens when I sleep?', 'sleep'],
  ];

  for (const [query, expected] of cases) {
    it(`routes "${query}" to ${expected}`, () => {
      expect(matchCurated(query)?.draft.id).toBe(expected);
    });
  }

  it('routes Indonesian questions too', () => {
    expect(matchCurated('Apa yang terjadi saat berlari?')?.draft.id).toBe('run');
    expect(matchCurated('Bagaimana pernapasan bekerja?')?.draft.id).toBe('breathing');
    expect(matchCurated('Mengapa kita butuh paru-paru?')?.draft.id).toBe('lungs');
  });

  it('declines an unrelated question', () => {
    expect(matchCurated('what is the capital of peru')).toBeNull();
  });
});

describe('planJourney fallback', () => {
  it('grounds a structure question from outside the curated set', async () => {
    const answer = await planJourney({atlas, query: 'what does the left external oblique do', language: 'en'});
    expect(answer.source).toBe('fallback');
    expect(answer.journey.scenes[0].structures[0].name.toLowerCase()).toContain('external oblique');
  });

  it('answers a plain structure question with the catalogue description', async () => {
    const answer = await planJourney({atlas, query: 'tell me about the pineal body', language: 'en'});
    expect(answer.journey.title).toBe('Pineal body');
    expect(answer.journey.scenes[0].actions.length).toBeGreaterThan(0);
  });

  it('stays honest instead of inventing a structure', async () => {
    const answer = await planJourney({atlas, query: 'what is the capital of peru', language: 'en'});
    expect(answer.source).toBe('fallback');
    expect(answer.journey.scenes[0].actions).toEqual([]);
  });

  it('carries a safety warning through for red-flag symptoms', async () => {
    const answer = await planJourney({atlas, query: 'I have chest pain and cannot breathe', language: 'en'});
    expect(answer.warning).toBeTruthy();
    expect(answer.journey.scenes.length).toBeGreaterThan(0);
  });
});

describe('screenQuestion', () => {
  it('flags red-flag symptoms in both languages', () => {
    expect(screenQuestion('I have chest pain and cannot breathe', 'en').flagged).toBe(true);
    expect(screenQuestion('saya sesak napas dan nyeri dada', 'id').flagged).toBe(true);
  });

  it('leaves ordinary anatomy questions alone', () => {
    expect(screenQuestion('what happens when I run', 'en').flagged).toBe(false);
  });
});
