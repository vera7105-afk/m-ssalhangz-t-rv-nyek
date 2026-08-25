import React from 'react';
import { Volume2, VolumeX, BookOpen, Sparkles, Flame, Castle, Crown, Trees } from 'lucide-react';
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
        return {
          floor: '1. szint',
          label: '1. szint: Varázskert & Kastélykapu (Kvíz)',
          color: 'bg-emerald-600/90 text-emerald-100 border-emerald-500/50',
          icon: Trees,
        };
      case 'spelling':
        return {
          floor: '2. emelet',
          label: '2. emelet: Kristályterem & Aranyalma Palota (Helyesírás)',
          color: 'bg-indigo-600/90 text-indigo-100 border-indigo-500/50',
          icon: Castle,
        };
      case 'oddoneout':
        return {
          floor: '3. emelet',
          label: '3. emelet: Toronyszoba & Tündértrón (Kakukktojás)',
          color: 'bg-amber-600/90 text-amber-100 border-amber-500/50',
          icon: Crown,
        };
    }
  };

  const partInfo = getPartBadge();
  const IconComp = partInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-indigo-900/60 shadow-lg text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Fairytale Brand & Floor Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md border border-amber-300">
            🏰
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-white font-serif tracking-tight leading-none">
                Tündérszép Ilona kastélya
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 hidden sm:inline-block">
                5. osztályos nyelvtan
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 shadow-2xs ${partInfo.color}`}>
                <IconComp className="w-3.5 h-3.5" />
                <span>{partInfo.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Scores, Streak & Fairytale Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold animate-bounce shadow-xs">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{streak}x széria!</span>
            </div>
          )}

          {/* Score Badge */}
          <div className="flex items-center gap-2 bg-indigo-950/80 border border-amber-400/50 text-white px-3.5 py-1.5 rounded-xl shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <div className="text-right">
              <span className="text-xs text-indigo-300 font-medium mr-1">Pont:</span>
              <span className="text-sm sm:text-base font-black text-amber-300 font-serif">{score}</span>
              {bonusPoints > 0 && (
                <span className="text-[10px] ml-1 text-emerald-400 font-bold">
                  (+{bonusPoints})
                </span>
              )}
            </div>
          </div>

          {/* Grammar Guide Button */}
          <button
            onClick={() => {
              soundManager.playFairySparkle();
              onOpenGuide();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white border border-purple-400/40 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            title="Tündér kisokos megnyitása"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">Tündér kisokos</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
                : 'bg-indigo-900/80 border-indigo-600 text-amber-300 hover:bg-indigo-800'
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
