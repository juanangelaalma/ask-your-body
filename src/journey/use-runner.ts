'use client';
import {useEffect} from 'react';
import {useJourneyStore} from './store';

/** Reading pace plus a floor, so one-line scenes do not flash past. */
export function estimateSceneDuration(narration: string): number {
  const words = narration.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(14000, Math.max(4600, words * 330));
}

/** Advances the journey on its own while playing, and stops on the last scene. */
export function useJourneyRunner() {
  const journey = useJourneyStore((state) => state.journey);
  const activeIndex = useJourneyStore((state) => state.activeIndex);
  const playing = useJourneyStore((state) => state.playing);
  const next = useJourneyStore((state) => state.next);
  const setPlaying = useJourneyStore((state) => state.setPlaying);

  useEffect(() => {
    if (!playing || !journey) return;
    const scene = journey.scenes[activeIndex];
    if (!scene) return;
    const waits = scene.actions.reduce((total, action) => total + (action.type === 'wait' ? action.duration : 0), 0);
    const delay = (scene.duration ?? estimateSceneDuration(scene.narration)) + waits;
    const timer = setTimeout(() => {
      if (activeIndex < journey.scenes.length - 1) next();
      else setPlaying(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [playing, journey, activeIndex, next, setPlaying]);
}
