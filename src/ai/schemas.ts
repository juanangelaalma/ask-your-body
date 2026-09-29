import {z} from 'zod';

const systemIds = [
  'skeletal', 'muscular', 'arterial', 'venous', 'nervous', 'digestive',
  'respiratory', 'urinary', 'reproductive', 'lymphatic', 'endocrine',
  'integumentary', 'connective', 'sensory', 'cardiac',
] as const;

const focusAction = z.object({type: z.literal('focus'), target: z.string().min(1)});
const highlightAction = z.object({type: z.literal('highlight'), target: z.string().min(1)});
const isolateAction = z.object({type: z.literal('isolate'), targets: z.array(z.string().min(1)).min(1)});
const showAction = z.object({type: z.literal('show'), targets: z.array(z.string().min(1)).min(1)});
const hideAction = z.object({type: z.literal('hide'), targets: z.array(z.string().min(1)).min(1)});
const showSystemAction = z.object({type: z.literal('show_system'), system: z.enum(systemIds)});
const hideSystemAction = z.object({type: z.literal('hide_system'), system: z.enum(systemIds)});
const resetAction = z.object({type: z.literal('reset')});
const waitAction = z.object({type: z.literal('wait'), duration: z.number().int().min(0).max(10000)});

export const bodyActionSchema = z.discriminatedUnion('type', [
  focusAction, highlightAction, isolateAction, showAction,
  hideAction, showSystemAction, hideSystemAction, resetAction, waitAction,
]);

export const anatomyReferenceSchema = z.object({
  conceptId: z.string().min(1),
  name: z.string().min(1),
});

export const bodySceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(80),
  narration: z.string().min(1).max(900),
  structures: z.array(anatomyReferenceSchema).max(12),
  actions: z.array(bodyActionSchema).max(12),
  duration: z.number().int().min(0).max(30000).optional(),
});

export const bodyJourneySchema = z.object({
  id: z.string().min(1),
  query: z.string(),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(600),
  scenes: z.array(bodySceneSchema).min(1).max(8),
});

export type ValidatedJourney = z.infer<typeof bodyJourneySchema>;
