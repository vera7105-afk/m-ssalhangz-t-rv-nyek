export type TaskPart = 'quiz' | 'spelling' | 'oddoneout';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  part: TaskPart;
  title: string;
  subtitle?: string;
  prompt: string;
  word?: string; // target word if applicable, e.g. "barátság"
  pronunciation?: string; // e.g. "[baráccság]"
  castleFloor?: number; // 1, 2, or 3
  castleLevelName?: string; // e.g. "1. Szint: Varázskert & Kastélykapu"
  storySnippet?: string; // Context from Tündérszép Ilona és Árgyélus
  ruleCategory?: 
    | 'teljes_irasban_jelolt'
    | 'teljes_irasban_jeloletlen'
    | 'reszleges_zongesseg'
    | 'reszleges_kepzes_helye'
    | 'osszeolvadas'
    | 'rovidules'
    | 'kieses'
    | 'vegyes';
  options: QuestionOption[];
  explanation: string;
  hint?: string;
  // For Part 2 (Spelling)
  spellingContext?: string; // Sentence with blank
  spellingChoices?: string[];
  // For Part 3 (Odd One Out)
  oddReason?: string; // Explanation of why the chosen one is odd
}

export interface BonusChallenge {
  id: number;
  afterQuestionNumber: number;
  castleFloor: number;
  castleLevelName: string;
  title: string;
  subtitle: string;
  points: number; // 10 points
  description: string;
  taskType: 'sort_rules' | 'sentence_correction' | 'riddle_match';
  data: any;
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  timestamp: number;
}

export interface GrammarRuleInfo {
  id: string;
  name: string;
  shortName: string;
  badgeColor: string;
  definition: string;
  formula: string;
  examples: {
    written: string;
    pronounced: string;
    breakdown: string;
  }[];
  tip: string;
}
