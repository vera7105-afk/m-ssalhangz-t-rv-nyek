import React, { useState, useEffect } from 'react';
import { QUESTIONS, BONUS_CHALLENGES } from './data/questions';
import { UserAnswer, TaskPart, UserProfile } from './types';
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
import { UserProfileModal } from './components/UserProfileModal';
import { LoginModal } from './components/LoginModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { soundManager } from './utils/audio';
import {
  getSavedUserProfile,
  syncUserProfileToSupabase,
  saveTaskScoreToSupabase,
  saveBonusScoreToSupabase,
  saveGameSessionToSupabase,
  getStudentLocalProgress,
  saveStudentLocalProgress,
  resetStudentLocalProgress,
  fetchUserProfile,
  isSupabaseConfigured,
} from './utils/supabase';

// Default initial guest profile if none saved
const DEFAULT_STUDENT_PROFILE: UserProfile = {
  username: 'argyelus.peter',
  displayName: 'Kovács Péter (Árgyélus)',
  role: 'diak',
  grade: '5.a',
  totalScore: 0,
  quizScore: 0,
  spellingScore: 0,
  oddoneoutScore: 0,
  bonusScore: 0,
  tasksCompleted: 0,
};

export default function App() {
  // User Profile & Login State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    return getSavedUserProfile() || DEFAULT_STUDENT_PROFILE;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(isSupabaseConfigured);

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

  // Initialize & sync user profile on startup
  useEffect(() => {
    setIsDbConnected(isSupabaseConfigured());
    const saved = getSavedUserProfile();
    if (saved) {
      loadStudentSession(saved.username);
      syncUserProfileToSupabase(saved);
    }
  }, []);

  // Load a student's session & saved progress
  const loadStudentSession = async (uname: string) => {
    const local = getStudentLocalProgress(uname);
    setUserAnswers(local.userAnswers || []);
    setCompletedBonusIds(local.completedBonusIds || []);
    setCurrentQuestionIndex(local.currentQuestionIndex || 0);
    setCurrentSelectedOption(null);
    setActiveBonusChallengeIndex(null);
    setShowBonusPrompt(false);
    setIsFinished(false);

    // Calculate bonus points from completed IDs
    const bPoints = (local.completedBonusIds || []).length * 10;
    setBonusPoints(bPoints);

    // Try to fetch latest profile from Supabase
    const cloud = await fetchUserProfile(uname);
    if (cloud) {
      setUserProfile(cloud);
    }
  };

  // Login / Switch Student handler
  const handleLoginSuccess = async (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoginModalOpen(false);
    await loadStudentSession(profile.username);
  };

  // Update profile handler
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    syncUserProfileToSupabase(updated);
  };

  const handleConfigChanged = () => {
    setIsDbConnected(isSupabaseConfigured());
  };

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
    const awardedPoints = isCorrect ? 1 : 0;

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
      pointsAwarded: awardedPoints,
      timestamp: Date.now(),
    };

    const newAnswers = [...userAnswers.filter((a) => a.questionId !== currentQuestion.id), answerRecord];
    setUserAnswers(newAnswers);

    // Save individual student progress locally
    saveStudentLocalProgress(
      userProfile.username,
      newAnswers,
      completedBonusIds,
      currentQuestionIndex
    );

    // Save individual task score to Supabase database
    saveTaskScoreToSupabase({
      username: userProfile.username,
      user_role: userProfile.role,
      question_id: currentQuestion.id,
      task_part: currentQuestion.part,
      castle_floor: currentQuestion.castleFloor || 1,
      question_title: currentQuestion.title || currentQuestion.prompt,
      selected_option: chosenOption?.text || optionId,
      is_correct: isCorrect,
      points_awarded: awardedPoints,
    });

    // Update & sync user profile total score
    const newQuizScore = newAnswers.filter((a) => a.questionId <= 10 && a.isCorrect).length;
    const newSpellingScore = newAnswers.filter((a) => a.questionId > 10 && a.questionId <= 20 && a.isCorrect).length;
    const newOddScore = newAnswers.filter((a) => a.questionId > 20 && a.isCorrect).length;
    const newTotalScore = newQuizScore + newSpellingScore + newOddScore + bonusPoints;

    const updatedProfile: UserProfile = {
      ...userProfile,
      totalScore: newTotalScore,
      quizScore: newQuizScore,
      spellingScore: newSpellingScore,
      oddoneoutScore: newOddScore,
      bonusScore: bonusPoints,
      tasksCompleted: newAnswers.length,
    };
    setUserProfile(updatedProfile);
    syncUserProfileToSupabase(updatedProfile);
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
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      saveStudentLocalProgress(
        userProfile.username,
        userAnswers,
        completedBonusIds,
        nextIdx
      );
    } else {
      setIsFinished(true);

      // Save complete session to Supabase
      const finalQuiz = userAnswers.filter((a) => a.questionId <= 10 && a.isCorrect).length;
      const finalSpelling = userAnswers.filter((a) => a.questionId > 10 && a.questionId <= 20 && a.isCorrect).length;
      const finalOdd = userAnswers.filter((a) => a.questionId > 20 && a.isCorrect).length;
      const finalTotal = finalQuiz + finalSpelling + finalOdd + bonusPoints;

      saveGameSessionToSupabase(
        userProfile.username,
        finalTotal,
        finalQuiz,
        finalSpelling,
        finalOdd,
        bonusPoints,
        userAnswers.filter((a) => a.isCorrect).length,
        completedBonusIds.length
      );
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
    let updatedBonusPoints = bonusPoints;
    let updatedBonusIds = completedBonusIds;

    if (activeBonusChallengeIndex !== null) {
      const bonus = BONUS_CHALLENGES[activeBonusChallengeIndex];
      updatedBonusIds = [...completedBonusIds, bonus.id];
      setCompletedBonusIds(updatedBonusIds);

      if (earnedPoints > 0) {
        updatedBonusPoints = bonusPoints + earnedPoints;
        setBonusPoints(updatedBonusPoints);
      }

      // Save bonus challenge score to Supabase
      saveBonusScoreToSupabase(
        userProfile.username,
        bonus.id,
        bonus.castleFloor,
        bonus.title,
        earnedPoints
      );

      // Save student progress locally
      saveStudentLocalProgress(
        userProfile.username,
        userAnswers,
        updatedBonusIds,
        currentQuestionIndex
      );

      // Sync user profile with bonus points
      const updatedProfile: UserProfile = {
        ...userProfile,
        bonusScore: updatedBonusPoints,
        totalScore: baseScore + updatedBonusPoints,
      };
      setUserProfile(updatedProfile);
      syncUserProfileToSupabase(updatedProfile);
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

    saveStudentLocalProgress(
      userProfile.username,
      userAnswers,
      completedBonusIds,
      targetIndex
    );
  };

  // Restart whole game for current student
  const handleRestart = () => {
    soundManager.playFairySparkle();
    resetStudentLocalProgress(userProfile.username);
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
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenDatabaseSettings={() => setIsDbSettingsOpen(true)}
        isDbConnected={isDbConnected}
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
            userProfile={userProfile}
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

      {/* Login & Student Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenDatabaseSettings={() => {
          setIsLoginModalOpen(false);
          setIsDbSettingsOpen(true);
        }}
        currentProfile={userProfile}
        allowClose={true}
      />

      {/* User Profile & Role Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
        onSwitchUser={() => {
          setIsProfileModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onOpenDatabaseSettings={() => {
          setIsProfileModalOpen(false);
          setIsDbSettingsOpen(true);
        }}
        isDbConnected={isDbConnected}
      />

      {/* Teacher Dashboard Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        currentUsername={userProfile.username}
      />

      {/* Supabase Database Settings & SQL Schema Modal */}
      <SupabaseConfigModal
        isOpen={isDbSettingsOpen}
        onClose={() => setIsDbSettingsOpen(false)}
        onConfigChanged={handleConfigChanged}
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
                setIsLoginModalOpen(true);
              }}
              className="text-amber-400 hover:text-amber-300 hover:underline font-bold cursor-pointer"
            >
              👤 Diák bejelentkezés
            </button>
            <span>•</span>
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
            <button
              onClick={() => {
                soundManager.playFairySparkle();
                setIsDbSettingsOpen(true);
              }}
              className="text-indigo-300 hover:text-white hover:underline cursor-pointer"
            >
              🗄️ Supabase SQL
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

