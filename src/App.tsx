import React, { useState } from 'react';
import { QUESTIONS, BONUS_CHALLENGES } from './data/questions';
import { UserAnswer, TaskPart } from './types';
import { Navbar } from './components/Navbar';
import { ProgressBar } from './components/ProgressBar';
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

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  // Move to next step / check for 10-question bonus milestones
  const handleNext = () => {
    const answeredQuestionNumber = currentQuestion.id;

    // Check if there is a bonus challenge trigger at 10, 20, or 30 questions
    const matchingBonus = BONUS_CHALLENGES.find(
      (b) => b.afterQuestionNumber === answeredQuestionNumber
    );

    if (matchingBonus && !completedBonusIds.includes(matchingBonus.id)) {
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

  // Restart whole game
  const handleRestart = () => {
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

  // Jump directly to a part (optional quick navigation)
  const handleJumpToPart = (part: TaskPart) => {
    let targetIndex = 0;
    if (part === 'quiz') targetIndex = 0;
    if (part === 'spelling') targetIndex = 10;
    if (part === 'oddoneout') targetIndex = 20;

    setCurrentQuestionIndex(targetIndex);
    setCurrentSelectedOption(null);
    setActiveBonusChallengeIndex(null);
    setShowBonusPrompt(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
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
          /* VIEW 3: STANDARD QUESTIONS BY PART */
          <div className="space-y-6">
            {/* Part 1: Quiz (1-10) */}
            {currentPart === 'quiz' && currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                selectedOptionId={currentSelectedOption}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                isLast={currentQuestionIndex === 9}
              />
            )}

            {/* Part 2: Spelling (11-20) */}
            {currentPart === 'spelling' && currentQuestion && (
              <SpellingQuestion
                question={currentQuestion}
                selectedOptionId={currentSelectedOption}
                onSelectOption={handleSelectOption}
                onNext={handleNext}
                isLast={currentQuestionIndex === 19}
              />
            )}

            {/* Part 3: Odd One Out & Error Hunt (21-30) */}
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

      {/* Bonus Challenge Modal Prompt (After Q10, Q20, Q30) */}
      {activeBonusChallengeIndex !== null && showBonusPrompt && (
        <BonusChallengeModal
          challenge={BONUS_CHALLENGES[activeBonusChallengeIndex]}
          isOpen={showBonusPrompt}
          onAccept={handleAcceptBonus}
          onSkip={handleSkipBonus}
        />
      )}

      {/* Grammar Reference Guide Modal (Puskás Kisokos) */}
      <GrammarGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            🎓 Magyar Nyelvtan 5. osztály • Mássalhangzótörvények Interaktív Gyakorló
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-indigo-600 hover:underline font-semibold"
            >
              📖 Nyelvtani Kisokos
            </button>
            <span>•</span>
            <span className="text-slate-400">1 jó válasz = +1 pont | Bónusz = +10 pont</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
