'use client';

export function SuggestedQuestions({
  questions,
  onSelect,
  label,
}: {
  questions: string[];
  onSelect: (question: string) => void;
  label: string;
}) {
  if (!questions.length) return null;
  return (
    <div className="rise-in">
      <p className="type-caption text-quiet">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {questions.map((question) => (
          <button key={question} type="button" className="chip chip-filter" onClick={() => onSelect(question)}>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
