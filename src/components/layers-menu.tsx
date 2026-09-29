'use client';
import {useMemo} from 'react';
import {SYSTEMS, type Atlas, type SystemId} from '@/atlas/anatomy';
import {useJourneyStore} from '@/journey/store';
import {CloseIcon} from './ui/icons';

export function LayersMenu({atlas, onClose}: {atlas: Atlas; onClose: () => void}) {
  const visible = useJourneyStore((state) => state.scene.visible);
  const toggleSystem = useJourneyStore((state) => state.toggleSystem);

  const counts = useMemo(() => {
    const tally = new Map<SystemId, number>();
    for (const part of atlas.parts) tally.set(part.system, (tally.get(part.system) ?? 0) + 1);
    return tally;
  }, [atlas]);

  const systems = SYSTEMS.filter((system) => (counts.get(system.id) ?? 0) > 0);

  return (
    <div
      className="absolute right-4 top-[68px] z-30 w-[268px] rounded-[12px] border border-line bg-surface p-4 shadow-panel"
      role="dialog"
      aria-label="Anatomy layers"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="type-h4 text-ink">Systems</h2>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm !min-h-9 !px-2" aria-label="Close layers">
          <CloseIcon size={16} />
        </button>
      </div>
      <p className="type-caption mt-1 text-quiet">Toggle what the body shows. Your question keeps working either way.</p>

      <ul className="scroll-quiet mt-3 max-h-[46vh] space-y-0.5 overflow-y-auto pr-1">
        {systems.map((system) => {
          const on = visible.includes(system.id);
          return (
            <li key={system.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggleSystem(system.id)}
                className="flex w-full items-center gap-3 rounded-[6px] px-2 py-2 text-left transition-colors duration-150 ease-out hover:bg-line-soft"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full transition-opacity duration-150"
                  style={{background: system.color, opacity: on ? 1 : 0.3}}
                />
                <span className={`flex-1 type-body-sm ${on ? 'text-ink' : 'text-quiet'}`}>{system.name}</span>
                <span className="type-code text-[12px] text-quiet">{counts.get(system.id) ?? 0}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
