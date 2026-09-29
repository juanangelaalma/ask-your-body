import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {NextResponse} from 'next/server';
import type {Atlas} from '@/atlas/anatomy';
import {planJourney, type HistoryEntry} from '@/ai/planner';
import type {AskResponse, Language} from '@/shared/types';

export const runtime = 'nodejs';

let atlasPromise: Promise<Atlas> | null = null;

function loadAtlas(): Promise<Atlas> {
  atlasPromise ??= readFile(path.join(process.cwd(), 'public', 'models', 'atlas.json'), 'utf8').then(
    (contents) => JSON.parse(contents) as Atlas,
  );
  return atlasPromise;
}

function toHistoryEntry(value: unknown): HistoryEntry | null {
  if (!value || typeof value !== 'object') return null;
  const entry = value as Record<string, unknown>;
  if (entry.role !== 'user' && entry.role !== 'assistant') return null;
  if (typeof entry.content !== 'string' || !entry.content.trim()) return null;
  return {role: entry.role, content: entry.content.slice(0, 600)};
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({error: 'The request body must be JSON.'}, {status: 400});
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const message = typeof record.message === 'string' ? record.message.trim() : '';
  if (message.length < 2) {
    return NextResponse.json({error: 'Please type a question first.'}, {status: 400});
  }
  if (message.length > 500) {
    return NextResponse.json({error: 'That question is too long. Keep it under 500 characters.'}, {status: 400});
  }

  const language: Language = record.language === 'id' ? 'id' : 'en';
  const history = (Array.isArray(record.history) ? record.history : [])
    .map(toHistoryEntry)
    .filter((entry): entry is HistoryEntry => !!entry)
    .slice(-6);

  try {
    const atlas = await loadAtlas();
    const plan = await planJourney({ atlas, query: message, language, history });
    console.log(plan.journey.scenes)
    const payload: AskResponse = {
      message: plan.journey.summary,
      journey: plan.journey,
      suggestions: plan.suggestions,
      warning: plan.warning,
    };
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      {error: 'Something went wrong while building that explanation. Please try again.'},
      {status: 500},
    );
  }
}
