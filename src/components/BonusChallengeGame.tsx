import React, { useState } from 'react';
import { BonusChallenge } from '../types';
import { Sparkles, Trophy, Check, X, ArrowRight, RotateCcw, HelpCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface BonusChallengeGameProps {
  challenge: BonusChallenge;
  onComplete: (earnedPoints: number) => void;
}

export const BonusChallengeGame: React.FC<BonusChallengeGameProps> = ({
  challenge,
  onComplete,
}) => {
  // State for Task 1: Sort Rules / Pair Matching
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [pairsMap, setPairsMap] = useState<{ [word: string]: string }>({}); // word -> ruleId
  
  // State for Task 2: Sentence Word Error Hunter
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);

  // State for Task 3: True / False Riddle Match
  const [tfAnswers, setTfAnswers] = useState<{ [id: string]: boolean | null }>({});

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Trigger celebration
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
    } catch {
      // Confetti fallback
    }
  };

  // ----------------------------------------------------
  // SUBMIT HANDLERS
  // ----------------------------------------------------
  const handleCheckTask1 = () => {
    const pairs: { word: string; ruleId: string }[] = challenge.data.pairs;
    let allCorrect = true;
    for (const p of pairs) {
      if (pairsMap[p.word] !== p.ruleId) {
        allCorrect = false;
        break;
      }
    }

    setIsSubmitted(true);
    if (allCorrect) {
      setIsSuccess(true);
      soundManager.playBonusFanfare();
      triggerConfetti();
    } else {
      setIsSuccess(false);
      soundManager.playWrong();
    }
  };

  const handleCheckTask2 = () => {
    const words: { id: string; isError: boolean }[] = challenge.data.words;
    const errorIds = words.filter((w) => w.isError).map((w) => w.id);
    
    // Check if user selected exactly the 3 error words
    const allErrorsFound =
      errorIds.length === selectedWordIds.length &&
      errorIds.every((id) => selectedWordIds.includes(id));

    setIsSubmitted(true);
    if (allErrorsFound) {
      setIsSuccess(true);
      soundManager.playBonusFanfare();
      triggerConfetti();
    } else {
      setIsSuccess(false);
      soundManager.playWrong();
    }
  };

  const handleCheckTask3 = () => {
    const statements: { id: string; isTrue: boolean }[] = challenge.data.statements;
    let allCorrect = true;
    for (const s of statements) {
      if (tfAnswers[s.id] !== s.isTrue) {
        allCorrect = false;
        break;
      }
    }

    setIsSubmitted(true);
    if (allCorrect) {
      setIsSuccess(true);
      soundManager.playBonusFanfare();
      triggerConfetti();
    } else {
      setIsSuccess(false);
      soundManager.playWrong();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border-2 border-amber-300 shadow-xl p-5 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-amber-400 text-slate-900 rounded-2xl shadow-xs font-black">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Mesterfeladat
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                +10 pontért
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {challenge.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          A feladat leírása:
        </p>
        <p>{challenge.description}</p>
      </div>

      {/* ==================================================== */}
      {/* TASK TYPE 1: SORT RULES / PAIR MATCHING */}
      {/* ==================================================== */}
      {challenge.taskType === 'sort_rules' && (
        <div className="space-y-6">
          {/* Step 1: Available Words */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              1. Kattints egy szóra:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {challenge.data.pairs.map((p: any) => {
                const isSelected = selectedWord === p.word;
                const isPaired = !!pairsMap[p.word];

                return (
                  <button
                    key={p.word}
                    disabled={isSubmitted}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedWord(p.word);
                    }}
                    className={`p-3 rounded-xl border text-center font-bold text-sm sm:text-base transition-all ${
                      isSelected
                        ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md scale-105 ring-2 ring-amber-300'
                        : isPaired
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{p.word}</span>
                    {isPaired && (
                      <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                        ✓ Hozzárendelve
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Target Rules */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              2. Majd kattints a hozzá tartozó törvényre:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.data.pairs.map((p: any) => {
                // Find which word is currently mapped to this ruleId
                const assignedWord = Object.keys(pairsMap).find((w) => pairsMap[w] === p.ruleId);

                return (
                  <div
                    key={p.ruleId}
                    onClick={() => {
                      if (isSubmitted || !selectedWord) return;
                      soundManager.playClick();
                      setPairsMap((prev) => ({
                        ...prev,
                        [selectedWord]: p.ruleId,
                      }));
                      setSelectedWord(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      assignedWord
                        ? 'bg-indigo-50 border-indigo-300'
                        : selectedWord
                        ? 'bg-amber-50/50 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      {p.ruleLabel}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Hozzárendelt szó:</span>
                      {assignedWord ? (
                        <span className="font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-2xs">
                          {assignedWord}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Kattints a párosításhoz</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action button */}
          {!isSubmitted && (
            <div className="flex justify-end">
              <button
                disabled={Object.keys(pairsMap).length < 4}
                onClick={handleCheckTask1}
                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                  Object.keys(pairsMap).length === 4
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Párosítások ellenőrzése (+10 pont)</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TASK TYPE 2: SENTENCE ERROR HUNTER */}
      {/* ==================================================== */}
      {challenge.taskType === 'sentence_correction' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-4">
              🕵️ Nyomozási terület (Kattints a 3 hibás szóra):
            </span>
            <div className="flex flex-wrap gap-2 text-base sm:text-lg font-medium leading-loose">
              {challenge.data.words.map((w: any) => {
                const isSelected = selectedWordIds.includes(w.id);

                return (
                  <button
                    key={w.id}
                    disabled={isSubmitted}
                    onClick={() => {
                      if (isSubmitted) return;
                      soundManager.playClick();
                      if (isSelected) {
                        setSelectedWordIds((prev) => prev.filter((id) => id !== w.id));
                      } else {
                        if (selectedWordIds.length < 3) {
                          setSelectedWordIds((prev) => [...prev, w.id]);
                        }
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                      isSelected
                        ? 'bg-amber-400 border-amber-400 text-slate-950 font-black shadow-md scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    {w.text}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Kijelölt hibák száma:</span>
              <span className="font-bold text-amber-400 text-sm">
                {selectedWordIds.length} / 3 szó
              </span>
            </div>
          </div>

          {/* Action button */}
          {!isSubmitted && (
            <div className="flex justify-end">
              <button
                disabled={selectedWordIds.length !== 3}
                onClick={handleCheckTask2}
                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                  selectedWordIds.length === 3
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Nyomozás lezárása (+10 pont)</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TASK TYPE 3: TRUE / FALSE RIDDLE MATCH */}
      {/* ==================================================== */}
      {challenge.taskType === 'riddle_match' && (
        <div className="space-y-4">
          <div className="space-y-3">
            {challenge.data.statements.map((st: any) => {
              const currentVal = tfAnswers[st.id];

              return (
                <div
                  key={st.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {st.text}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      disabled={isSubmitted}
                      onClick={() => {
                        soundManager.playClick();
                        setTfAnswers((prev) => ({ ...prev, [st.id]: true }));
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        currentVal === true
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50'
                      }`}
                    >
                      IGAZ
                    </button>
                    <button
                      disabled={isSubmitted}
                      onClick={() => {
                        soundManager.playClick();
                        setTfAnswers((prev) => ({ ...prev, [st.id]: false }));
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        currentVal === false
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-rose-50'
                      }`}
                    >
                      HAMIS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          {!isSubmitted && (
            <div className="flex justify-end pt-2">
              <button
                disabled={Object.keys(tfAnswers).length < 4}
                onClick={handleCheckTask3}
                className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all ${
                  Object.keys(tfAnswers).length === 4
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg cursor-pointer hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Állítások ellenőrzése (+10 pont)</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* SUBMISSION FEEDBACK BANNER */}
      {/* ==================================================== */}
      {isSubmitted && (
        <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={`p-5 rounded-2xl border flex items-start gap-4 ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-950'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="mt-1 shrink-0">
              {isSuccess ? (
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Check className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <X className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black">
                  {isSuccess
                    ? '🎉 FANTASZTIKUS SIKER! (+10 BÓNUSZPONT)'
                    : 'KÖZEL VOLTÁL! (0 BÓNUSZPONT)'}
                </h4>
              </div>
              <p className="leading-relaxed font-medium">{challenge.explanation}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                soundManager.playClick();
                onComplete(isSuccess ? 10 : 0);
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Tovább a következő részre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
