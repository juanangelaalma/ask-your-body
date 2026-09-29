import type {Atlas} from '@/atlas/anatomy';
import {SYSTEMS, explanation} from '@/atlas/anatomy';
import {resolveMany, resolveStructure, type ResolvedStructure} from '@/anatomy/resolver';
import {searchConcepts} from '@/anatomy/search';
import {normalizeTerm, tokenize} from '@/anatomy/text';
import {screenQuestion} from '@/safety/medical';
import type {AnatomyReference, BodyAction, BodyJourney, BodyScene, Language} from '@/shared/types';
import {pick, type DraftJourney, type DraftScene} from './draft';
import {CURATED_JOURNEYS} from './journeys';
import {requestJourneyDraft} from './llm';
import {bodyActionSchema, bodyJourneySchema} from './schemas';

export interface PlannedAnswer {
  journey: BodyJourney;
  suggestions: string[];
  warning?: string;
  source: 'curated' | 'llm' | 'fallback';
}

export interface HistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

const FOLLOW_UP = /^(what about|how about|and what|then what|what if|dan |kalau |lalu |bagaimana dengan|terus )/i;

const STOPWORDS = new Set([
  'what', 'when', 'why', 'how', 'does', 'your', 'body', 'the', 'and', 'for', 'with', 'that',
  'this', 'have', 'happen', 'happens', 'happened', 'into', 'from', 'about', 'tell', 'show',
  'explain', 'describe', 'give', 'want', 'know', 'need', 'work', 'works', 'working', 'help',
  'there', 'their', 'they', 'them', 'then', 'than', 'here', 'some', 'more', 'most', 'much',
  'yang', 'apa', 'apakah', 'mengapa', 'kenapa', 'bagaimana', 'saat', 'ketika', 'kita', 'kamu',
  'saya', 'aku', 'akan', 'bisa', 'dapat', 'tubuh', 'terjadi', 'adalah', 'itu', 'ini', 'dari',
  'ke', 'dan', 'atau', 'tidak', 'nya', 'jadi', 'kalau', 'jika', 'pada', 'untuk', 'dengan',
  'dalam', 'jelaskan', 'sebutkan', 'coba', 'tolong',
]);

function scoreDraft(draft: DraftJourney, normalizedQuery: string): number {
  let score = 0;
  for (const phrase of draft.match) {
    const normalized = normalizeTerm(phrase);
    if (!normalized) continue;
    if (normalizedQuery.includes(normalized)) {
      score += normalized.split(' ').length * 3 + normalized.length * 0.05;
    }
  }
  return score;
}

/** Best curated journey for the question, or null when nothing clears the relevance floor. */
export function matchCurated(query: string): {draft: DraftJourney; score: number} | null {
  const normalized = ` ${normalizeTerm(query)} `;
  let best: {draft: DraftJourney; score: number} | null = null;
  for (const draft of CURATED_JOURNEYS) {
    const score = scoreDraft(draft, normalized);
    if (score > 0 && (!best || score > best.score)) best = {draft, score};
  }
  return best && best.score >= 3 ? best : null;
}

/**
 * Rewrites a target to its canonical, resolvable term. Registry keys are kept as keys so a
 * grouped entry such as "lungs" still resolves to every concept behind it at execution time.
 */
function canonicalTarget(atlas: Atlas, term: string): string | null {
  const resolved = resolveStructure(atlas, term);
  return resolved ? resolved.key : null;
}

function canonicalAction(atlas: Atlas, action: BodyAction): BodyAction | null {
  switch (action.type) {
    case 'focus':
    case 'highlight': {
      const target = canonicalTarget(atlas, action.target);
      return target ? {type: action.type, target} : null;
    }
    case 'isolate':
    case 'show':
    case 'hide': {
      const targets = [
        ...new Set(
          action.targets
            .map((target) => canonicalTarget(atlas, target))
            .filter((target): target is string => !!target),
        ),
      ];
      return targets.length ? {type: action.type, targets} : null;
    }
    case 'show_system':
    case 'hide_system':
      return SYSTEMS.some((system) => system.id === action.system) ? action : null;
    case 'reset':
      return action;
    case 'wait':
      return Number.isFinite(action.duration) ? action : null;
  }
}

