import type {AskResponse, ChatMessage, Language} from '@/shared/types';

export async function ask(options: {
  message: string;
  language: Language;
  history: ChatMessage[];
  signal?: AbortSignal;
}): Promise<AskResponse> {
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      message: options.message,
      language: options.language,
      history: options.history.map(({role, content}) => ({role, content})),
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as {error?: string} | null;
    throw new Error(detail?.error ?? 'The assistant could not answer that question.');
  }

  return (await response.json()) as AskResponse;
}
