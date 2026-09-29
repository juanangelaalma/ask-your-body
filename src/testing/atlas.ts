import {readFileSync} from 'node:fs';
import path from 'node:path';
import type {Atlas} from '@/atlas/anatomy';

let cached: Atlas | null = null;

/** The real catalogue, so tests ground against the same data the app ships. */
export function loadAtlas(): Atlas {
  cached ??= JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'models', 'atlas.json'), 'utf8')) as Atlas;
  return cached;
}
