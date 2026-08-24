import React, { useState } from 'react';
import { X, BookOpen, Volume2, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { CONSONANT_PAIRS, UNPAIRED_CONSONANTS, GRAMMAR_RULES } from '../data/grammarRules';

interface GrammarGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarGuideModal: React.FC<GrammarGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pairs' | 'rules' | 'quicktips'>('pairs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Puskás Kisokos – Mássalhangzótörvények
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                5. osztályos tananyag gyors áttekintése és példák
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pairs')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pairs'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔊 1. Zöngés-zöngétlen párok
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📚 2. A törvények részletesen
          </button>
          <button
            onClick={() => setActiveTab('quicktips')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'quicktips'
                ? 'border-indigo-600 text-indigo-600 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💡 3. Aranyszabályok & Trükkök
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm flex-1">
          {/* TAB 1: PAIRS */}
          {activeTab === 'pairs' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs sm:text-sm">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Hogyan próbáld ki?</strong> Tedd a kezed a gégédre (a torkodra)! Ha ejtéskor rezeg, akkor <strong>zöngés</strong> (pl. b, d, g, z). Ha nem rezeg, csak a levegő súrol, akkor <strong>zöngétlen</strong> (pl. p, t, k, sz)!
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  A 9 hivatalos zöngésségi pár:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CONSONANT_PAIRS.map((pair, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                          {pair.voiced}
                        </span>
                        <span className="text-slate-400 font-semibold">↔</span>
                        <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-xs">
                          {pair.unvoiced}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        zöngés / zöngétlen
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unpaired consonants */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-800 text-xs mb-2">
                  Páratlan mássalhangzók:
                </h4>
                <div className="space-y-2 text-xs">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-blue-700">Mindig zöngés (nincs párja):</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                      {UNPAIRED_CONSONANTS.voicedOnly.join(', ')}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-orange-700">Mindig zöngétlen (nincs párja):</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
                      {UNPAIRED_CONSONANTS.unvoicedOnly.join(', ')}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {GRAMMAR_RULES.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {rule.name}
                    </h4>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${rule.badgeColor}`}>
                      {rule.shortName}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">
                    {rule.definition}
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 font-mono text-xs font-semibold text-indigo-900">
                    Képlet: {rule.formula}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {rule.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-800">{ex.written}</strong>
                          <span className="text-indigo-600 font-semibold">{ex.pronounced}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{ex.breakdown}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Tipp:</strong> {rule.tip}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: QUICK TIPS */}
          {activeTab === 'quicktips' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-indigo-950 space-y-3">
                <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Hogyan döntsd el villámgyorsan a dolgozatban?
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      <strong>Nézd meg a két találkozó mássalhangzót!</strong> Például: <em>vasgolyó</em> → találkozik az <strong>s</strong> és <strong>g</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      <strong>Ha P vagy B előtt N áll:</strong> Mindig <em>képzés helye szerinti hasonulás</em> (színpad → [szímpad], különben → [külömben])!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      <strong>Ha egy teljesen új, harmadik hang jön létre:</strong> Akkor az <em>összeolvadás</em> (pl. t+s = [ccs] barátság, t+j = [tty] látja)!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      <strong>Ha le is írjuk duplán a betűt:</strong> Az <em>írásban jelölt teljes hasonulás</em> (pl. azzal, virággal, késsel, moss)!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      5
                    </span>
                    <span>
                      <strong>Ha 3 mássalhangzó torlódik és a középső eltűnik:</strong> Az <em>mássalhangzó-kiesés</em> (pl. mondta → [monta], küldte → [külte])!
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-xs active:scale-95"
          >
            Értem, mehet a gyakorlás!
          </button>
        </div>
      </div>
    </div>
  );
};
