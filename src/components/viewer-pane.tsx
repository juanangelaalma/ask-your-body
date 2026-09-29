'use client';
import dynamic from 'next/dynamic';
import {useMemo, useState} from 'react';
import {SYSTEMS, type Atlas, type View} from '@/atlas/anatomy';
import {useJourneyStore} from '@/journey/store';
import {LayersIcon, ResetIcon, RotateIcon} from './ui/icons';
import {LayersMenu} from './layers-menu';
import {StructureInspector, type SelectedStructure} from './structure-inspector';

const AnatomyScene = dynamic(() => import('@/atlas/scene'), {ssr: false});

const VIEWS: {id: View; label: string}[] = [
  {id: 'three-quarter', label: 'Angle'},
  {id: 'front', label: 'Front'},
  {id: 'side', label: 'Side'},
  {id: 'back', label: 'Back'},
];

export function ViewerPane({
  atlas,
  structure,
  onSelectPart,
  onClearStructure,
  onAskStructure,
  language,
}: {
  atlas: Atlas;
  structure: SelectedStructure | null;
  onSelectPart: (partId: string) => void;
  onClearStructure: () => void;
  onAskStructure: (question: string) => void;
  language: 'en' | 'id';
}) {
  const scene = useJourneyStore((state) => state.scene);
  const focus = useJourneyStore((state) => state.focus);
  const emphasis = useJourneyStore((state) => state.emphasis);
  const resetView = useJourneyStore((state) => state.resetView);
  const setView = useJourneyStore((state) => state.setView);
  const setRotate = useJourneyStore((state) => state.setRotate);
  const toggleSystem = useJourneyStore((state) => state.toggleSystem);

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [layersOpen, setLayersOpen] = useState(false);

  const visibleCount = useMemo(
    () =>
      atlas.parts.filter((part) =>
        scene.isolate ? scene.selected.includes(part.id) : scene.visible.includes(part.system) || scene.selected.includes(part.id),
      ).length,
    [atlas, scene.isolate, scene.selected, scene.visible],
  );

  const loaded = progress >= 100;

  return (
    <section className="relative min-h-[280px] overflow-hidden bg-canvas" aria-label="Interactive 3D anatomy">
      <div className="scene-canvas absolute inset-0">
        <AnatomyScene
          atlas={atlas}
          state={scene}
          focusRequest={focus}
          emphasis={emphasis}
          onSelect={onSelectPart}
          onProgress={setProgress}
          onError={setError}
        />
      </div>

      {!loaded && !error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas/80 px-6">
          <div className="w-full max-w-[320px] text-center">
            <p className="type-h4 text-ink">Loading the body</p>
            <p className="type-body-sm mt-1 text-quiet">
              You can keep asking questions while the 33 MB of geometry arrives.
            </p>
            <div
              className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="3D anatomy download progress"
            >
              <span
                className="block h-full rounded-full bg-sage transition-[width] duration-300 ease-out"
                style={{width: `${Math.max(4, progress)}%`}}
              />
            </div>
            <p className="type-code mt-2 text-[12px] text-quiet">{progress}%</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas/90 px-6">
          <div className="max-w-[340px] text-center">
            <p className="type-h4 text-ink">The 3D viewer could not start</p>
            <p className="type-body-sm mt-2 text-quiet">{error}</p>
            <button type="button" className="btn btn-secondary btn-md mt-4" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          </div>
        </div>
      ) : null}

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-[10px] border border-line bg-surface/95 p-1 shadow-subtle backdrop-blur-[2px]">
          {VIEWS.map((view) => (
            <button
              key={view.id}
              type="button"
              aria-pressed={scene.view === view.id}
              onClick={() => setView(view.id)}
              className="rounded-[6px] px-2.5 py-1.5 type-caption text-quiet-strong transition-colors duration-150 ease-out hover:bg-line-soft aria-pressed:bg-ink aria-pressed:text-white"
            >
              {view.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={scene.rotate}
          onClick={() => setRotate(!scene.rotate)}
          className="flex size-[42px] items-center justify-center rounded-[10px] border border-line bg-surface/95 text-quiet-strong shadow-subtle transition-colors duration-150 ease-out hover:bg-line-soft aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
          aria-label={scene.rotate ? 'Stop auto rotation' : 'Start auto rotation'}
        >
          <RotateIcon size={18} />
        </button>
        <button
          type="button"
          aria-pressed={layersOpen}
          onClick={() => setLayersOpen((open) => !open)}
          className="flex size-[42px] items-center justify-center rounded-[10px] border border-line bg-surface/95 text-quiet-strong shadow-subtle transition-colors duration-150 ease-out hover:bg-line-soft aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
          aria-label="Toggle anatomy layers"
        >
          <LayersIcon size={18} />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="flex size-[42px] items-center justify-center rounded-[10px] border border-line bg-surface/95 text-quiet-strong shadow-subtle transition-colors duration-150 ease-out hover:bg-line-soft"
          aria-label="Reset the view"
        >
          <ResetIcon size={18} />
        </button>
      </div>

      {layersOpen ? (
        <LayersMenu
          atlas={atlas}
          onClose={() => {
            setLayersOpen(false);
          }}
        />
      ) : null}

      {structure ? (
        <div className="pointer-events-none absolute bottom-4 left-4 z-20">
          <StructureInspector
            structure={structure}
            language={language}
            onAsk={onAskStructure}
            onClose={onClearStructure}
          />
        </div>
      ) : null}

      <p className="pointer-events-none absolute bottom-4 right-4 z-10 hidden items-center gap-3 type-caption text-quiet md:flex">
        <span>{visibleCount.toLocaleString()} structures</span>
        <span aria-hidden="true" className="h-3 w-px bg-line" />
        <span>Drag to orbit, scroll to zoom, click to inspect</span>
      </p>

      {scene.isolate ? (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="chip chip-sage">{language === 'id' ? 'Mode terisolasi' : 'Isolated'}</span>
          <button
            type="button"
            className="chip chip-filter !normal-case !tracking-normal"
            onClick={() => {
              const state = useJourneyStore.getState();
              for (const system of SYSTEMS) {
                if (!state.scene.visible.includes(system.id)) toggleSystem(system.id);
              }
              useJourneyStore.setState({scene: {...state.scene, isolate: false, selected: []}});
            }}
          >
            {language === 'id' ? 'Tampilkan sekitar' : 'Show surroundings'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
