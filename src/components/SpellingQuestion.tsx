import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, PenLine, Sparkles, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SpellingQuestionProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export const SpellingQuestion: React.FC<SpellingQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  onNext,
  isLast,
}) => {
  const isAnswered = selectedOptionId !== null;
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);

  // Render sentence with dynamic filled blank or placeholder
  const renderSentence = () => {
    if (!question.spellingContext) return null;
    const parts = question.spellingContext.split('___');
    if (parts.length !== 2) {
      return <p className="text-base sm:text-lg font-medium text-slate-800">{question.spellingContext}</p>;
    }

    return (
      <div className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
        <span>{parts[0]}</span>
        <span
          className={`inline-block px-3 py-0.5 mx-1.5 rounded-lg border-2 font-bold font-mono transition-all ${
            !isAnswered
              ? 'bg-amber-100/70 border-amber-400 text-amber-900 animate-pulse'
              : selectedOption?.isCorrect
              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
              : 'bg-rose-100 border-rose-500 text-rose-900'
          }`}
        >
          {isAnswered && selectedOption ? selectedOption.text : '???'}
        </span>
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <PenLine className="w-3.5 h-3.5" />
            {question.title}
          </span>
          {question.subtitle && (
            <span className="text-xs font-medium text-slate-400">
              {question.subtitle}
            </span>
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
          {question.prompt}
        </h2>
      </div>

      {/* Sentence Context */}
      {renderSentence()}

      {/* Interactive Spelling Choices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Kattints a helyesen leírt alakra:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'bg-white hover:bg-emerald-50/50 border-slate-200 text-slate-800 shadow-2xs hover:border-emerald-300';
            let icon = null;

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30';
                icon = <Check className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 line-through opacity-80';
                icon = <X className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onSelectOption(opt.id)}
                className={`p-4 rounded-xl border font-bold text-base sm:text-lg flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle} ${
                  !isAnswered ? 'active:scale-98' : ''
                }`}
              >
                <span className="font-mono tracking-wide">{opt.text}</span>
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Explanation */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              selectedOption?.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {selectedOption?.isCorrect ? (
                <div className="p-1 rounded-full bg-emerald-600 text-white">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-amber-600 text-white">
                  <Lightbulb className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-bold">
                {selectedOption?.isCorrect
                  ? 'Hibátlan helyesírás! (+1 pont)'
                  : 'Gyakori helyesírási csapda! (0 pont)'}
              </p>
              <p className="leading-relaxed opacity-90">{question.explanation}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                soundManager.playClick();
                onNext();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>{isLast ? 'Következő rész' : 'Következő kérdés'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
