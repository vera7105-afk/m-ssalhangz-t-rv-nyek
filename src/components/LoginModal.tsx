import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  GraduationCap,
  Shield,
  Sparkles,
  Search,
  CheckCircle2,
  Database,
  ArrowRight,
  Crown,
  BookOpen,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import {
  fetchStudentsFromSupabase,
  loginOrRegisterUser,
  isSupabaseConfigured,
} from '../utils/supabase';
import { soundManager } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  onOpenDatabaseSettings?: () => void;
  currentProfile: UserProfile | null;
  allowClose?: boolean;
}

// Default fallback student profiles when Supabase is empty or offline
const DEFAULT_PRESET_PROFILES = [
  {
    username: 'argyelus.peter',
    displayName: 'Kovács Péter (Árgyélus)',
    role: 'diak' as UserRole,
    grade: '5.a',
    totalScore: 58,
    avatar: '👑',
  },
  {
    username: 'ilona.zsofia',
    displayName: 'Nagy Zsófia (Tündérszép Ilona)',
    role: 'diak' as UserRole,
    grade: '5.a',
    totalScore: 46,
    avatar: '🧚‍♀️',
  },
  {
    username: 'szabo.mate',
    displayName: 'Szabó Máté',
    role: 'diak' as UserRole,
    grade: '5.b',
    totalScore: 35,
    avatar: '🛡️',
  },
  {
    username: 'toth.balazs',
    displayName: 'Tóth Balázs',
    role: 'diak' as UserRole,
    grade: '5.b',
    totalScore: 19,
    avatar: '🏹',
  },
  {
    username: 'toth.erzsebet',
    displayName: 'Tóth Erzsébet tanárnő',
    role: 'tanar' as UserRole,
    grade: 'Magyartanár (5. évfolyam)',
    totalScore: 0,
    avatar: '📜',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenDatabaseSettings,
  currentProfile,
  allowClose = true,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'new'>('quick');
  const [students, setStudents] = useState<any[]>(DEFAULT_PRESET_PROFILES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form fields for new login/registration
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('diak');
  const [grade, setGrade] = useState('5.a');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRegisteredStudents();
    }
  }, [isOpen]);

  const loadRegisteredStudents = async () => {
    setLoading(true);
    try {
      const fetched = await fetchStudentsFromSupabase();
      if (fetched && fetched.length > 0) {
        setStudents(
          fetched.map((s) => ({
            username: s.username,
            displayName: s.displayName || s.username,
            role: (s.role as UserRole) || 'diak',
            grade: '5. osztály',
            totalScore: s.total_score || 0,
            avatar: s.role === 'tanar' ? '📜' : s.total_score > 40 ? '👑' : '⭐',
          }))
        );
      } else {
        setStudents(DEFAULT_PRESET_PROFILES);
      }
    } catch {
      setStudents(DEFAULT_PRESET_PROFILES);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleSelectQuickStudent = async (student: any) => {
    soundManager.playFairySparkle();
    setIsSubmitting(true);
    const profile = await loginOrRegisterUser(
      student.username,
      student.displayName,
      student.role,
      student.grade
    );
    setIsSubmitting(false);
    onLoginSuccess(profile);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    soundManager.playFairySparkle();
    setIsSubmitting(true);
    const profile = await loginOrRegisterUser(
      username.trim(),
      displayName.trim() || username.trim(),
      role,
      grade.trim() || '5. osztály'
    );
    setIsSubmitting(false);
    onLoginSuccess(profile);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.displayName && s.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header with fairytale banner */}
        <div className="bg-gradient-to-r from-amber-950 via-purple-950 to-indigo-950 p-6 border-b border-amber-500/30 text-center relative">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 text-2xl shadow-lg border border-amber-200">
            🏰
          </div>
          <h2 className="text-xl font-black text-amber-200 font-serif tracking-wide">
            Bejelentkezés a Varázskastélyba
          </h2>
          <p className="text-xs text-amber-100/80 mt-1 max-w-sm mx-auto">
            Válaszd ki a diákprofilodat vagy hozz létre egy újat a pontjaid elmentéséhez!
          </p>

          {/* Database status pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isSupabaseConfigured() ? 'Supabase adatbázis aktív' : 'Helyi üzemmód (Offline)'}</span>
            {onOpenDatabaseSettings && (
              <button
                type="button"
                onClick={onOpenDatabaseSettings}
                className="text-amber-400 hover:underline font-bold ml-1 cursor-pointer"
              >
                Beállítás
              </button>
            )}
          </div>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 p-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              soundManager.playFairySparkle();
              setActiveTab('quick');
            }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Regisztrált Diákok</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playFairySparkle();
              setActiveTab('new');
            }}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'new'
                ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Új Név / Belépés</span>
          </button>
        </div>

        {/* Tab 1: Quick Pick Existing Student */}
        {activeTab === 'quick' && (
          <div className="p-5 overflow-y-auto flex-1 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Diák nevének keresése..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredStudents.map((st) => {
                const isCurrent = currentProfile?.username === st.username;
                return (
                  <button
                    key={st.username}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectQuickStudent(st)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                      isCurrent
                        ? 'bg-amber-950/40 border-amber-400/60 ring-1 ring-amber-400/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                        {st.avatar || '🎓'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>{st.displayName}</span>
                          {st.role === 'tanar' && (
                            <span className="text-[10px] bg-purple-900/60 border border-purple-500/40 text-purple-300 px-1.5 py-0.2 rounded">
                              Tanár
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          @{st.username} • {st.grade || '5. osztály'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="font-bold font-serif text-amber-300 text-xs block">
                          {st.totalScore || 0} pont
                        </span>
                        <span className="text-[10px] text-slate-400">Összeredmény</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Create New / Custom Login Form */}
        {activeTab === 'new' && (
          <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Szerepkör
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('diak')}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'diak'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Diák</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('tanar')}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'tanar'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 ring-1 ring-purple-400/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Tanár</span>
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Felhasználónév (Azonosító) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (!displayName || displayName === username) {
                    setDisplayName(e.target.value);
                  }
                }}
                placeholder="pl. kovacs.bela vagy bela5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-600 outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Ezzel a névvel fognak elmentődni a feladatpontjaid a Supabase adatbázisban.
              </span>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Megjelenített Teljes Név
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="pl. Kovács Béla"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-600 outline-none focus:border-amber-400"
              />
            </div>

            {/* Grade / Class */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Osztály
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['5.a', '5.b', '5.c', 'Egyéb'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      grade === g
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!username.trim() || isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition-all shadow-lg active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-950" />
                <span>Belépés és Profil Aktiválása</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer / Dismiss */}
        {allowClose && onClose && (
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Mégse / Folytatás meglévő profillal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
