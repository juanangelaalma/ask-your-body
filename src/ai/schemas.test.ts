import {describe, expect, it} from 'vitest';
import {bodyActionSchema, bodyJourneySchema} from './schemas';

const journey = {
  id: 'j1',
  query: 'why',
  title: 'A title',
  summary: 'A summary',
  scenes: [
    {
      id: 's1',
      title: 'Heart',
      narration: 'Your heart pumps.',
      structures: [{conceptId: 'FMA7088', name: 'Heart'}],
      actions: [{type: 'focus', target: 'FMA7088'}],
    },
  ],
};

describe('bodyJourneySchema', () => {
  it('accepts a well-formed journey', () => {
    expect(bodyJourneySchema.safeParse(journey).success).toBe(true);
  });

  it('rejects a scene without narration', () => {
    const broken = {...journey, scenes: [{...journey.scenes[0], narration: ''}]};
    expect(bodyJourneySchema.safeParse(broken).success).toBe(false);
  });

  it('rejects an empty scene list', () => {
    expect(bodyJourneySchema.safeParse({...journey, scenes: []}).success).toBe(false);
  });

  it('rejects an unknown action type', () => {
    const broken = {...journey, scenes: [{...journey.scenes[0], actions: [{type: 'teleport', target: 'FMA7088'}]}]};
    expect(bodyJourneySchema.safeParse(broken).success).toBe(false);
  });
});

describe('bodyActionSchema', () => {
  it('accepts every documented action', () => {
    const actions = [
      {type: 'focus', target: 'FMA7088'},
      {type: 'highlight', target: 'FMA7088'},
      {type: 'isolate', targets: ['FMA7088']},
      {type: 'show', targets: ['FMA7088']},
      {type: 'hide', targets: ['FMA7163']},
      {type: 'show_system', system: 'respiratory'},
      {type: 'hide_system', system: 'muscular'},
      {type: 'reset'},
      {type: 'wait', duration: 1200},
    ];
    for (const action of actions) expect(bodyActionSchema.safeParse(action).success).toBe(true);
  });

  it('rejects an unknown system', () => {
    expect(bodyActionSchema.safeParse({type: 'show_system', system: 'wizardry'}).success).toBe(false);
  });

  it('rejects a wait that would stall the journey', () => {
    expect(bodyActionSchema.safeParse({type: 'wait', duration: 60000}).success).toBe(false);
  });
});
