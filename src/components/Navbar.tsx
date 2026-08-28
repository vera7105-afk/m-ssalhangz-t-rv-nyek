import React from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Sparkles,
  Flame,
  Castle,
  Crown,
  Trees,
  User,
  Shield,
  Database,
  GraduationCap,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { UserProfile } from '../types';

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
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenLoginModal?: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenDatabaseSettings: () => void;
  isDbConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  score,
  streak,
  currentPart,
  isMuted,
  onToggleMute,
  onOpenGuide,
  bonusPoints,
  userProfile,
  onOpenProfile,
  onOpenLoginModal,
  onOpenTeacherDashboard,
  onOpenDatabaseSettings,
  isDbConnected,
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
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Fairytale Brand & Floor Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-md border border-amber-300 shrink-0">
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

        {/* Center/Right: User & Teacher Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* User Profile Pill Button */}
          <button
            onClick={() => {
              soundManager.playFairySparkle();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/40 text-slate-200 text-xs transition-all shadow-xs active:scale-95 cursor-pointer group"
            title="Saját Diákprofil és Pontszámok megtekintése"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              {userProfile.role === 'tanar' ? (
                <Shield className="w-3.5 h-3.5 text-purple-400" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-bold text-slate-100 text-xs line-clamp-1 group-hover:text-amber-300 transition-colors">
                {userProfile.displayName || userProfile.username}
              </div>
              <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                <span>{userProfile.role === 'tanar' ? 'Tanár' : 'Diák'}</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{userProfile.totalScore || score} pont</span>
              </div>
            </div>
          </button>

          {/* Quick Diákváltás / Bejelentkezés Button */}
          {onOpenLoginModal && (
            <button
              onClick={() => {
                soundManager.playFairySparkle();
                onOpenLoginModal();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all cursor-pointer active:scale-95"
              title="Másik diák kiválasztása vagy új bejelentkezés"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">Diákváltás</span>
            </button>
          )}

          {/* Teacher Dashboard Button */}
          {userProfile.role === 'tanar' && (
            <button
              onClick={() => {
                soundManager.playFairySparkle();
                onOpenTeacherDashboard();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-500/50 text-purple-100 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              title="Tanári Vezérlőpult és Osztály Eredmények"
            >
              <Shield className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden md:inline">Eredménytábla</span>
            </button>
          )}

          {/* Database connection badge */}
          <button
            onClick={() => {
              soundManager.playFairySparkle();
              onOpenDatabaseSettings();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
            title="Supabase adatbázis beállítások és SQL kód"
          >
            <Database className={`w-3.5 h-3.5 ${isDbConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="hidden xl:inline text-[11px]">
              {isDbConnected ? 'Supabase aktív' : 'Supabase'}
            </span>
          </button>
        </div>

        {/* Right: Scores, Streak & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Counter */}
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-400 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold animate-bounce shadow-xs hidden sm:flex">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{streak}x széria!</span>
            </div>
          )}

          {/* Total Score Badge */}
          <div className="flex items-center gap-2 bg-indigo-950/80 border border-amber-400/50 text-white px-3.5 py-1.5 rounded-xl shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <div className="text-right">
              <span className="text-xs text-indigo-300 font-medium mr-1">Összpont:</span>
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

