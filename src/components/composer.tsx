'use client';
import {useState, type KeyboardEvent} from 'react';
import type {Language} from '@/shared/types';
import {SendIcon} from './ui/icons';

export function Composer({
  onSubmit,
  disabled,
  language,
}: {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  language: Language;
}) {
  const [value, setValue] = useState('');

  const send = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit(text);
    setValue('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <form
      className="flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="question" className="sr-only">
          {language === 'id' ? 'Tanyakan apa saja tentang tubuhmu' : 'Ask anything about your body'}
        </label>
        <textarea
          id="question"
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          maxLength={500}
          placeholder={
            language === 'id' ? 'Tanyakan apa saja tentang tubuhmu...' : 'Ask anything about your body...'
          }
          className="w-full resize-none rounded-[8px] border border-line bg-surface px-3.5 py-2.5 type-body-sm text-ink outline-none transition-colors duration-150 ease-out placeholder:text-quiet hover:border-ink focus:border-ink focus:ring-[3px] focus:ring-ink/10 disabled:bg-line-soft"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-md !px-3.5"
        disabled={disabled || !value.trim()}
        aria-label={language === 'id' ? 'Kirim pertanyaan' : 'Send question'}
      >
        <SendIcon size={18} strokeWidth={2} />
      </button>
    </form>
  );
}
