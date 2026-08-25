import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, Lightbulb, Sparkles, Trees, Castle, Crown, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

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
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-emerald-500/30 shadow-xl p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Castle Floor & Question Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <Trees className="w-3.5 h-3.5 text-emerald-700" />
              {question.castleLevelName || '1. szint: Varázskert & Kastélykapu'}
            </span>
          </div>
          {question.subtitle && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              {question.subtitle}
            </span>
          )}
        </div>

        {/* Fairy Tale Story Lore Snippet */}
        {question.storySnippet && (
          <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3.5 px-4 flex items-start gap-3 shadow-2xs">
            <span className="text-lg">📜</span>
            <div className="flex-1 text-xs sm:text-sm text-slate-700 italic font-serif leading-relaxed">
              „{question.storySnippet}”
            </div>
            <SpeakButton
              text={question.storySnippet}
              size="xs"
              title="Meserészlet felolvasása"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-3 pt-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-serif">
            {question.prompt}
          </h2>
          <SpeakButton
            text={`${question.prompt} ${question.word ? 'Szó: ' + question.word : ''}`}
            size="sm"
            title="Kérdés felolvasása"
          />
        </div>
      </div>

      {/* Target Word highlight pill if applicable */}
      {question.word && (
        <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 text-center shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Mesebeli szó:</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 font-serif tracking-wide bg-white px-3.5 py-1 rounded-xl border border-emerald-300 shadow-xs">
              {question.word}
            </span>
            <SpeakButton
              text={question.word}
              size="md"
              title={`Kattints a(z) "${question.word}" szó kiejtésének meghallgatásához!`}
            />
          </div>
          {question.pronunciation && (
            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
              <span className="text-xs font-medium text-slate-500">Kiejtve:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                {question.pronunciation}
              </span>
              <SpeakButton
                text={question.pronunciation}
                size="xs"
                title={`Kiejtés meghallgatása: ${question.pronunciation}`}
              />
            </div>
          )}
        </div>
      )}

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;
          let btnStyle = 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 text-slate-800';
          let letterStyle = 'bg-white text-slate-700 border-slate-300';
          let icon = null;

          if (isAnswered) {
            if (opt.isCorrect) {
              btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/40 shadow-sm';
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
            <div
              key={opt.id}
              role="button"
              tabIndex={isAnswered ? -1 : 0}
              onClick={() => handleSelect(opt.id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isAnswered) {
                  e.preventDefault();
                  handleSelect(opt.id);
                }
              }}
              className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-all ${btnStyle} ${
                !isAnswered ? 'cursor-pointer active:scale-98 shadow-xs hover:border-emerald-400' : 'cursor-default'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1">
                <span
                  className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center border shadow-2xs shrink-0 ${letterStyle}`}
                >
                  {letters[idx]}
                </span>
                <span className="leading-snug flex-1">{opt.text}</span>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <SpeakButton
                  text={opt.text}
                  size="xs"
                  title={`Válaszlehetőség meghallgatása: ${opt.text}`}
                />
                {icon}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Box (Reveals on Answer) */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
              question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {question.options.find((o) => o.id === selectedOptionId)?.isCorrect ? (
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
              <div className="flex items-center justify-between">
                <p className="font-bold">
                  {question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                    ? '✨ Ragyogó tündértudás! (+1 pont)'
                    : '💡 Sajnos most nem talált, de tanuljunk belőle! (0 pont)'}
                </p>
                <SpeakButton
                  text={question.explanation}
                  size="xs"
                  title="Magyarázat felolvasása"
                />
              </div>
              <p className="leading-relaxed opacity-90">{question.explanation}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                soundManager.playClick();
                onNext();
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-2xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
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
