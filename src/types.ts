/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyItem {
  id: string;
  word: string;
  chineseMeaning: string;
  partOfSpeech: string;
  rawMeaning: string;
  sourcePage: string;
}

export interface LevelData {
  day: number;
  newWords: VocabularyItem[];
  reviewWords: VocabularyItem[];
  quizWords: VocabularyItem[];
}

export interface UserProgress {
  day: number;
  lastScore: number;
  bestScore: number;
  passed: boolean;
  stars: number;
  attemptCount: number;
  correctCount: number;
  wrongCount: number;
  lastPlayedAt: string;
  wrongWords: string[]; // List of words got wrong in the last/best quiz
}

export interface QuizQuestion {
  word: VocabularyItem;
  quizType: "english_to_chinese" | "chinese_to_english" | "spelling";
  options: string[]; // 4 options (Chinese meanings or English words, or empty for spelling)
  correctAnswer: string; // The correct answer (Chinese meaning or English word)
  displayHint?: string; // Hint for spelling questions
}

export interface WrongWordRecord {
  Word: string; // Keep capitalization as requested: Word
  ChineseMeaning: string; // ChineseMeaning
  PartOfSpeech: string; // PartOfSpeech
  quizType: string; // quizType
  userAnswer: string; // userAnswer
  correctAnswer: string; // correctAnswer
}
