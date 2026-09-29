'use client';
import type {BodyJourney} from '@/shared/types';

export function SceneTimeline({
  journey,
  activeIndex,
  onSelect,
}: {
  journey: BodyJourney;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Journey scenes" className="flex gap-1.5">
      {journey.scenes.map((scene, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={scene.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-current={active ? 'step' : undefined}
            className="group min-h-11 min-w-0 flex-1 text-left"
          >
            <span
              aria-hidden="true"
              className="block h-[3px] origin-center rounded-full transition-[background-color,transform] duration-150 ease-out group-hover:scale-y-[1.6]"
              style={{background: active ? 'var(--color-sage)' : 'var(--color-line)'}}
            />
            <span
              className={`mt-2 block truncate type-caption transition-colors duration-150 ${active ? 'text-ink' : 'text-quiet'}`}
            >
              {index + 1}. {scene.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
