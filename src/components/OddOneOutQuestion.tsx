import React from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, Crown, Sparkles, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

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
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl border-2 border-amber-500/40 shadow-xl p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Header & Castle Floor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            {question.castleLevelName || '3. emelet: Toronyszoba & Tündértrón'}
          </span>
          {question.subtitle && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
              {question.subtitle}
            </span>
          )}
        </div>

        {/* Fairy Tale Story Lore Snippet */}
        {question.storySnippet && (
          <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3.5 px-4 flex items-start gap-3 shadow-2xs">
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
            text={question.prompt}
            size="sm"
            title="Kérdés felolvasása"
          />
        </div>
      </div>

      {/* 4 Cards Grid for Odd One Out / Error Hunt */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Szavak vizsgálata (kattints a hangszóróra a kiejtésükhöz):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let cardStyle = 'bg-slate-50 hover:bg-amber-50/60 border-slate-200 text-slate-800 hover:border-amber-300';
            let icon = null;

            if (isAnswered) {
              if (opt.isCorrect) {
                cardStyle = 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-400/40 shadow-sm';
                icon = <Check className="w-5 h-5 text-amber-600 shrink-0" />;
              } else if (isSelected && !opt.isCorrect) {
                cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 opacity-80';
                icon = <X className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                cardStyle = 'bg-slate-50/40 border-slate-200 text-slate-400 opacity-60';
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
                className={`p-4 rounded-2xl border text-left font-bold text-base sm:text-lg flex items-center justify-between gap-3 transition-all ${cardStyle} ${
                  !isAnswered ? 'cursor-pointer active:scale-98 shadow-xs' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1">
                  <span className="text-xl">✨</span>
                  <span className="leading-snug">{opt.text}</span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <SpeakButton
                    text={opt.text}
                    size="sm"
                    title={`Szó kiejtésének meghallgatása: ${opt.text}`}
                  />
                  {icon}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation with odd-reason highlight */}
      {isAnswered && (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
              selectedOption?.isCorrect
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-rose-50/90 border-rose-300 text-rose-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {selectedOption?.isCorrect ? (
                <div className="p-1.5 rounded-full bg-amber-600 text-white shadow-xs">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 rounded-full bg-rose-600 text-white shadow-xs">
                  <Lightbulb className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1 text-xs sm:text-sm flex-1">
              <div className="flex items-center justify-between">
                <p className="font-bold">
                  {selectedOption?.isCorrect
                    ? '👑 Tündéri éleslátás! Sikeresen leleplezted a hibát/kakukktojást! (+1 pont)'
                    : '💡 Nem sikerült eltalálni, de nézzük meg a tündéri magyarázatot! (0 pont)'}
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
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black rounded-2xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <span>{isLast ? '👑 Tündérkirályi Eredmények megtekintése' : 'Következő feladat'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
