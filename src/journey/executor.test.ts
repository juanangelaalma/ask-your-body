import {describe, expect, it} from 'vitest';
import {DEFAULT_VISIBLE} from '@/atlas/anatomy';
import {loadAtlas} from '@/testing/atlas';
import type {BodyAction, BodyScene} from '@/shared/types';
import {initialViewerState, reduceAction, reduceScene} from './executor';

const atlas = loadAtlas();
const HEART = 'FMA7088';
const SKIN = 'FMA7163';

const scene = (actions: BodyAction[], structures: BodyScene['structures'] = []): BodyScene => ({
  id: 'scene',
  title: 'Scene',
  narration: 'Narration',
  structures,
  actions,
});

describe('initialViewerState', () => {
  it('starts from the atlas default systems with nothing selected', () => {
    const state = initialViewerState();
    expect(state.scene.visible).toEqual([...DEFAULT_VISIBLE]);
    expect(state.scene.selected).toEqual([]);
    expect(state.scene.isolate).toBe(false);
    expect(state.focus).toBeNull();
    expect(state.emphasis).toBeNull();
  });
});

describe('reduceAction', () => {
  it('focuses a structure without muting the rest', () => {
    const next = reduceAction(atlas, initialViewerState(), {type: 'focus', target: HEART});
    expect(next.focus?.parts.length).toBeGreaterThan(0);
    expect(next.emphasis).toBeNull();
  });

  it('highlights a structure and records it in the emphasis set', () => {
    const next = reduceAction(atlas, initialViewerState(), {type: 'highlight', target: HEART});
    expect(next.scene.selected.length).toBeGreaterThan(0);
    expect(next.emphasis?.strong.length).toBeGreaterThan(0);
    expect(next.emphasis?.context).toBe(1);
  });

  it('isolates every part behind a grouped structure', () => {
    const next = reduceAction(atlas, initialViewerState(), {type: 'isolate', targets: ['lungs']});
    expect(next.scene.isolate).toBe(true);
    expect(next.scene.selected.length).toBeGreaterThan(250);
  });

  it('hides and shows a system by name', () => {
    const hidden = reduceAction(atlas, initialViewerState(), {type: 'hide_system', system: 'muscular'});
    expect(hidden.scene.visible).not.toContain('muscular');
    const shown = reduceAction(atlas, hidden, {type: 'show_system', system: 'muscular'});
    expect(shown.scene.visible).toContain('muscular');
  });

  it('hides the structures behind a target rather than the whole body', () => {
    const next = reduceAction(atlas, initialViewerState(), {type: 'hide', targets: ['skin']});
    expect(next.scene.visible).not.toContain('integumentary');
    expect(next.scene.visible).toContain('cardiac');
  });

  it('leaves the state untouched when a target does not resolve', () => {
    const state = initialViewerState();
    expect(reduceAction(atlas, state, {type: 'focus', target: 'FMA000000'})).toBe(state);
    expect(reduceAction(atlas, state, {type: 'isolate', targets: ['FMA000000']})).toBe(state);
  });

  it('treats a wait as a no-op for state', () => {
    const state = initialViewerState();
    expect(reduceAction(atlas, state, {type: 'wait', duration: 1200})).toBe(state);
  });

  it('re-identifies a hidden skin concept by its concept id', () => {
    const next = reduceAction(atlas, initialViewerState(), {type: 'hide', targets: [SKIN]});
    expect(next.scene.visible).not.toContain('integumentary');
  });
});

describe('reduceScene', () => {
  it('starts every scene from the default view', () => {
    const first = reduceScene(atlas, initialViewerState(), scene([{type: 'hide_system', system: 'muscular'}]));
    expect(first.scene.visible).not.toContain('muscular');
    const second = reduceScene(atlas, first, scene([{type: 'highlight', target: HEART}]));
    expect(second.scene.visible).toContain('muscular');
    expect(second.scene.reset).toBeGreaterThan(first.scene.reset);
  });

  it('mutes the surroundings only when the scene focuses something', () => {
    const focused = reduceScene(atlas, initialViewerState(), scene([{type: 'focus', target: HEART}, {type: 'highlight', target: HEART}]));
    expect(focused.emphasis?.context).toBe(0.4);
    const plain = reduceScene(atlas, initialViewerState(), scene([{type: 'highlight', target: HEART}]));
    expect(plain.emphasis?.context).toBe(1);
  });

  it('falls back to the declared structures when no highlight action is present', () => {
    const next = reduceScene(atlas, initialViewerState(), scene([{type: 'focus', target: HEART}], [{conceptId: HEART, name: 'Heart'}]));
    expect(next.emphasis?.strong.length).toBeGreaterThan(0);
  });
});
