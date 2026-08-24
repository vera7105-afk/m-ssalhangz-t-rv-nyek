import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, HelpCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OddOneOutQuestionProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export const OddOneOutQuestion: React.FC<OddOneOutQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  onNext,
  isLast,
}) => {
  const isAnswered = selectedOptionId !== null;
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
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

      {/* 4 Cards Grid for Odd One Out / Error Hunt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let cardStyle = 'bg-slate-50/70 hover:bg-amber-50/40 border-slate-200 text-slate-800 hover:border-amber-300';
          let icon = null;

          if (isAnswered) {
            if (opt.isCorrect) {
              cardStyle = 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/30';
              icon = <Check className="w-5 h-5 text-amber-600 shrink-0" />;
            } else if (isSelected && !opt.isCorrect) {
              cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 opacity-80';
              icon = <X className="w-5 h-5 text-rose-600 shrink-0" />;
            } else {
              cardStyle = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => onSelectOption(opt.id)}
              className={`p-4 rounded-xl border text-left font-bold text-base sm:text-lg flex items-center justify-between gap-3 transition-all cursor-pointer ${cardStyle} ${
                !isAnswered ? 'active:scale-98 shadow-xs' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🥚</span>
                <span className="leading-snug">{opt.text}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation with odd-reason highlight */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              selectedOption?.isCorrect
                ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                : 'bg-rose-50/90 border-rose-200 text-rose-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {selectedOption?.isCorrect ? (
                <div className="p-1 rounded-full bg-amber-600 text-white">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1 rounded-full bg-rose-600 text-white">
                  <Lightbulb className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <p className="font-bold">
                {selectedOption?.isCorrect
                  ? 'Kiváló logika! Sikeresen leleplezted a kakukktojást! (+1 pont)'
                  : 'Nem sikerült eltalálni a kakukktojást, de nézzük meg a magyarázatot! (0 pont)'}
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
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>{isLast ? 'Eredmények megtekintése' : 'Következő feladat'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
