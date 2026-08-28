import React, { useState } from 'react';
import {
  User,
  Shield,
  GraduationCap,
  Sparkles,
  Check,
  Database,
  X,
  LogOut,
  Trophy,
  Award,
  BookOpen,
  Layers,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { soundManager } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onOpenDatabaseSettings?: () => void;
  onSwitchUser?: () => void;
  isDbConnected: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onOpenDatabaseSettings,
  onSwitchUser,
  isDbConnected,
}) => {
  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.displayName || profile.username);
  const [role, setRole] = useState<UserRole>(profile.role);
  const [grade, setGrade] = useState(profile.grade || '5. osztály');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const updated: UserProfile = {
      ...profile,
      username: username.trim(),
      displayName: displayName.trim() || username.trim(),
      role,
      grade: grade.trim() || '5. osztály',
    };

    soundManager.playFairySparkle();
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-slate-900 p-5 border-b border-amber-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 text-2xl shadow-md border border-amber-200">
              {profile.role === 'tanar' ? '📜' : '👑'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-amber-200 font-serif">
                  {profile.displayName || profile.username}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    profile.role === 'tanar'
                      ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
                      : 'bg-amber-900/80 text-amber-200 border border-amber-500/40'
                  }`}
                >
                  {profile.role === 'tanar' ? 'Tanár' : 'Diák'}
                </span>
              </div>
              <p className="text-xs text-indigo-300">
                @{profile.username} • {profile.grade || '5. osztály'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Supabase Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-indigo-900/60 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300">
                {isDbConnected ? 'Supabase felhőadatbázis csatlakoztatva' : 'Helyi üzemmód (Offline)'}
              </span>
            </div>
            {onOpenDatabaseSettings && (
              <button
                type="button"
                onClick={onOpenDatabaseSettings}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Beállítás</span>
              </button>
            )}
          </div>

          {/* Big Score Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-200/80 font-bold block uppercase tracking-wider">
                  Összesített pontszám
                </span>
                <span className="text-3xl font-black text-amber-300 font-serif">
                  {profile.totalScore} <span className="text-base font-sans font-normal text-amber-200">pont</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            {/* Breakdown by level & bonus */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">1. Szint Kvíz</span>
                <span className="text-sm font-bold text-amber-300">{profile.quizScore} / 10 p</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">2. Emelet Helyesírás</span>
                <span className="text-sm font-bold text-amber-300">{profile.spellingScore} / 10 p</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">3. Emelet Kakukktojás</span>
                <span className="text-sm font-bold text-amber-300">{profile.oddoneoutScore} / 10 p</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Bónusz próbák</span>
                <span className="text-sm font-bold text-emerald-400">+{profile.bonusScore} p</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form / Toggle */}
          {!isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Név & Osztály Módosítása</span>
              </button>

              {onSwitchUser && (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playFairySparkle();
                    onSwitchUser();
                  }}
                  className="py-2.5 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-indigo-300" />
                  <span>Diákváltás</span>
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Profil Adatok Szerkesztése
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Felhasználónév (Azonosító)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Megjelenített Név
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Osztály / Csoport
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Mentve!' : 'Mentés'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

