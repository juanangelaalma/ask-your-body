'use client';
import type {BodyJourney, ChatMessage, Language} from '@/shared/types';
import {useJourneyStore} from '@/journey/store';
import {Composer} from './composer';
import {SceneTimeline} from './scene-timeline';
import {SuggestedQuestions} from './suggested-questions';
import {ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, WarningIcon} from './ui/icons';

function Bubble({message}: {message: ChatMessage}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[88%] rounded-[10px] bg-ink px-3.5 py-2.5 type-body-sm text-white">{message.content}</p>
      </div>
    );
  }
  return (
    <p className="rounded-[8px] border border-line bg-surface px-3.5 py-3 type-body-sm text-quiet-strong">
      {message.content}
    </p>
  );
}

function JourneyCard({journey, language}: {journey: BodyJourney; language: Language}) {
  const activeIndex = useJourneyStore((state) => state.activeIndex);
  const playing = useJourneyStore((state) => state.playing);
  const goToScene = useJourneyStore((state) => state.goToScene);
  const next = useJourneyStore((state) => state.next);
  const previous = useJourneyStore((state) => state.previous);
  const setPlaying = useJourneyStore((state) => state.setPlaying);

  const scene = journey.scenes[activeIndex];
  if (!scene) return null;

  const last = activeIndex === journey.scenes.length - 1;

  return (
    <section className="mt-4 rounded-[12px] border border-line bg-surface p-4 shadow-card" aria-label="Guided journey">
      <p className="type-caption text-sage-text">{language === 'id' ? 'Perjalanan terpandu' : 'Guided journey'}</p>
      <h2 className="type-h3 mt-1 text-ink">{journey.title}</h2>

      <div className="mt-4">
        <SceneTimeline journey={journey} activeIndex={activeIndex} onSelect={goToScene} />
      </div>

      <div key={scene.id} className="settle-in mt-4 min-h-[96px]">
        <p className="type-h4 text-ink">{scene.title}</p>
        <p className="type-body-sm mt-1.5 text-quiet-strong">{scene.narration}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-line-soft pt-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm !px-2"
          onClick={previous}
          disabled={activeIndex === 0}
          aria-label={language === 'id' ? 'Scene sebelumnya' : 'Previous scene'}
        >
          <ChevronLeftIcon size={17} />
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => (last && !playing ? goToScene(0) : setPlaying(!playing))}
          aria-label={playing ? (language === 'id' ? 'Jeda' : 'Pause') : language === 'id' ? 'Putar' : 'Play'}
        >
          {playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          {playing ? (language === 'id' ? 'Jeda' : 'Pause') : last ? (language === 'id' ? 'Ulang' : 'Replay') : language === 'id' ? 'Putar' : 'Play'}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm !px-2"
          onClick={next}
          disabled={last}
          aria-label={language === 'id' ? 'Scene berikutnya' : 'Next scene'}
        >
          <ChevronRightIcon size={17} />
        </button>
        <span className="ml-auto type-code text-[12px] text-quiet">
          {activeIndex + 1} / {journey.scenes.length}
        </span>
      </div>
    </section>
  );
}

function LoadingBlock({language}: {language: Language}) {
  return (
    <div className="mt-4 space-y-2" role="status" aria-live="polite">
      <p className="type-caption text-quiet">
        {language === 'id' ? 'Menyusun penjelasan visual...' : 'Planning the visual explanation...'}
      </p>
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="h-3 animate-pulse rounded-full bg-line-soft"
          style={{width: `${88 - row * 14}%`, animationDelay: `${row * 120}ms`}}
        />
      ))}
    </div>
  );
}

export function ChatPanel({
  messages,
  journey,
  status,
  error,
  suggestions,
  warning,
  language,
  onSubmit,
  onRetry,
}: {
  messages: ChatMessage[];
  journey: BodyJourney | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  suggestions: string[];
  warning: string | null;
  language: Language;
  onSubmit: (question: string) => void;
  onRetry: () => void;
}) {
  const empty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="scroll-quiet min-h-0 flex-1 overflow-y-auto px-5 py-4" aria-live="polite">
        {empty && status !== 'loading' ? (
          <div className="rise-in">
            <h2 className="type-h3 text-ink">
              {language === 'id' ? 'Mulai dari sebuah pertanyaan' : 'Start with a question'}
            </h2>
            <p className="type-body-sm mt-2 text-quiet-strong">
              {language === 'id'
                ? 'Tanyakan apa saja tentang tubuhmu dalam bahasa sehari-hari. Jawabannya akan memandu tubuh 3D ini bergerak dan menyorot bagian yang relevan.'
                : 'Ask about your body in everyday language. The answer drives the 3D body to move and highlight the parts involved.'}
            </p>
            <div className="mt-4">
              <SuggestedQuestions
                questions={
                  language === 'id'
                    ? ['Apa yang terjadi saat berlari?', 'Bagaimana pernapasan bekerja?', 'Bagaimana darah beredar di tubuh?']
                    : ['What happens when I run?', 'How does breathing work?', 'How does blood circulate through the body?']
                }
                onSelect={onSubmit}
                label={language === 'id' ? 'Coba salah satu' : 'Try one'}
              />
            </div>
          </div>
        ) : null}

        {!empty ? (
          <ol className="space-y-3">
            {messages.map((message, index) => (
              <li
                key={message.id}
                className="rise-in"
                style={{animationDelay: `${Math.min(index, 8) * 60}ms`}}
              >
                <Bubble message={message} />
              </li>
            ))}
          </ol>
        ) : null}

        {status === 'loading' ? <LoadingBlock language={language} /> : null}

        {status === 'error' && error ? (
          <div className="mt-4 rounded-[8px] border border-line bg-surface p-3.5">
            <p className="type-body-sm text-alert-deep">{error}</p>
            <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={onRetry}>
              {language === 'id' ? 'Coba lagi' : 'Try again'}
            </button>
          </div>
        ) : null}

        {warning ? (
          <div className="mt-4 flex gap-3 rounded-[8px] border border-line bg-surface p-3.5">
            <WarningIcon size={18} className="mt-0.5 shrink-0 text-flag-deep" />
            <p className="type-body-sm text-quiet-strong">{warning}</p>
          </div>
        ) : null}

        {journey && status !== 'loading' ? <JourneyCard journey={journey} language={language} /> : null}

        {suggestions.length && status === 'idle' ? (
          <div className="mt-5">
            <SuggestedQuestions questions={suggestions} onSelect={onSubmit} label={language === 'id' ? 'Lanjutkan menjelajah' : 'Keep exploring'} />
          </div>
        ) : null}
      </div>

      <div className="border-t border-line bg-surface px-5 py-3.5">
        <Composer onSubmit={onSubmit} disabled={status === 'loading'} language={language} />
        <p className="type-caption mt-2.5 text-quiet">
          {language === 'id'
            ? 'Untuk edukasi anatomi, bukan diagnosis medis.'
            : 'For anatomy education, not medical diagnosis.'}
        </p>
      </div>
    </div>
  );
}
