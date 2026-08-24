import React from 'react';
import { Volume2, VolumeX, BookOpen, Sparkles, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  streak: number;
  currentPart: 'quiz' | 'spelling' | 'oddoneout';
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenGuide: () => void;
  bonusPoints: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  score,
  streak,
  currentPart,
  isMuted,
  onToggleMute,
  onOpenGuide,
  bonusPoints,
}) => {
  const getPartBadge = () => {
    switch (currentPart) {
      case 'quiz':
        return { label: '1. Rész: Kvíz (Négyválasztós)', color: 'bg-indigo-600 text-white' };
      case 'spelling':
        return { label: '2. Rész: Helyesírási feladatok', color: 'bg-emerald-600 text-white' };
      case 'oddoneout':
        return { label: '3. Rész: Kakukktojás & Hibakereső', color: 'bg-amber-600 text-white' };
    }
  };

  const partInfo = getPartBadge();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Brand & Part Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-none">
                Mássalhangzó Kaland
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 hidden sm:inline-block">
                5. osztály
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${partInfo.color}`}>
                {partInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Scores, Streak & Tools */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Streak Counter */}
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-bold animate-bounce shadow-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>{streak}x széria!</span>
            </div>
          )}

          {/* Score Badge */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="text-right">
              <span className="text-xs text-slate-300 font-medium mr-1">Pontszám:</span>
              <span className="text-sm sm:text-base font-black text-amber-300">{score}</span>
              {bonusPoints > 0 && (
                <span className="text-[10px] ml-1 text-emerald-400 font-bold">
                  (+{bonusPoints} bónusz)
                </span>
              )}
            </div>
          </div>

          {/* Grammar Guide Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
            title="Nyelvtani Kisokos megnyitása"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Puskás Kisokos</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isMuted
                ? 'bg-slate-100 border-slate-300 text-slate-400 hover:text-slate-600'
                : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
            }`}
            title={isMuted ? 'Hang bekapcsolása' : 'Hang némítása'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
