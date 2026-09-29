import type {SystemId} from '@/atlas/anatomy';

export type {SystemId};

export type Language = 'en' | 'id';

/** What the planner may say. The planner never emits coordinates, only these semantic verbs. */
export type BodyAction =
  | {type: 'focus'; target: string}
  | {type: 'highlight'; target: string}
  | {type: 'isolate'; targets: string[]}
  | {type: 'show'; targets: string[]}
  | {type: 'hide'; targets: string[]}
  | {type: 'show_system'; system: SystemId}
  | {type: 'hide_system'; system: SystemId}
  | {type: 'reset'}
  | {type: 'wait'; duration: number};

export interface AnatomyReference {
  conceptId: string;
  name: string;
}

export interface BodyScene {
  id: string;
  title: string;
  narration: string;
  structures: AnatomyReference[];
  actions: BodyAction[];
  duration?: number;
}

export interface BodyJourney {
  id: string;
  query: string;
  title: string;
  summary: string;
  scenes: BodyScene[];
}

export interface AskResponse {
  message: string;
  journey: BodyJourney;
  suggestions: string[];
  warning?: string;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sceneId?: string;
  journeyId?: string;
}
