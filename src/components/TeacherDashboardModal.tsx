import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Trophy,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  GraduationCap,
  Calendar,
  X,
} from 'lucide-react';
import { StudentScoreSummary, SupabaseTaskScoreRecord } from '../types';
import { fetchStudentsFromSupabase, fetchStudentTaskScores, isSupabaseConfigured } from '../utils/supabase';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [students, setStudents] = useState<StudentScoreSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentTaskScores, setStudentTaskScores] = useState<SupabaseTaskScoreRecord[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchStudentsFromSupabase();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSelectStudent = async (username: string) => {
    setSelectedStudent(username);
    setLoadingDetails(true);
    const scores = await fetchStudentTaskScores(username);
    setStudentTaskScores(scores);
    setLoadingDetails(false);
  };

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.displayName && s.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalClassPoints = students.reduce((sum, s) => sum + s.total_score, 0);
  const averagePoints = students.length > 0 ? (totalClassPoints / students.length).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-5 border-b border-purple-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 text-xl shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-amber-200 font-serif">Tanári Vezérlőpult & Eredménytábla</h2>
              <p className="text-xs text-purple-300">
                Diákok mássalhangzótörvény feladatpontszámai a Supabase adatbázisból
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/70 border-b border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Diákok létszáma</span>
              <span className="text-base font-black text-white">{students.length} fő</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Osztály átlag</span>
              <span className="text-base font-black text-amber-300">{averagePoints} pont</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <div>
              <span className="text-[11px] text-slate-400 block">Összesített pont</span>
              <span className="text-base font-black text-purple-300">{totalClassPoints} pont</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">Adatbázis</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isSupabaseConfigured() ? 'Supabase Élő' : 'Helyi Mód'}
              </span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
              title="Adatok frissítése"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Content: Student List & Detail View */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Student Leaderboard (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Diákok rangsora & pontszámai</span>
              </h3>
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder="Keresés névre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2.5" />
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                <span>Diákadatok betöltése a Supabase-ből...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800 p-6">
                <p className="font-bold text-slate-300 mb-1">Még nincs rögzített diák a rendszerben.</p>
                <p>Amint a tanulók elkezdenek válaszolni a kérdésekre, a pontjaik azonnal megjelennek itt!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map((st, index) => {
                  const isSelected = selectedStudent === st.username;
                  return (
                    <div
                      key={st.username}
                      onClick={() => handleSelectStudent(st.username)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 shadow-md ring-1 ring-purple-400/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-serif ${
                            index === 0
                              ? 'bg-amber-500 text-slate-950 shadow-md'
                              : index === 1
                              ? 'bg-slate-300 text-slate-950'
                              : index === 2
                              ? 'bg-amber-700 text-amber-100'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-200 flex items-center gap-2">
                            <span>{st.displayName || st.username}</span>
                            {st.role === 'tanar' && (
                              <span className="text-[10px] bg-purple-900/60 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded">
                                Tanár
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>@{st.username}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {st.last_active ? new Date(st.last_active).toLocaleDateString('hu-HU') : 'nemrég'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-black text-amber-300 font-serif block">
                            {st.total_score} pont
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {st.tasks_completed || 0} feladat megoldva
                          </span>
                        </div>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="Részletek megtekintése"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Selected Student's Detailed Task Log (5 cols on lg) */}
          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col h-full min-h-[300px]">
            <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
              <span>Részletes feladatpontok:</span>
              <span className="text-amber-300 font-mono">
                {selectedStudent ? `@${selectedStudent}` : 'Válassz diákot'}
              </span>
            </h3>

            {!selectedStudent ? (
              <div className="flex-1 flex items-center justify-center text-center p-6 text-slate-500 text-xs">
                Kattints egy diákra a bal oldali listában a feladatonkénti eredmények megtekintéséhez!
              </div>
            ) : loadingDetails ? (
              <div className="flex-1 flex items-center justify-center text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-400 mr-2" />
                Feladatok betöltése...
              </div>
            ) : studentTaskScores.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center p-6 text-slate-500 text-xs">
                Ehhez a diákhoz még nem rögzültek egyéni kérdés-válaszok.
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1">
                {studentTaskScores.map((score, idx) => (
                  <div
                    key={score.id || idx}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {score.is_correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-200 block">
                          {score.question_id}. feladat ({score.castle_floor}. szint)
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          Választott opció: {score.selected_option}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-bold font-serif px-2 py-0.5 rounded text-xs shrink-0 ${
                        score.points_awarded > 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      +{score.points_awarded} pont
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
