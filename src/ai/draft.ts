import type {BodyAction, Language} from '@/shared/types';

export interface LocalizedText {
  en: string;
  id: string;
}

export interface DraftScene {
  id: string;
  title: LocalizedText;
  narration: LocalizedText;
  structures: string[];
  actions: BodyAction[];
  duration?: number;
}

/** A journey before resolution. Targets are registry keys or concept names, never atlas ids. */
export interface DraftJourney {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  match: string[];
  scenes: DraftScene[];
  suggestions: {en: string[]; id: string[]};
}

export function pick(text: LocalizedText, language: Language): string {
  return text[language] ?? text.en;
}