function dedupeStructures(references: AnatomyReference[]): AnatomyReference[] {
  const seen = new Set<string>();
  return references.filter((reference) => {
    if (seen.has(reference.conceptId)) return false;
    seen.add(reference.conceptId);
    return true;
  });
}

/**
 * Turns a draft into a validated journey. Every structure and action target is resolved against
 * the atlas first, and anything that does not resolve is dropped while its narration stays.
 */
export function normalizeJourney(
  atlas: Atlas,
  draft: DraftJourney,
  language: Language,
  query: string,
): BodyJourney | null {
  const scenes: BodyScene[] = draft.scenes.map((scene, index) => {
    const {resolved} = resolveMany(atlas, scene.structures);
    const actions = scene.actions
      .map((action) => canonicalAction(atlas, action))
      .filter((action): action is BodyAction => !!action);
    return {
      id: scene.id || `scene-${index + 1}`,
      title: pick(scene.title, language),
      narration: pick(scene.narration, language),
      structures: dedupeStructures(resolved.flatMap((structure) => structure.concepts)),
      actions,
      duration: scene.duration,
    };
  });
  if (!scenes.length) return null;
  const journey: BodyJourney = {
    id: draft.id,
    query,
    title: pick(draft.title, language),
    summary: pick(draft.summary, language),
    scenes,
  };
  const result = bodyJourneySchema.safeParse(journey);
  return result.success ? (result.data as BodyJourney) : null;
}

function draftFromLlm(raw: unknown, language: Language): DraftJourney | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const summary = typeof record.summary === 'string' ? record.summary.trim() : '';
  const rawScenes = Array.isArray(record.scenes) ? record.scenes : [];
  if (!title || !summary || !rawScenes.length) return null;

  const scenes: DraftScene[] = [];
  rawScenes.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return;
    const scene = entry as Record<string, unknown>;
    const narration = typeof scene.narration === 'string' ? scene.narration.trim() : '';
    if (!narration) return;
    const structures = (Array.isArray(scene.structures) ? scene.structures : [])
      .map((item) => (item && typeof item === 'object' ? (item as Record<string, unknown>).conceptId : null))
      .filter((id): id is string => typeof id === 'string');
    const actions = (Array.isArray(scene.actions) ? scene.actions : [])
      .map((action) => bodyActionSchema.safeParse(action))
      .filter((result) => result.success)
      .map((result) => result.data as BodyAction);
    const sceneTitle = typeof scene.title === 'string' && scene.title.trim() ? scene.title.trim() : `Scene ${index + 1}`;
    scenes.push({
      id: typeof scene.id === 'string' && scene.id.trim() ? scene.id.trim() : `scene-${index + 1}`,
      title: {en: sceneTitle, id: sceneTitle},
      narration: {en: narration, id: narration},
      structures,
      actions,
    });
  });
  if (!scenes.length) return null;
  return {
    id: `llm-${Date.now().toString(36)}`,
    title: {en: title, id: title},
    summary: {en: summary, id: summary},
    match: [],
    scenes,
    suggestions: {en: [], id: []},
  };
}

/**
 * A single word like "left" resolves to "left arm", which would be a poor answer for
 * "left external oblique". Score the candidates by how much of the question they explain.
 */
