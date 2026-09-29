import type {ResolvedStructure} from '@/anatomy/resolver';
import type {Language} from '@/shared/types';
import {PLANNER_SYSTEM_PROMPT, buildUserPrompt} from './prompts';

export type LlmProvider = 'openai' | 'anthropic';

/** Which provider the environment has keys for, if any. No key means curated plans only. */
export function llmProvider(): LlmProvider | null {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

async function callOpenAi(prompt: string): Promise<string | null> {
  const response = await fetch(process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      temperature: 0.4,
      response_format: {type: 'json_object'},
      messages: [
        {role: 'system', content: PLANNER_SYSTEM_PROMPT},
        {role: 'user', content: prompt},
      ],
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as {choices?: {message?: {content?: string}}[]};
  return data.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(prompt: string): Promise<string | null> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-latest',
      max_tokens: 2048,
      system: PLANNER_SYSTEM_PROMPT,
      messages: [{role: 'user', content: prompt}],
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as {content?: {type: string; text?: string}[]};
  return data.content?.find((part) => part.type === 'text')?.text ?? null;
}

function extractJson(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  return start >= 0 && end > start ? body.slice(start, end + 1) : null;
}

/** Asks the configured provider for a journey. Returns null on any failure so the caller can fall back. */
export async function requestJourneyDraft(options: {
  query: string;
  language: Language;
  structures: ResolvedStructure[];
  context?: string;
}): Promise<unknown | null> {
  const provider = llmProvider();
  if (!provider) return null;
  const prompt = buildUserPrompt(options);
  try {
    const text = provider === 'openai' ? await callOpenAi(prompt) : await callAnthropic(prompt);
    if (!text) return null;
    const json = extractJson(text);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
