'use client';
import {CloseIcon} from './ui/icons';

export interface SelectedStructure {
  partId: string;
  conceptId: string;
  name: string;
}

const PROMPTS: {en: (name: string) => string; id: (name: string) => string}[] = [
  {en: (name) => `What does the ${name} do?`, id: (name) => `Apa fungsi ${name}?`},
  {en: (name) => `How does the ${name} work with the rest of the body?`, id: (name) => `Bagaimana ${name} bekerja bersama bagian tubuh lain?`},
];

export function StructureInspector({
  structure,
  language,
  onAsk,
  onClose,
}: {
  structure: SelectedStructure;
  language: 'en' | 'id';
  onAsk: (question: string) => void;
  onClose: () => void;
}) {
  const label = structure.name.toLowerCase();

  return (
    <div className="pointer-events-auto w-[290px] max-w-[calc(100%-2rem)] rounded-[12px] border border-line bg-surface p-4 shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="type-caption text-quiet">Selected structure</p>
          <h2 className="type-h4 mt-1 truncate capitalize text-ink">{structure.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm !min-h-8 !px-1.5" aria-label="Close structure panel">
          <CloseIcon size={15} />
        </button>
      </div>

      <p className="type-code mt-2 text-[12px] text-quiet">{structure.conceptId}</p>

      <p className="type-body-sm mt-3 text-quiet-strong">Ask about this structure</p>
      <div className="mt-2 flex flex-col items-start gap-2">
        {PROMPTS.map((prompt, index) => {
          const question = language === 'id' ? prompt.id(label) : prompt.en(label);
          return (
            <button key={index} type="button" onClick={() => onAsk(question)} className="chip chip-filter !normal-case !tracking-normal text-left">
              {question}
            </button>
          );
        })}
      </div>
    </div>
  );
}
