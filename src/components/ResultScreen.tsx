import React, { useState } from 'react';
import { UserAnswer } from '../types';
import { QUESTIONS, BONUS_CHALLENGES } from '../data/questions';
import { Trophy, Award, RotateCcw, CheckCircle2, XCircle, ChevronDown, ChevronUp, Printer, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { SpeakButton } from './SpeakButton';

interface ResultScreenProps {
  userAnswers: UserAnswer[];
  bonusPoints: number;
  completedBonusIds: number[];
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  userAnswers,
  bonusPoints,
  completedBonusIds,
  onRestart,
}) => {
  const [studentName, setStudentName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'all' | 'errors' | 'none'>('errors');

  // Compute stats
  const baseCorrectCount = userAnswers.filter((a) => a.isCorrect).length;
  const totalScore = baseCorrectCount + bonusPoints;
  const maxPossibleScore = QUESTIONS.length + BONUS_CHALLENGES.length * 10; // 30 + 30 = 60
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Hungarian grade logic (5th grade)
  const getGradeInfo = () => {
    // Base 30 + 30 bonus. Even without bonuses, standard percentage applies to base.
    const basePct = (baseCorrectCount / QUESTIONS.length) * 100;
    if (basePct >= 85 || totalScore >= 45) {
      return {
        grade: '5 (Jeles / Kiváló)',
        badge: 'bg-emerald-500 text-white',
        title: 'Mássalhangzótörvény Nagymester! 🌟',
        message: 'Káprázatos teljesítmény! Hibátlanul ismered a mássalhangzótörvényeket és a helyesírási szabályokat. Nyugodtan büszke lehetsz magadra!',
      };
    } else if (basePct >= 70 || totalScore >= 35) {
      return {
        grade: '4 (Jó)',
        badge: 'bg-blue-500 text-white',
        title: 'Ügyes Nyelvész Bajnok! 👏',
        message: 'Nagyon szép munka! A legtöbb hangtörvényt magabiztosan felismered és alkalmazod. Néhány apróságra még figyelj oda!',
      };
    } else if (basePct >= 50 || totalScore >= 25) {
      return {
        grade: '3 (Közepes)',
        badge: 'bg-amber-500 text-white',
        title: 'Jó Úton Járó Felfedező! 👍',
        message: 'Nem rossz próbálkozás! Az alapokat már érted, a Tündér kisokos segítségével gyorsan még biztosabbá teheted a tudásodat.',
      };
    } else if (basePct >= 35) {
      return {
        grade: '2 (Elégséges)',
        badge: 'bg-orange-500 text-white',
        title: 'Gyakorlással Mesterré Válsz! 💡',
        message: 'Sikerült átlépni a küszöböt! Nézd át a hibás válaszaidat a lenti listában, és próbáld meg újra!',
      };
    } else {
      return {
        grade: 'Gyakorolj még egy kicsit!',
        badge: 'bg-rose-500 text-white',
        title: 'Ne csüggedj, a kitartás meghozza a gyümölcsét! 💪',
        message: 'A mássalhangzótörvények néha becsapósak, de a Tündér kisokos szabályait átolvasva az újrajátszáskor sokkal jobb leszel!',
      };
    }
  };

  const gradeInfo = getGradeInfo();

  // Part breakdowns
  const quizAnswers = userAnswers.filter((a) => a.questionId <= 10);
  const quizCorrect = quizAnswers.filter((a) => a.isCorrect).length;

  const spellingAnswers = userAnswers.filter((a) => a.questionId > 10 && a.questionId <= 20);
  const spellingCorrect = spellingAnswers.filter((a) => a.isCorrect).length;

  const oddAnswers = userAnswers.filter((a) => a.questionId > 20);
  const oddCorrect = oddAnswers.filter((a) => a.isCorrect).length;

  // Filtered review list
  const errorAnswers = userAnswers.filter((a) => !a.isCorrect);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner & Grade */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-6 sm:p-10 relative">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-block p-4 rounded-3xl bg-amber-400 text-slate-900 shadow-lg mb-2">
            <Trophy className="w-12 h-12" />
          </div>

          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-black tracking-wide ${gradeInfo.badge}`}>
            Érdemjegy: {gradeInfo.grade}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {gradeInfo.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {gradeInfo.message}
          </p>

          {/* Primary Score Board */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <span className="text-xs font-bold text-indigo-700 block">Összpontszám</span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-950">
                {totalScore} <span className="text-sm text-slate-400 font-bold">/ 60</span>
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <span className="text-xs font-bold text-emerald-700 block">Alapkérdések</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-950">
                {baseCorrectCount} <span className="text-sm text-slate-400 font-bold">/ 30</span>
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <span className="text-xs font-bold text-amber-700 block">Bónusz Pontok</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-950">
                +{bonusPoints} <span className="text-sm text-slate-400 font-bold">/ 30</span>
              </span>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <span className="text-xs font-bold text-purple-700 block">Bónusz Csillagok</span>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3].map((id) => (
                  <Star
                    key={id}
                    className={`w-5 h-5 ${
                      completedBonusIds.includes(id)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Part Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">1. Kvíz</span>
              <span className="font-bold text-slate-800 text-sm">{quizCorrect} / 10 pont</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">2. Helyesírás</span>
              <span className="font-bold text-slate-800 text-sm">{spellingCorrect} / 10 pont</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">3. Kakukktojás</span>
              <span className="font-bold text-slate-800 text-sm">{oddCorrect} / 10 pont</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                soundManager.playClick();
                setShowCertificate(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Dicsérő Oklevél készítése</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onRestart();
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Újrakezdés / Új gyakorlás</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* OKLEVÉL MODAL / PRINTABLE CERTIFICATE */}
      {/* ==================================================== */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border-8 border-amber-300 shadow-2xl p-6 sm:p-10 space-y-6 text-center relative print:border-4 print:p-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 uppercase tracking-wider">
                Dicsérő Oklevél
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Magyar Nyelvtan • 5. Osztályos Mássalhangzótörvények
              </p>
            </div>

            <div className="space-y-4 py-4 border-y-2 border-dashed border-amber-200">
              <p className="text-sm text-slate-600">Ez az elismerés megilleti:</p>
              <input
                type="text"
                placeholder="Írd be ide a nevedet (pl. Kovács Anna)"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full max-w-md mx-auto text-center font-bold text-xl sm:text-2xl text-indigo-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent py-1"
              />
              <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                aki kimagasló szorgalommal és kitűnő tudással teljesítette a mássalhangzótörvények interaktív gyakorlófeladatait, és{' '}
                <strong className="text-indigo-950">{totalScore} pontot</strong> szerzett.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-4">
              <span>Érdemjegy: {gradeInfo.grade}</span>
              <span>Dátum: {new Date().toLocaleDateString('hu-HU')}</span>
            </div>

            <div className="flex justify-center gap-3 pt-2 print:hidden">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Nyomtatás / Mentés PDF-be</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* DETAILED QUESTION REVIEW LIST */}
      {/* ==================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Feladatok részletes áttekintése és magyarázatok
            </h3>
            <p className="text-xs text-slate-500">
              Nézd át a válaszaidat és a hozzájuk tartozó nyelvtani magyarázatot!
            </p>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedSection('errors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                expandedSection === 'errors'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              Csak a javítandók ({errorAnswers.length})
            </button>
            <button
              onClick={() => setExpandedSection('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                expandedSection === 'all'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              Mind a 30 feladat ({userAnswers.length})
            </button>
          </div>
        </div>

        {/* Review list items */}
        <div className="space-y-3 pt-2">
          {QUESTIONS.map((q) => {
            const answer = userAnswers.find((a) => a.questionId === q.id);
            if (!answer) return null;
            if (expandedSection === 'errors' && answer.isCorrect) return null;

            const selectedOpt = q.options.find((o) => o.id === answer.selectedOptionId);
            const correctOpt = q.options.find((o) => o.isCorrect);

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  answer.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                          {q.id}. feladat
                        </span>
                        {q.word && (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                              {q.word}
                            </span>
                            <SpeakButton text={q.word} size="xs" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {q.prompt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SpeakButton text={q.prompt} size="xs" />
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        answer.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {answer.isCorrect ? '+1 pont' : '0 pont'}
                    </span>
                  </div>
                </div>

                {/* Answer breakdown */}
                <div className="mt-3 text-xs space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Te válaszod:</span>
                    <span
                      className={`font-bold ${
                        answer.isCorrect ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {selectedOpt?.text || 'Nem lett megválaszolva'}
                    </span>
                  </div>
                  {!answer.isCorrect && correctOpt && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Helyes válasz:</span>
                      <span className="font-bold text-emerald-700">{correctOpt.text}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-100">
                    <p className="text-slate-600">
                      <strong>Nyelvtani magyarázat:</strong> {q.explanation}
                    </p>
                    <SpeakButton text={q.explanation} size="xs" />
                  </div>
                </div>
              </div>
            );
          })}

          {expandedSection === 'errors' && errorAnswers.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm font-semibold">
              🎉 Gratulálunk, egyetlen hibád sincs az alapkérdések között!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
