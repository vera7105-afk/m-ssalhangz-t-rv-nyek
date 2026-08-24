import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QuizQuestionProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  onNext,
  isLast,
}) => {
  const isAnswered = selectedOptionId !== null;
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (optionId: string) => {
    if (isAnswered) return;
    onSelectOption(optionId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
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

      {/* Target Word highlight pill if applicable */}
      {question.word && (
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Vizsgált szó:</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-950 font-serif tracking-wide bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-2xs">
              {question.word}
            </span>
          </div>
          {question.pronunciation && (
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <span className="text-xs font-medium text-slate-400">Kiejtve:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {question.pronunciation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200 text-slate-800';
          let letterStyle = 'bg-white text-slate-700 border-slate-300';
          let icon = null;

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30';
              letterStyle = 'bg-emerald-600 text-white border-emerald-600';
              icon = <Check className="w-5 h-5 text-emerald-600 shrink-0" />;
            } else if (isSelected && !opt.isCorrect) {
              btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30';
              letterStyle = 'bg-rose-600 text-white border-rose-600';
              icon = <X className="w-5 h-5 text-rose-600 shrink-0" />;
            } else {
              btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              letterStyle = 'bg-slate-100 text-slate-400 border-slate-200';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => handleSelect(opt.id)}
              className={`w-full p-4 rounded-xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle} ${
                !isAnswered ? 'active:scale-98 shadow-xs hover:border-indigo-300' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center border shadow-2xs shrink-0 ${letterStyle}`}
                >
                  {letters[idx]}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </div>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Reveals on Answer) */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {question.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
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
                {question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                  ? 'Kiváló válasz! (+1 pont)'
                  : 'Sajnos most nem talált, de tanuljunk belőle! (0 pont)'}
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
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
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
