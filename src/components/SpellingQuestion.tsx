import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, Castle, Lightbulb } from 'lucide-react';
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
      return (
        <div className="text-base sm:text-lg font-medium text-slate-800 p-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 font-serif">
          <span>{question.spellingContext}</span>
        </div>
      );
    }

    return (
      <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border-2 border-indigo-200/80 flex items-center justify-between gap-3 shadow-xs font-serif">
        <div className="flex-1">
          <span>{parts[0]}</span>
          <span
            className={`inline-block px-3.5 py-1 mx-1.5 rounded-xl border-2 font-bold font-mono transition-all text-base sm:text-lg ${
              !isAnswered
                ? 'bg-amber-100/90 border-amber-400 text-amber-950 animate-pulse shadow-xs'
                : selectedOption?.isCorrect
                ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs'
                : 'bg-rose-100 border-rose-500 text-rose-950'
            }`}
          >
            {isAnswered && selectedOption ? selectedOption.text : '???'}
          </span>
          <span>{parts[1]}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-indigo-500/30 shadow-xl p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header & Castle Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-800 bg-indigo-100 border border-indigo-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Castle className="w-3.5 h-3.5 text-indigo-700" />
            {question.castleLevelName || '2. emelet: Kristályterem & Aranyalma Palota'}
          </span>
          {question.subtitle && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              {question.subtitle}
            </span>
          )}
        </div>

        {/* Fairy Tale Story Lore Snippet */}
        {question.storySnippet && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border border-indigo-200/80 rounded-2xl p-3.5 px-4 flex items-start gap-3 shadow-2xs">
            <span className="text-lg">📜</span>
            <div className="flex-1 text-xs sm:text-sm text-slate-700 italic font-serif leading-relaxed">
              „{question.storySnippet}”
            </div>
          </div>
        )}

        <div className="pt-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-serif">
            {question.prompt}
          </h2>
        </div>
      </div>

      {/* Sentence Context */}
      {renderSentence()}

      {/* Interactive Spelling Choices */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Kattints a helyesen leírt alakra:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 text-slate-800 shadow-2xs hover:border-indigo-300';
            let icon = null;

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/40 shadow-sm';
                icon = <Check className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 line-through opacity-80';
                icon = <X className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <div
                key={opt.id}
                role="button"
                tabIndex={isAnswered ? -1 : 0}
                onClick={() => {
                  if (isAnswered) return;
                  onSelectOption(opt.id);
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !isAnswered) {
                    e.preventDefault();
                    onSelectOption(opt.id);
                  }
                }}
                className={`p-4 rounded-2xl border font-bold text-base sm:text-lg flex items-center justify-between gap-3 transition-all ${btnStyle} ${
                  !isAnswered ? 'cursor-pointer active:scale-98' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono tracking-wide">{opt.text}</span>
                </div>
                {icon && <div className="flex items-center gap-2">{icon}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Explanation */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
              selectedOption?.isCorrect
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {selectedOption?.isCorrect ? (
                <div className="p-1.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 rounded-full bg-amber-600 text-white shadow-xs">
                  <Lightbulb className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1 text-xs sm:text-sm flex-1">
              <p className="font-bold">
                {selectedOption?.isCorrect
                  ? '✨ Hibátlan tündéri helyesírás! (+1 pont)'
                  : '💡 Gyakori helyesírási csapda a mesében! (0 pont)'}
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
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <span>{isLast ? 'Következő kastélyszint' : 'Következő kérdés'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
