import React from 'react';
import { BonusChallenge } from '../types';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BonusChallengeModalProps {
  challenge: BonusChallenge;
  isOpen: boolean;
  onAccept: () => void;
  onSkip: () => void;
}

export const BonusChallengeModal: React.FC<BonusChallengeModalProps> = ({
  challenge,
  isOpen,
  onAccept,
  onSkip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden text-center p-6 sm:p-8 space-y-6 relative">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-200/50 rounded-full blur-3xl -z-10" />

        {/* Top Trophy Icon with glowing ring */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-white shadow-lg mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="w-10 h-10 drop-shadow-md text-amber-950" />
          </div>
          <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-bounce">
            +10 pont!
          </span>
        </div>

        {/* Challenge Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-amber-600 font-extrabold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 fill-amber-500" />
            <span>Mérföldkő elérve (10 kérdés után)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            {challenge.title}
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            {challenge.subtitle}
          </p>
        </div>

        {/* Teaser Box */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-left space-y-2">
          <p className="font-semibold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Miről szól a feladat?
          </p>
          <p className="text-slate-600">{challenge.description}</p>
        </div>

        {/* Optional Action Choice */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onAccept();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-white" />
            <span>Igen, bevállalom a kihívást! (+10 pont)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onSkip();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors"
          >
            Inkább kihagyom, és továbbmegyek a következő részre →
          </button>
        </div>
      </div>
    </div>
  );
};
