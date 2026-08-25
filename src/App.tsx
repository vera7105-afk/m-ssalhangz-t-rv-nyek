import React, { useState } from 'react';
import { QUESTIONS, BONUS_CHALLENGES } from './data/questions';
import { UserAnswer, TaskPart } from './types';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
import { CastleFloorsBanner } from './components/CastleFloorsBanner';
import { QuizQuestion } from './components/QuizQuestion';
import { SpellingQuestion } from './components/SpellingQuestion';
import { OddOneOutQuestion } from './components/OddOneOutQuestion';
import { BonusChallengeModal } from './components/BonusChallengeModal';
import { BonusChallengeGame } from './components/BonusChallengeGame';
import { GrammarGuideModal } from './components/GrammarGuideModal';
import { ResultScreen } from './components/ResultScreen';
import { soundManager } from './utils/audio';

export default function App() {
  // Navigation & Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentSelectedOption, setCurrentSelectedOption] = useState<string | null>(null);

  // Bonus Challenges State
  const [activeBonusChallengeIndex, setActiveBonusChallengeIndex] = useState<number | null>(null);
  const [showBonusPrompt, setShowBonusPrompt] = useState(false);
  const [completedBonusIds, setCompletedBonusIds] = useState<number[]>([]);
  const [bonusPoints, setBonusPoints] = useState(0);

  // App UI State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Current Question
  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // Derive active part
  const currentPart: TaskPart = currentQuestion?.part || 'quiz';

  // Calculate base score
  const baseScore = userAnswers.reduce((acc, curr) => acc + (curr.isCorrect ? 1 : 0), 0);
  const totalScore = baseScore + bonusPoints;

  // Toggle Sound Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Option Selection Handler
  const handleSelectOption = (optionId: string) => {
    if (currentSelectedOption !== null) return; // Prevent changing after selection
    setCurrentSelectedOption(optionId);

    const chosenOption = currentQuestion.options.find((o) => o.id === optionId);
    const isCorrect = !!chosenOption?.isCorrect;

    if (isCorrect) {
      soundManager.playCorrect();
      setStreak((prev) => prev + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }

    const answerRecord: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      pointsAwarded: isCorrect ? 1 : 0,
      timestamp: Date.now(),
    };

    setUserAnswers((prev) => {
      // Replace if answer for this question already existed (e.g. if navigated back) or append
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, answerRecord];
    });
  };

  // Move to next step / check for 10-question bonus milestones
  const handleNext = () => {
    const answeredQuestionNumber = currentQuestion.id;

    // Check if there is a bonus challenge trigger at 10, 20, or 30 questions
    const matchingBonus = BONUS_CHALLENGES.find(
      (b) => b.afterQuestionNumber === answeredQuestionNumber
    );

    if (matchingBonus && !completedBonusIds.includes(matchingBonus.id)) {
      soundManager.playCastleLevelUp();
      setActiveBonusChallengeIndex(matchingBonus.id - 1);
      setShowBonusPrompt(true);
      return;
    }

    // Otherwise proceed to next standard question
    proceedToNextQuestion();
  };

  const proceedToNextQuestion = () => {
    setCurrentSelectedOption(null);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Bonus Prompt Accept -> Open Bonus Game
  const handleAcceptBonus = () => {
    soundManager.playFairySparkle();
    setShowBonusPrompt(false);
  };

  // Bonus Prompt Skip -> Proceed directly to next part
  const handleSkipBonus = () => {
    setShowBonusPrompt(false);
    setActiveBonusChallengeIndex(null);
    proceedToNextQuestion();
  };

  // Bonus Game Completed
  const handleCompleteBonusGame = (earnedPoints: number) => {
    if (activeBonusChallengeIndex !== null) {
      const bonus = BONUS_CHALLENGES[activeBonusChallengeIndex];
      setCompletedBonusIds((prev) => [...prev, bonus.id]);
      if (earnedPoints > 0) {
        setBonusPoints((prev) => prev + earnedPoints);
      }
    }
    setActiveBonusChallengeIndex(null);
    proceedToNextQuestion();
  };

  // Floor navigation handler from CastleFloorsBanner
  const handleSelectFloor = (part: TaskPart, targetIndex: number) => {
    soundManager.playFairySparkle();
    setCurrentQuestionIndex(targetIndex);
    setCurrentSelectedOption(null);
    setActiveBonusChallengeIndex(null);
    setShowBonusPrompt(false);
  };

  // Restart whole game
  const handleRestart = () => {
    soundManager.playFairySparkle();
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentSelectedOption(null);
    setActiveBonusChallengeIndex(null);
    setShowBonusPrompt(false);
    setCompletedBonusIds([]);
    setBonusPoints(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Fairytale Background Aura & Stars */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-900/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <Navbar
        score={totalScore}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={QUESTIONS.length}
        streak={streak}
        currentPart={currentPart}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenGuide={() => setIsGuideOpen(true)}
        bonusPoints={bonusPoints}
      />

      {/* Progress Track (Hidden on Results) */}
      {!isFinished && (
        <ProgressBar
          currentIndex={currentQuestionIndex}
          totalQuestions={QUESTIONS.length}
          completedBonusIds={completedBonusIds}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* VIEW 1: RESULTS & EVALUATION */}
        {isFinished ? (
          <ResultScreen
            userAnswers={userAnswers}
            bonusPoints={bonusPoints}
            completedBonusIds={completedBonusIds}
            onRestart={handleRestart}
          />
        ) : activeBonusChallengeIndex !== null && !showBonusPrompt ? (
          /* VIEW 2: ACTIVE BONUS CHALLENGE GAME */
          <BonusChallengeGame
            challenge={BONUS_CHALLENGES[activeBonusChallengeIndex]}
            onComplete={handleCompleteBonusGame}
          />
        ) : (
          /* VIEW 3: CASTLE 3-FLOOR OVERVIEW + ACTIVE LEVEL QUESTIONS */
          <div className="space-y-6">
            {/* Castle 3-Story Level Navigation Banner */}
            <CastleFloorsBanner
              currentPart={currentPart}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={QUESTIONS.length}
              userScore={totalScore}
              onSelectFloor={handleSelectFloor}
            />

            {/* 1. Szint: Varázskert & Kastélykapu (Kvíz 1-10) */}
            {currentPart === 'quiz' && currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                selectedOptionId={currentSelectedOption}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                isLast={currentQuestionIndex === 9}
              />
            )}

            {/* 2. Emelet: Kristályterem & Aranyalma Palota (Helyesírás 11-20) */}
            {currentPart === 'spelling' && currentQuestion && (
              <SpellingQuestion
                question={currentQuestion}
                selectedOptionId={currentSelectedOption}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                isLast={currentQuestionIndex === 19}
              />
            )}

            {/* 3. Emelet: Toronyszoba & Tündértrón (Kakukktojás & Hibakereső 21-30) */}
            {currentPart === 'oddoneout' && currentQuestion && (
              <OddOneOutQuestion
                question={currentQuestion}
                selectedOptionId={currentSelectedOption}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                isLast={currentQuestionIndex === QUESTIONS.length - 1}
              />
            )}
          </div>
        )}
      </main>

      {/* Bonus Challenge Modal Prompt (After Floor 1: Q10, Floor 2: Q20, Floor 3: Q30) */}
      {activeBonusChallengeIndex !== null && showBonusPrompt && (
        <BonusChallengeModal
          challenge={BONUS_CHALLENGES[activeBonusChallengeIndex]}
          isOpen={showBonusPrompt}
          onAccept={handleAcceptBonus}
          onSkip={handleSkipBonus}
        />
      )}

      {/* Grammar Reference Guide Modal (Tündéri Nyelvtani Kisokos) */}
      <GrammarGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="py-5 border-t border-indigo-950 bg-slate-950/80 backdrop-blur-sm text-center text-xs text-indigo-300/80">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            🏰 Tündérszép Ilona kastélya • Árgyélus vándorútja a varázskastélyban • Mássalhangzótörvények
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playFairySparkle();
                setIsGuideOpen(true);
              }}
              className="text-amber-300 hover:text-amber-200 hover:underline font-bold cursor-pointer"
            >
              📖 Tündér kisokos
            </button>
            <span>•</span>
            <span className="text-slate-400">Jó válasz: +1 pont | Emeleti Bónusz: +10 pont</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
