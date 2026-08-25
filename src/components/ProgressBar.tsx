import React from 'react';
import { Star, Trees, Castle, Crown } from 'lucide-react';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  completedBonusIds: number[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  completedBonusIds,
}) => {
  const percentage = Math.min(100, Math.round((currentIndex / totalQuestions) * 100));

  return (
    <div className="w-full bg-slate-900/90 border-b border-indigo-900/50 py-3 px-4 shadow-sm text-white">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-300">🏰 Varázskastély Haladás:</span>
            <span className="text-white font-extrabold text-sm bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800 font-mono">
              {currentIndex + 1} / {totalQuestions}. feladat
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bonus Stars indicator */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-amber-200/70 font-medium mr-1 hidden sm:inline">
                Emeleti bónusz csillagok:
              </span>
              {[1, 2, 3].map((bId) => {
                const isEarned = completedBonusIds.includes(bId);
                return (
                  <div
                    key={bId}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isEarned
                        ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-md shadow-amber-400/40 scale-110'
                        : 'bg-slate-800/80 border-slate-700 text-slate-500'
                    }`}
                    title={`${bId}. Emeleti Bónusz próba (+10 pont)`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isEarned ? 'fill-slate-950' : ''}`} />
                  </div>
                );
              })}
            </div>
            <span className="bg-indigo-950 border border-indigo-800 px-2.5 py-0.5 rounded-md font-mono text-amber-300">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-400 transition-all duration-300 ease-out rounded-full shadow-md"
            style={{ width: `${Math.max(3, percentage)}%` }}
          />
        </div>

        {/* 3 Castle Floor Milestone labels */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold text-slate-400 pt-0.5">
          <span className={`flex items-center gap-1 ${currentIndex < 10 ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}>
            <Trees className="w-3 h-3" />
            1. szint: Varázskert (1–10)
          </span>
          <span
            className={`flex items-center gap-1 ${
              currentIndex >= 10 && currentIndex < 20 ? 'text-indigo-300 font-extrabold' : 'text-slate-400'
            }`}
          >
            <Castle className="w-3 h-3" />
            2. emelet: Kristályterem (11–20)
          </span>
          <span
            className={`flex items-center gap-1 ${currentIndex >= 20 ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            <Crown className="w-3 h-3" />
            3. emelet: Toronyszoba (21–30)
          </span>
        </div>
      </div>
    </div>
  );
};
