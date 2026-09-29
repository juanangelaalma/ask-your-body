'use client';
import {create} from 'zustand';
import type {Atlas, SystemId, View} from '@/atlas/anatomy';
import type {BodyJourney} from '@/shared/types';
import {initialViewerState, reduceScene, requestFocus, type ViewerState} from './executor';

export interface JourneyStore extends ViewerState {
  atlas: Atlas | null;
  journey: BodyJourney | null;
  activeIndex: number;
  playing: boolean;

  setAtlas(atlas: Atlas | null): void;
  setJourney(journey: BodyJourney | null): void;
  goToScene(index: number): void;
  next(): void;
  previous(): void;
  setPlaying(playing: boolean): void;
  selectPart(partId: string): void;
  clearSelection(): void;
  toggleSystem(system: SystemId): void;
  setView(view: View): void;
  setRotate(rotate: boolean): void;
  setExplode(explode: number): void;
  resetView(): void;
}

export const useJourneyStore = create<JourneyStore>((set, get) => ({
  ...initialViewerState(),
  atlas: null,
  journey: null,
  activeIndex: 0,
  playing: false,

  setAtlas: (atlas) => set({atlas}),

  setJourney: (journey) => {
    const {atlas} = get();
    if (!journey || !atlas) {
      set({journey: null, activeIndex: 0, playing: false, ...initialViewerState()});
      return;
    }
    set({
      journey,
      activeIndex: 0,
      playing: journey.scenes.length > 1,
      ...reduceScene(atlas, get(), journey.scenes[0]),
    });
  },

  goToScene: (index) => {
    const {atlas, journey} = get();
    if (!atlas || !journey) return;
    const clamped = Math.max(0, Math.min(journey.scenes.length - 1, index));
    const next = reduceScene(atlas, get(), journey.scenes[clamped]);
    set({scene: next.scene, focus: next.focus, emphasis: next.emphasis, activeIndex: clamped});
  },

  next: () => {
    const {journey, activeIndex} = get();
    if (!journey || activeIndex >= journey.scenes.length - 1) return;
    get().goToScene(activeIndex + 1);
  },

  previous: () => {
    const {activeIndex} = get();
    if (activeIndex <= 0) return;
    get().goToScene(activeIndex - 1);
  },

  setPlaying: (playing) => set({playing}),

  selectPart: (partId) =>
    set((state) => ({
      scene: {...state.scene, selected: [partId], isolate: false},
      emphasis: null,
      focus: requestFocus([partId]),
    })),

  clearSelection: () => set((state) => ({scene: {...state.scene, selected: [], isolate: false}, emphasis: null})),

  toggleSystem: (system) =>
    set((state) => {
      const visible = state.scene.visible.includes(system)
        ? state.scene.visible.filter((id) => id !== system)
        : [...state.scene.visible, system];
      return {scene: {...state.scene, visible, selected: [], isolate: false}, emphasis: null};
    }),

  setView: (view) => set((state) => ({scene: {...state.scene, view}})),

  setRotate: (rotate) => set((state) => ({scene: {...state.scene, rotate}})),

  setExplode: (explode) => set((state) => ({scene: {...state.scene, explode}})),

  resetView: () =>
    set((state) => ({
      ...initialViewerState(),
      scene: {...initialViewerState().scene, reset: state.scene.reset + 1},
      journey: null,
      activeIndex: 0,
      playing: false,
    })),
}));
