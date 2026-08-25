import React from 'react';
import { TaskPart } from '../types';
import { Sparkles, Crown, Castle, Trees, Scroll, BookOpen, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

interface CastleFloorsBannerProps {
  currentPart: TaskPart;
  currentQuestionIndex: number;
  totalQuestions: number;
  userScore: number;
  onSelectFloor?: (part: TaskPart, targetIndex: number) => void;
}

export const CastleFloorsBanner: React.FC<CastleFloorsBannerProps> = ({
  currentPart,
  currentQuestionIndex,
  totalQuestions,
  userScore,
  onSelectFloor,
}) => {
  const floors = [
    {
      floorNumber: 3,
      part: 'oddoneout' as TaskPart,
      startIndex: 20,
      name: '3. emelet: Toronyszoba & Tündértrón',
      subtitle: '3. Rész: Kakukktojás- & Hibakereső játék (21–30. kérdés)',
      storyLore: 'A legfelső aranytoronyban Tündérszép Ilona várja Árgyélust a végső próbatétel feloldásával.',
      icon: Crown,
      badge: '👑 Trónterem',
      bgGradient: 'from-amber-600/90 via-purple-700/90 to-indigo-900/90',
      activeBorder: 'border-amber-400 ring-4 ring-amber-300/40 shadow-amber-500/20',
      themeColor: 'text-amber-300',
      tagColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
    },
    {
      floorNumber: 2,
      part: 'spelling' as TaskPart,
      startIndex: 10,
      name: '2. emelet: Kristályterem & Aranyalma Palota',
      subtitle: '2. Rész: Helyesírási próbatétel (11–20. kérdés)',
      storyLore: 'A királyi kristálytermekben a varázsmondatok hiányzó szavait kell hibátlanul beilleszteni.',
      icon: Castle,
      badge: '🍎 Aranyalma Palota',
      bgGradient: 'from-indigo-600/90 via-purple-700/90 to-violet-900/90',
      activeBorder: 'border-indigo-400 ring-4 ring-indigo-300/40 shadow-indigo-500/20',
      themeColor: 'text-indigo-300',
      tagColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
    },
    {
      floorNumber: 1,
      part: 'quiz' as TaskPart,
      startIndex: 0,
      name: '1. szint: Varázskert & Kastélykapu',
      subtitle: '1. Rész: Kvízfeladatok & Hangtörvény-fejtő (1–10. kérdés)',
      storyLore: 'Az éjféli varázskertben Árgyélus megismeri a zöngés-zöngétlen párokat és a hasonulásokat.',
      icon: Trees,
      badge: '🌳 Varázskert Kapuja',
      bgGradient: 'from-emerald-700/90 via-teal-800/90 to-slate-900/90',
      activeBorder: 'border-emerald-400 ring-4 ring-emerald-300/40 shadow-emerald-500/20',
      themeColor: 'text-emerald-300',
      tagColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* Castle Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white p-5 sm:p-7 border-2 border-amber-400/40 shadow-xl backdrop-blur-sm">
        {/* Fairytale Background Elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-800/50 pb-5 mb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400/50 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Tündérszép Ilona kastélya
              </span>
              <span className="text-xs text-purple-200/80 font-medium">
                3 Szintes Mese-Kaland • 5. Osztályos Nyelvtan
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-purple-200 font-serif">
              Árgyélus vándorútja a varázskastélyban
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed max-w-2xl">
              Mássz fel a kastély mindhárom szintjén a mássalhangzótörvények feladványaival! Hallgasd meg a szavak kiejtését a hangszóró gombokkal.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-indigo-900/60 border border-indigo-700/60 rounded-2xl p-2.5 px-4 shadow-inner">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold block">
                Összpontszám
              </span>
              <span className="text-2xl font-black text-amber-300 font-serif">
                {userScore} <span className="text-xs text-amber-200/70 font-sans">pont</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-indigo-950 font-black shadow-md">
              👑
            </div>
          </div>
        </div>

        {/* 3 Castle Floors Visual Stack (3rd Floor on top, 1st on bottom) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200 uppercase tracking-wider px-1">
            <span>🏰 Kastély Szintek & Próbatételek</span>
            <span>Kattints bármelyik emeletre a megtekintéshez</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {floors.map((fl) => {
              const isActive = currentPart === fl.part;
              const IconComp = fl.icon;

              return (
                <button
                  key={fl.floorNumber}
                  onClick={() => {
                    soundManager.playFairySparkle();
                    if (onSelectFloor) {
                      onSelectFloor(fl.part, fl.startIndex);
                    }
                  }}
                  className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-br ${fl.bgGradient} ${fl.activeBorder} shadow-lg scale-[1.02]`
                      : 'bg-indigo-950/40 border-indigo-800/40 hover:bg-indigo-900/40 hover:border-indigo-700/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Top Level indicator bar */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`p-1.5 rounded-lg bg-black/20 ${fl.themeColor}`}>
                        <IconComp className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-black tracking-wide text-white">
                        {fl.floorNumber === 1 ? '1. SZINT' : `${fl.floorNumber}. EMELET`}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${fl.tagColor}`}>
                      {fl.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                    {fl.name.split(':')[1] || fl.name}
                  </h3>
                  <p className="text-[11px] text-indigo-200/80 line-clamp-2 mt-1 leading-snug">
                    {fl.storyLore}
                  </p>

                  {/* Active Indicator Pulse */}
                  {isActive && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-amber-300">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                        Jelenlegi szint
                      </span>
                      <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-white">
                        {currentQuestionIndex - fl.startIndex + 1}/10
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
