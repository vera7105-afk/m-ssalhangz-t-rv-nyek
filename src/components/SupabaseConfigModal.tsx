import React, { useState, useEffect } from 'react';
import { Database, Check, Copy, RefreshCw, Key, Globe, AlertCircle, CheckCircle2, Code2, X } from 'lucide-react';
import { getSupabaseConfig, saveCustomSupabaseConfig, clearCustomSupabaseConfig, testSupabaseConnection } from '../utils/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'sql'>('config');

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig();
      setUrl(current.url);
      setAnonKey(current.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
    onConfigChanged();
    setTesting(true);
    const res = await testSupabaseConnection();
    setTesting(false);
    setTestResult(res);
  };

  const handleTest = async () => {
    saveCustomSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
    onConfigChanged();
    setTesting(true);
    const res = await testSupabaseConnection();
    setTesting(false);
    setTestResult(res);
  };

  const handleResetToEnv = () => {
    clearCustomSupabaseConfig();
    const envConfig = getSupabaseConfig();
    setUrl(envConfig.url);
    setAnonKey(envConfig.anonKey);
    onConfigChanged();
    setTestResult(null);
  };

  const sqlSchemaCode = `-- TÜNDÉRSZÉP ILONA KASTÉLYA - SUPABASE SÉMA
-- Futtasd ezt a kódot a Supabase SQL Editorban!

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'diak' CHECK (role IN ('diak', 'tanar', 'admin')),
  grade TEXT DEFAULT '5. osztály',
  total_score INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  spelling_score INTEGER NOT NULL DEFAULT 0,
  oddoneout_score INTEGER NOT NULL DEFAULT 0,
  bonus_score INTEGER NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  user_role TEXT DEFAULT 'diak',
  question_id INTEGER NOT NULL,
  task_part TEXT NOT NULL,
  castle_floor INTEGER NOT NULL,
  question_title TEXT,
  selected_option TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bonus_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  bonus_id INTEGER NOT NULL,
  castle_floor INTEGER NOT NULL,
  title TEXT,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER NOT NULL DEFAULT 0,
  spelling_score INTEGER NOT NULL DEFAULT 0,
  oddoneout_score INTEGER NOT NULL DEFAULT 0,
  bonus_score INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  completed_bonus_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on task_scores" ON public.task_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on bonus_scores" ON public.bonus_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on game_sessions" ON public.game_sessions FOR ALL USING (true) WITH CHECK (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-5 border-b border-indigo-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 text-xl shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-200 font-serif">Supabase Adatbázis Kapcsolat</h2>
              <p className="text-xs text-indigo-300">Diákok felhasználóneveinek és feladatpontjainak felhőmentése</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'config'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Beállítások & Kapcsolat</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'sql'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>SQL Adatbázis Kód (Másolható)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'config' ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
                <p className="font-bold text-amber-300">💡 Hogyan működik a Supabase mentés?</p>
                <p>
                  A rendszer automatikusan elmenti az összes diákot, a szerepköreiket és a 30 kérdésre adott egyéni válaszokat a feladatpontszámokkal és az összpontszámmal együtt.
                </p>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                  Supabase Project URL (VITE_SUPABASE_URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder:text-slate-600 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Anon Key */}
              <div>
                <label className="block text-xs font-bold text-indigo-300 mb-1.5 uppercase tracking-wider">
                  Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder:text-slate-600 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Test Connection result */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {testResult.success ? 'Kapcsolat sikeres!' : 'Kapcsolódási figyelmeztetés'}
                    </span>
                    <span>{testResult.message}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleResetToEnv}
                  className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Visszaállítás alapértelmezettre
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={testing}
                    onClick={handleTest}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>Kapcsolat Tesztelése</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Mentés
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-200">Supabase SQL Séma</h3>
                  <p className="text-xs text-slate-400">
                    Nyisd meg a Supabase vezérlőpultodon az <strong>SQL Editor</strong> fület, illeszd be ezt a kódot és nyomj <strong>RUN</strong>-t.
                  </p>
                </div>
                <button
                  onClick={copySql}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Másolva!' : 'SQL Másolása'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300/90 overflow-x-auto max-h-80 leading-relaxed">
                <pre>{sqlSchemaCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