function bestTokenMatch(atlas: Atlas, tokens: string[]): ResolvedStructure | null {
  const asked = new Set(tokens);
  let best: ResolvedStructure | null = null;
  let bestScore = -1;
  for (const token of tokens) {
    const candidate = resolveStructure(atlas, token, {strict: true});
    if (!candidate) continue;
    const nameTokens = normalizeTerm(candidate.name).split(' ');
    const overlap = nameTokens.filter((nameToken) => asked.has(nameToken)).length;
    const score = overlap * 10 + nameTokens.length;
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function fallbackJourney(atlas: Atlas, query: string, language: Language): BodyJourney {
  const content = tokenize(query).filter((token) => token.length > 2 && !STOPWORDS.has(token));
  let structure =
    resolveStructure(atlas, query, {strict: true}) ??
    // "what does the left external oblique do" reduces to a name the catalogue knows.
    resolveStructure(atlas, content.join(' ')) ??
    bestTokenMatch(atlas, content);

  if (!structure) {
    const hit = searchConcepts(atlas, query, 1)[0];
    if (hit) structure = resolveStructure(atlas, hit.id);
  }

  if (!structure) {
    const narration =
      language === 'id'
        ? 'Pertanyaan ini belum bisa saya hubungkan dengan struktur di atlas anatomi, jadi belum ada yang bisa ditampilkan dalam 3D. Ask Your Body menjelaskan anatomi dan tidak menegakkan diagnosis. Coba salah satu pertanyaan yang disarankan.'
        : 'I could not ground this question in the anatomy atlas yet, so there is nothing to show in 3D. Ask Your Body explains anatomy and does not diagnose. Try one of the suggested questions to see a guided journey.';
    return {
      id: `fallback-${Date.now().toString(36)}`,
      query,
      title: language === 'id' ? 'Belum ada tampilan visual untuk pertanyaan ini' : 'No visual match for this question yet',
      summary: narration,
      scenes: [{id: 'fallback-text', title: language === 'id' ? 'Keterangan' : 'Explanation', narration, structures: [], actions: []}],
    };
  }

  const atlasText = explanation(structure.name, structure.system);
  const lead =
    language === 'id' ? `Ini ${structure.name}.` : `This is the ${structure.name.toLowerCase()}.`;
  const narration = `${lead} ${atlasText}`.trim();

  return {
    id: `structure-${structure.key}`,
    query,
    title: structure.name,
    summary: lead,
    scenes: [
      {
        id: `structure-${structure.key}`,
        title: structure.name,
        narration,
        structures: [{conceptId: structure.conceptId, name: structure.name}],
        actions: [
          {type: 'focus', target: structure.conceptId},
          {type: 'highlight', target: structure.conceptId},
        ],
      },
    ],
  };
}

const DEFAULT_SUGGESTIONS: Record<Language, string[]> = {
  en: ['What happens when I run?', 'How does breathing work?', 'How does blood circulate through the body?'],
  id: ['Apa yang terjadi saat berlari?', 'Bagaimana pernapasan bekerja?', 'Bagaimana darah beredar di tubuh?'],
};

function contextualQuery(query: string, history: HistoryEntry[], language: Language): string {
  if (!FOLLOW_UP.test(query.trim())) return query;
  const previous = [...history].reverse().find((entry) => entry.role === 'user');
  if (!previous) return query;
  return language === 'id' ? `${previous.content} ${query}` : `${previous.content}. ${query}`;
}

export async function planJourney(options: {
  atlas: Atlas;
  query: string;
  language: Language;
  history?: HistoryEntry[];
}): Promise<PlannedAnswer> {
  const {atlas, language} = options;
  const rawQuery = options.query.trim();
  const history = options.history ?? [];
  const safety = screenQuestion(rawQuery, language);
  const query = contextualQuery(rawQuery, history, language);

  const curated = matchCurated(query);
  if (curated) {
    const journey = normalizeJourney(atlas, curated.draft, language, rawQuery);
    if (journey) {
      return {
        journey,
        suggestions: curated.draft.suggestions[language] ?? curated.draft.suggestions.en,
        warning: safety.flagged ? safety.message : undefined,
        source: 'curated',
      };
    }
  }

  const searchTerms = resolveMany(atlas, tokenize(query).filter((token) => !STOPWORDS.has(token))).resolved.slice(0, 40);
  const raw = await requestJourneyDraft({query, language, structures: searchTerms});
  const llmDraft = raw ? draftFromLlm(raw, language) : null;
  if (llmDraft) {
    const journey = normalizeJourney(atlas, llmDraft, language, rawQuery);
    if (journey) {
      return {
        journey,
        suggestions: DEFAULT_SUGGESTIONS[language],
        warning: safety.flagged ? safety.message : undefined,
        source: 'llm',
      };
    }
  }

  return {
    journey: fallbackJourney(atlas, rawQuery, language),
    suggestions: DEFAULT_SUGGESTIONS[language],
    warning: safety.flagged ? safety.message : undefined,
    source: 'fallback',
  };
}
