'use client';
import Link from 'next/link';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {Atlas} from '@/atlas/anatomy';
import {ask} from '@/api/client';
import {useJourneyStore} from '@/journey/store';
import {useJourneyRunner} from '@/journey/use-runner';
import type {ChatMessage, Language} from '@/shared/types';
import {ChatPanel} from './chat-panel';
import type {SelectedStructure} from './structure-inspector';
import {ViewerPane} from './viewer-pane';

const newId = () => (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));

export function Studio() {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [atlasError, setAtlasError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [structure, setStructure] = useState<SelectedStructure | null>(null);
  const [lastQuestion, setLastQuestion] = useState('');

  const abortRef = useRef<AbortController | null>(null);
  const journey = useJourneyStore((state) => state.journey);

  useJourneyRunner();

  useEffect(() => {
    const controller = new AbortController();
    fetch('/models/atlas.json', {signal: controller.signal})
      .then((response) => {
        if (!response.ok) throw new Error('The anatomy catalogue could not be loaded.');
        return response.json() as Promise<Atlas>;
      })
      .then((data) => {
        setAtlas(data);
        useJourneyStore.getState().setAtlas(data);
      })
      .catch((cause: Error) => {
        if (cause.name !== 'AbortError') setAtlasError(cause.message);
      });
    return () => controller.abort();
  }, []);

  const submit = useCallback(
    async (raw: string) => {
      const message = raw.trim();
      if (!message || status === 'loading') return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const history = messages;
      setMessages((previous) => [...previous, {id: newId(), role: 'user', content: message}]);
      setStatus('loading');
      setError(null);
      setWarning(null);
      setStructure(null);
      setLastQuestion(message);

      try {
        const response = await ask({message, language, history, signal: controller.signal});
        setMessages((previous) => [
          ...previous,
          {id: newId(), role: 'assistant', content: response.message, journeyId: response.journey.id},
        ]);
        useJourneyStore.getState().setJourney(response.journey);
        setSuggestions(response.suggestions);
        setWarning(response.warning ?? null);
        setStatus('idle');
      } catch (cause) {
        if ((cause as Error).name === 'AbortError') return;
        setError((cause as Error).message);
        setStatus('error');
      }
    },
    [language, messages, status],
  );

  const handleSelectPart = useCallback(
    (partId: string) => {
      if (!atlas) return;
      const part = atlas.parts.find((candidate) => candidate.id === partId);
      if (!part) return;
      const concept = atlas.concepts.find((candidate) => candidate.id === part.conceptId);
      setStructure({partId, conceptId: part.conceptId, name: concept?.name ?? part.name});
      useJourneyStore.getState().selectPart(partId);
    },
    [atlas],
  );

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-line bg-surface px-4 md:px-6">
        <div className="flex items-baseline gap-3">
          <span className="type-h4 text-ink">Ask Your Body</span>
          <span className="hidden type-caption text-quiet md:inline">
            {language === 'id' ? 'Jelajahi tubuhmu dari dalam' : 'Understand your body from the inside'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 rounded-[10px] border border-line p-1"
            role="group"
            aria-label={language === 'id' ? 'Bahasa' : 'Language'}
          >
            {(['en', 'id'] as Language[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={language === option}
                onClick={() => setLanguage(option)}
                className="rounded-[6px] px-2.5 py-1.5 type-caption text-quiet-strong transition-colors duration-150 ease-out hover:bg-line-soft aria-pressed:bg-ink aria-pressed:text-white"
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <Link href="/about/attribution" className="btn btn-ghost btn-sm !px-3" aria-label="Credits and anatomy data">
            {language === 'id' ? 'Kredit' : 'Credits'}
          </Link>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(240px,42vh)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(400px,440px)] lg:grid-rows-1">
        {atlas ? (
          <ViewerPane
            atlas={atlas}
            structure={structure}
            onSelectPart={handleSelectPart}
            onClearStructure={() => {
              setStructure(null);
              useJourneyStore.getState().clearSelection();
            }}
            onAskStructure={submit}
            language={language}
          />
        ) : (
          <section
            className="relative flex items-center justify-center border-b border-line bg-canvas px-6 lg:border-b-0 lg:border-r"
            aria-label="Interactive 3D anatomy"
          >
            {atlasError ? (
              <div className="max-w-[340px] text-center">
                <p className="type-h4 text-ink">
                  {language === 'id' ? 'Atlas anatomi tidak dapat dimuat' : 'The anatomy catalogue did not load'}
                </p>
                <p className="type-body-sm mt-2 text-quiet">{atlasError}</p>
                <button type="button" className="btn btn-secondary btn-md mt-4" onClick={() => window.location.reload()}>
                  {language === 'id' ? 'Muat ulang halaman' : 'Reload the page'}
                </button>
              </div>
            ) : (
              <div className="max-w-[320px] text-center" role="status">
                <p className="type-h4 text-ink">
                  {language === 'id' ? 'Memuat katalog anatomi' : 'Loading the anatomy catalogue'}
                </p>
                <p className="type-body-sm mt-2 text-quiet">
                  {language === 'id'
                    ? 'Kamu bisa mulai bertanya sekarang. Visual 3D menyusul.'
                    : 'You can start asking questions now. The 3D view follows.'}
                </p>
              </div>
            )}
          </section>
        )}

        <div className="min-h-0 border-t border-line lg:border-t-0">
          <ChatPanel
            messages={messages}
            journey={journey}
            status={status}
            error={error}
            suggestions={suggestions}
            warning={warning}
            language={language}
            onSubmit={submit}
            onRetry={() => submit(lastQuestion)}
          />
        </div>
      </main>
    </div>
  );
}
