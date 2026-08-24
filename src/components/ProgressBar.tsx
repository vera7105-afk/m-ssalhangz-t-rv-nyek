import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

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
    <div className="w-full bg-white border-b border-slate-200 py-3 px-4 shadow-2xs">
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span>Haladás:</span>
            <span className="text-indigo-600 font-extrabold text-sm">
              {currentIndex + 1} / {totalQuestions}. kérdés
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Bonus Stars indicator */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
                Bónusz csillagok:
              </span>
              {[1, 2, 3].map((bId) => {
                const isEarned = completedBonusIds.includes(bId);
                return (
                  <div
                    key={bId}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isEarned
                        ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-xs scale-110'
                        : 'bg-slate-100 border-slate-200 text-slate-300'
                    }`}
                    title={`${bId}. Bónusz feladat (+10 pont)`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isEarned ? 'fill-slate-900' : ''}`} />
                  </div>
                );
              })}
            </div>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${Math.max(3, percentage)}%` }}
          />
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-semibold text-slate-400 pt-0.5">
          <span className={currentIndex < 10 ? 'text-indigo-600 font-bold' : 'text-slate-500'}>
            1. Rész: Kvíz (1-10)
          </span>
          <span
            className={
              currentIndex >= 10 && currentIndex < 20 ? 'text-emerald-600 font-bold' : 'text-slate-500'
            }
          >
            2. Rész: Helyesírás (11-20)
          </span>
          <span
            className={currentIndex >= 20 ? 'text-amber-600 font-bold' : 'text-slate-500'}
          >
            3. Rész: Kakukktojás (21-30)
          </span>
        </div>
      </div>
    </div>
  );
};
