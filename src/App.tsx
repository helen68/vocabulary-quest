/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { 
  BookOpen, 
  Award, 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  RotateCcw, 
  Trash2, 
  Lock, 
  Unlock, 
  Star, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  HelpCircle, 
  RefreshCw, 
  FileSpreadsheet, 
  AlertTriangle, 
  Smile, 
  ThumbsUp, 
  Check,
  Home,
  MapPin,
  Sparkles,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VocabularyItem, LevelData, UserProgress, QuizQuestion, WrongWordRecord } from "./types";
import { fallbackVocabulary } from "./fallbackData";

export default function App() {
  // --- Game States ---
  const [view, setView] = useState<"home" | "level-map" | "study" | "quiz" | "result" | "records">("home");
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [progress, setProgress] = useState<Record<number, UserProgress>>({});
  const [currentDay, setCurrentDay] = useState<number>(1);
  
  // Loading & validation states
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<"csv" | "fallback">("fallback");
  const [validationInfo, setValidationInfo] = useState<{
    isValid: boolean;
    message: string;
    duplicateCount: number;
    emptyWordCount: number;
    emptyMeaningCount: number;
    uniqueCount: number;
  } | null>(null);
  const [levelStats, setLevelStats] = useState<{
    totalWords: number;
    uniqueWords: number;
    createdLevels: number;
    usedNewWords: number;
    categoryCounts: Record<string, number>;
  } | null>(null);

  // Flashcard states
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"new" | "review">("new");

  // Quiz states
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [wrongAnswersList, setWrongAnswersList] = useState<WrongWordRecord[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [spellingInput, setSpellingInput] = useState<string>("");

  // Last Quiz Result (For result screen)
  const [lastQuizResult, setLastQuizResult] = useState<{
    score: number;
    stars: number;
    passed: boolean;
    correctCount: number;
    wrongCount: number;
    wrongWords: WrongWordRecord[];
    typeStats?: Record<string, { total: number; correct: number }>;
  } | null>(null);

  // --- Initial Load & Setup ---
  useEffect(() => {
    loadVocabulary();
    loadProgress();
  }, []);

  // --- Core Game Functions ---

  /**
   * 1. loadVocabulary()
   * Attempts to fetch vocabulary_full.csv, falls back to local resource if fails
   */
  const loadVocabulary = async () => {
    setLoading(true);
    try {
      // Try to fetch from public folder or project root
      const response = await fetch("/vocabulary_full.csv");
      if (!response.ok) {
        throw new Error("無法取得 CSV 檔案，將啟用備用資料集");
      }
      const csvText = await response.text();
      const parsedItems = parseCSV(csvText);
      const validation = validateVocabulary(parsedItems);
      
      setValidationInfo(validation);

      if (validation.isValid) {
        setVocabulary(validation.cleanedItems);
        const built = buildLevels(validation.cleanedItems);
        setLevels(built);
        setDataSource("csv");
      } else {
        console.warn("CSV 資料未通過驗證: " + validation.message);
        useFallbackData();
      }
    } catch (error) {
      console.log("正在啟用內建備用單字資料集:", error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Safe Fallback Activation
   */
  const useFallbackData = () => {
    const validation = validateVocabulary(fallbackVocabulary);
    setVocabulary(validation.cleanedItems);
    const built = buildLevels(validation.cleanedItems);
    setLevels(built);
    setDataSource("fallback");
    setValidationInfo({
      isValid: true,
      message: "已啟用內建 310 個精選國中生英文單字庫，運作一切正常！",
      duplicateCount: validation.duplicateCount,
      emptyWordCount: validation.emptyWordCount,
      emptyMeaningCount: validation.emptyMeaningCount,
      uniqueCount: validation.uniqueCount
    });
  };

  /**
   * 2. parseCSV()
   * Formats raw CSV text into VocabularyItem objects
   */
  const parseCSV = (csvText: string): VocabularyItem[] => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];
    
    // Parse header to find column indices
    const headers = lines[0].split(',').map(h => h.trim());
    const idIdx = headers.indexOf("ID");
    const wordIdx = headers.indexOf("Word");
    const chineseIdx = headers.indexOf("ChineseMeaning");
    const posIdx = headers.indexOf("PartOfSpeech");
    const rawIdx = headers.indexOf("RawMeaning");
    const pageIdx = headers.indexOf("SourcePage");

    const items: VocabularyItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quoted commas inside standard CSV lines safely
      const cols: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      cols.push(current);

      const getVal = (idx: number, fallback: string = "") => {
        if (idx === -1 || idx >= cols.length) return fallback;
        return cols[idx].trim().replace(/^"|"$/g, "");
      };

      const word = getVal(wordIdx);
      if (word) {
        items.push({
          id: getVal(idIdx, String(i)),
          word: word,
          chineseMeaning: getVal(chineseIdx, getVal(rawIdx, "未命名")),
          partOfSpeech: getVal(posIdx, "n"),
          rawMeaning: getVal(rawIdx, getVal(chineseIdx)),
          sourcePage: getVal(pageIdx, "1")
        });
      }
    }
    return items;
  };

  /**
   * 3. validateVocabulary()
   * Runs quality control on loaded CSV records
   */
  const validateVocabulary = (items: VocabularyItem[]) => {
    let emptyWordCount = 0;
    let emptyMeaningCount = 0;
    const wordMap = new Map<string, VocabularyItem>();
    let duplicateCount = 0;

    for (const item of items) {
      const trimmedWord = item.word.trim();
      const trimmedMeaning = item.chineseMeaning.trim();

      if (!trimmedWord) {
        emptyWordCount++;
        continue;
      }
      if (!trimmedMeaning) {
        emptyMeaningCount++;
        continue;
      }

      // Normalized lower-case trim comparison
      const key = trimmedWord.toLowerCase();
      if (wordMap.has(key)) {
        duplicateCount++;
      } else {
        wordMap.set(key, {
          ...item,
          word: trimmedWord,
          chineseMeaning: trimmedMeaning
        });
      }
    }

    const cleanedItems = Array.from(wordMap.values());
    const uniqueCount = cleanedItems.length;
    const isValid = uniqueCount >= 305 && emptyWordCount === 0 && emptyMeaningCount === 0;

    let message = "";
    if (uniqueCount < 305) {
      message = `單字資料尚未準備完成，請確認 vocabulary_full.csv 是否存在、格式是否正確，且至少包含 305 個不重複單字（目前僅有 ${uniqueCount} 個）。`;
    } else if (emptyWordCount > 0 || emptyMeaningCount > 0) {
      message = `資料庫發現空白欄位：包含 ${emptyWordCount} 個空白單字與 ${emptyMeaningCount} 個空白中文解釋。`;
    } else {
      message = "單字資料驗證成功，完美載入！";
    }

    return {
      isValid,
      message,
      duplicateCount,
      emptyWordCount,
      emptyMeaningCount,
      uniqueCount,
      cleanedItems
    };
  };

  /**
   * Seeded Shuffle algorithm using a robust LCG / Mulberry32 generator
   */
  const seededShuffle = <T,>(array: T[], seed: string): T[] => {
    let h = 179424673;
    for (let i = 0; i < seed.length; i++) {
      h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }

    const lcg = () => {
      let z = (h += 0x6D2B79F5);
      z = Math.imul(z ^ (z >>> 15), z | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };

    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(lcg() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  };

  /**
   * 4. buildLevels()
   * Assigns 305 unique words across 60 days using layered mixed random logic
   */
  const buildLevels = (items: VocabularyItem[]): LevelData[] => {
    const list: LevelData[] = [];
    
    // Categorization helper
    const getCategory = (item: VocabularyItem): "noun" | "verb" | "adj" | "adv" | "phrase" | "other" => {
      const word = item.word.trim();
      const pos = item.partOfSpeech.toLowerCase().trim();

      // 1. Phrase group: PartOfSpeech contains '片' or Word has space
      if (pos.includes("片") || word.includes(" ")) {
        return "phrase";
      }
      // 2. Adjective group: PartOfSpeech contains 'adj'
      if (pos.includes("adj")) {
        return "adj";
      }
      // 3. Adverb group: PartOfSpeech contains 'adv'
      if (pos.includes("adv")) {
        return "adv";
      }
      // 4. Verb group: PartOfSpeech contains 'v', 'vt', 'vi'
      if (pos.includes("vi") || pos.includes("vt") || pos === "v" || pos.startsWith("v") || pos === "vi." || pos === "vt.") {
        return "verb";
      }
      // 5. Noun group: PartOfSpeech contains 'n' (excluding conj)
      if (pos.includes("n") && !pos.includes("conj")) {
        return "noun";
      }
      // 6. Other group
      return "other";
    };

    // Group items
    const nounGroup: VocabularyItem[] = [];
    const verbGroup: VocabularyItem[] = [];
    const adjectiveGroup: VocabularyItem[] = [];
    const adverbGroup: VocabularyItem[] = [];
    const phraseGroup: VocabularyItem[] = [];
    const otherGroup: VocabularyItem[] = [];

    items.forEach(item => {
      const cat = getCategory(item);
      if (cat === "phrase") phraseGroup.push(item);
      else if (cat === "adj") adjectiveGroup.push(item);
      else if (cat === "adv") adverbGroup.push(item);
      else if (cat === "verb") verbGroup.push(item);
      else if (cat === "noun") nounGroup.push(item);
      else otherGroup.push(item);
    });

    // Seeded shuffle each group with fixed seeds
    const nouns = seededShuffle(nounGroup, "vocabulary-quest-noun-seed");
    const verbs = seededShuffle(verbGroup, "vocabulary-quest-verb-seed");
    const adjectives = seededShuffle(adjectiveGroup, "vocabulary-quest-adj-seed");
    const adverbs = seededShuffle(adverbGroup, "vocabulary-quest-adv-seed");
    const phrases = seededShuffle(phraseGroup, "vocabulary-quest-phrase-seed");
    const others = seededShuffle(otherGroup, "vocabulary-quest-other-seed");

    // Convert shuffled groups to queues
    const nounQueue = [...nouns];
    const verbQueue = [...verbs];
    const adjQueue = [...adjectives];
    const phraseQueue = [...phrases];
    const advQueue = [...adverbs];
    const otherQueue = [...others];

    // Master backup pool containing all items shuffled with a seed
    const backupPool = seededShuffle(items, "vocabulary-quest-backup-seed");

    const usedIds = new Set<string>();

    const pullFromQueue = (queue: VocabularyItem[]): VocabularyItem | null => {
      while (queue.length > 0) {
        const item = queue.shift()!;
        if (!usedIds.has(item.id)) {
          usedIds.add(item.id);
          return item;
        }
      }
      return null;
    };

    const pullFallback = (): VocabularyItem => {
      // First try otherQueue
      const fromOther = pullFromQueue(otherQueue);
      if (fromOther) return fromOther;

      // Try backupPool
      while (backupPool.length > 0) {
        const item = backupPool.shift()!;
        if (!usedIds.has(item.id)) {
          usedIds.add(item.id);
          return item;
        }
      }
      throw new Error("單字庫中的不重複單字不足以分配至 60 個關卡！");
    };

    const categoryCounts: Record<string, number> = {
      noun: 0,
      verb: 0,
      adj: 0,
      adv: 0,
      phrase: 0,
      other: 0
    };

    const recordCategoryUse = (item: VocabularyItem) => {
      const cat = getCategory(item);
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    };

    const dayNewWords: Record<number, VocabularyItem[]> = {};

    // Assign words for all 60 days
    for (let day = 1; day <= 60; day++) {
      const newWords: VocabularyItem[] = [];

      if (day === 1) {
        // Day 1: 10 new words
        // Nouns: 3
        for (let i = 0; i < 3; i++) {
          const item = pullFromQueue(nounQueue) || pullFallback();
          newWords.push(item);
          recordCategoryUse(item);
        }
        // Verbs: 2
        for (let i = 0; i < 2; i++) {
          const item = pullFromQueue(verbQueue) || pullFallback();
          newWords.push(item);
          recordCategoryUse(item);
        }
        // Adjectives: 2
        for (let i = 0; i < 2; i++) {
          const item = pullFromQueue(adjQueue) || pullFallback();
          newWords.push(item);
          recordCategoryUse(item);
        }
        // Adverb or other: 1
        let advOrOther = pullFromQueue(advQueue);
        if (!advOrOther) advOrOther = pullFromQueue(otherQueue);
        if (!advOrOther) advOrOther = pullFallback();
        newWords.push(advOrOther);
        recordCategoryUse(advOrOther);
        // Phrases: 2
        for (let i = 0; i < 2; i++) {
          const item = pullFromQueue(phraseQueue) || pullFallback();
          newWords.push(item);
          recordCategoryUse(item);
        }
      } else {
        // Day 2-60: 5 new words
        // Noun: 1
        const n = pullFromQueue(nounQueue) || pullFallback();
        newWords.push(n);
        recordCategoryUse(n);

        // Verb: 1
        const v = pullFromQueue(verbQueue) || pullFallback();
        newWords.push(v);
        recordCategoryUse(v);

        // Adjective: 1
        const adj = pullFromQueue(adjQueue) || pullFallback();
        newWords.push(adj);
        recordCategoryUse(adj);

        // Phrase: 1
        const ph = pullFromQueue(phraseQueue) || pullFallback();
        newWords.push(ph);
        recordCategoryUse(ph);

        // Other or Adverb: 1
        let otherOrAdv = pullFromQueue(otherQueue);
        if (!otherOrAdv) otherOrAdv = pullFromQueue(advQueue);
        if (!otherOrAdv) otherOrAdv = pullFallback();
        newWords.push(otherOrAdv);
        recordCategoryUse(otherOrAdv);
      }

      dayNewWords[day] = newWords;
    }

    // Build levels including review words (same review logic)
    for (let day = 1; day <= 60; day++) {
      const newWords = dayNewWords[day];

      // Review words:
      // Day 1: []
      // Day 2: Day 1's 10 words
      // Day 3+: Day (N-1)'s 5 words + Day (N-2)'s 5 words = 10 words
      let reviewWords: VocabularyItem[] = [];
      if (day === 2) {
        reviewWords = dayNewWords[1];
      } else if (day > 2) {
        const prevDayNew = dayNewWords[day - 1];
        const beforePrevDayNew = dayNewWords[day - 2];
        reviewWords = [...prevDayNew, ...beforePrevDayNew];
      }

      const quizWords = [...newWords, ...reviewWords];

      list.push({
        day,
        newWords,
        reviewWords,
        quizWords
      });
    }

    // Output check results to console
    console.log("=== 資料檢查與關卡分配數據 ===");
    console.log(`總單字數: ${items.length}`);
    console.log(`不重複單字數: ${items.length}`);
    console.log(`已建立關卡數: ${list.length}`);
    console.log(`已使用新單字數: ${usedIds.size}`);
    console.log("各詞性使用數量:", categoryCounts);

    // Save level statistics asynchronously to avoid updating state during render
    setTimeout(() => {
      setLevelStats({
        totalWords: items.length,
        uniqueWords: items.length,
        createdLevels: list.length,
        usedNewWords: usedIds.size,
        categoryCounts
      });
    }, 0);

    return list;
  };

  /**
   * 5. loadProgress()
   * Synchronizes localStorage progress records
   */
  const loadProgress = () => {
    const saved = localStorage.getItem("vocabulary_quest_progress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("無法解析學習進度紀錄，將重新初始化", e);
        setProgress({});
      }
    } else {
      setProgress({});
    }
  };

  /**
   * 6. saveQuizResult()
   * Updates state & localStorage with quiz score
   */
  const saveQuizResult = (day: number, resultScore: number, correct: number, wrong: number, wrongWords: WrongWordRecord[]) => {
    const passed = resultScore >= 80;
    
    // Star allocation
    let stars = 0;
    if (resultScore === 100) stars = 3;
    else if (resultScore >= 90) stars = 2;
    else if (resultScore >= 80) stars = 1;

    const prevRecord = progress[day];
    const bestScore = prevRecord ? Math.max(prevRecord.bestScore, resultScore) : resultScore;
    const isNowPassed = prevRecord ? (prevRecord.passed || passed) : passed;
    const bestStars = prevRecord ? Math.max(prevRecord.stars, stars) : stars;

    const record: UserProgress = {
      day,
      lastScore: resultScore,
      bestScore: bestScore,
      passed: isNowPassed,
      stars: bestStars,
      attemptCount: prevRecord ? prevRecord.attemptCount + 1 : 1,
      correctCount: correct,
      wrongCount: wrong,
      lastPlayedAt: new Date().toLocaleString("zh-TW"),
      wrongWords: wrongWords.map(w => w.Word)
    };

    const newProgress = {
      ...progress,
      [day]: record
    };

    setProgress(newProgress);
    localStorage.setItem("vocabulary_quest_progress", JSON.stringify(newProgress));

    // Calculate type stats for each question type
    const typeStats: Record<string, { total: number; correct: number }> = {
      english_to_chinese: { total: 0, correct: 0 },
      chinese_to_english: { total: 0, correct: 0 },
      spelling: { total: 0, correct: 0 }
    };

    quizQuestions.forEach(q => {
      if (typeStats[q.quizType]) {
        typeStats[q.quizType].total += 1;
      }
    });

    Object.keys(typeStats).forEach(type => {
      const wrongOfThisType = wrongWords.filter(w => w.quizType === type).length;
      typeStats[type].correct = typeStats[type].total - wrongOfThisType;
    });

    // Prepare quiz results object for result view
    setLastQuizResult({
      score: resultScore,
      stars,
      passed,
      correctCount: correct,
      wrongCount: wrong,
      wrongWords,
      typeStats
    });

    // Rule Nine: Save accumulated wrongWords to localStorage under key "wrongWords"
    const saved = localStorage.getItem("wrongWords");
    let accumulatedWrongs: WrongWordRecord[] = [];
    if (saved) {
      try {
        accumulatedWrongs = JSON.parse(saved);
        if (!Array.isArray(accumulatedWrongs)) accumulatedWrongs = [];
      } catch (e) {
        console.error("Failed to parse wrongWords from localStorage", e);
      }
    }

    wrongWords.forEach(newW => {
      accumulatedWrongs = accumulatedWrongs.filter(
        item => !(item.Word.toLowerCase() === newW.Word.toLowerCase() && item.quizType === newW.quizType)
      );
      accumulatedWrongs.push(newW);
    });

    localStorage.setItem("wrongWords", JSON.stringify(accumulatedWrongs));
  };

  /**
   * 7. clearProgress()
   * Wipes learning records with confirmation
   */
  const clearProgress = () => {
    const confirmClear = window.confirm("⚠️ 確定要清除所有關卡背誦與測驗紀錄嗎？此動作將無法復原！");
    if (confirmClear) {
      setProgress({});
      localStorage.removeItem("vocabulary_quest_progress");
      alert("🧹 學習紀錄已成功歸零，準備重新出發吧！");
      setView("level-map");
    }
  };

  /**
   * 8. generateQuizQuestions()
   * Outlines multiple choice questions with hybrid quiz types
   */
  const getQuizTypesDistribution = (N: number): string[] => {
    const types: string[] = [];
    if (N <= 0) return types;
    
    let spellingCount = 0;
    let c2eCount = 0;
    let e2cCount = 0;

    if (N >= 5) {
      spellingCount = Math.max(1, Math.round(N * 0.2));
      c2eCount = Math.max(1, Math.round(N * 0.3));
      e2cCount = N - spellingCount - c2eCount;
      if (e2cCount < 1) {
        e2cCount = 1;
        if (c2eCount > 1) c2eCount--;
        else if (spellingCount > 1) spellingCount--;
      }
    } else {
      if (N === 1) {
        e2cCount = 1;
      } else if (N === 2) {
        e2cCount = 1;
        c2eCount = 1;
      } else if (N === 3) {
        e2cCount = 2;
        c2eCount = 1;
      } else if (N === 4) {
        e2cCount = 2;
        c2eCount = 2;
      }
    }

    for (let i = 0; i < e2cCount; i++) types.push("english_to_chinese");
    for (let i = 0; i < c2eCount; i++) types.push("chinese_to_english");
    for (let i = 0; i < spellingCount; i++) types.push("spelling");

    return types;
  };

  const generateSpellingHint = (word: string): string => {
    const cleanWord = word.trim().replace(/\s+/g, " ");
    const parts = cleanWord.split(" ");
    if (parts.length === 1) {
      const w = parts[0];
      if (w.length <= 1) return w;
      return w[0] + "_".repeat(w.length - 1);
    } else {
      return parts.map((w, idx) => {
        if (idx === 0) {
          if (w.length <= 1) return w;
          return w[0] + "_".repeat(w.length - 1);
        } else {
          return "_".repeat(w.length);
        }
      }).join(" ");
    }
  };

  const compareSpelling = (userAns: string, correctAns: string): boolean => {
    const normalize = (str: string): string => {
      return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };
    return normalize(userAns) === normalize(correctAns);
  };

  const generateQuizQuestions = (words: VocabularyItem[]): QuizQuestion[] => {
    const N = words.length;
    const types = getQuizTypesDistribution(N);
    const shuffledTypes = shuffleArray(types);

    return words.map((word, index) => {
      const quizType = shuffledTypes[index] as "english_to_chinese" | "chinese_to_english" | "spelling";

      if (quizType === "english_to_chinese") {
        const correct = word.chineseMeaning;
        const filteredDb = vocabulary.filter(
          v => v.word.toLowerCase() !== word.word.toLowerCase() && 
               v.chineseMeaning !== word.chineseMeaning
        );
        
        const uniqueIncorrectMeanings: string[] = [];
        const shuffledDb = shuffleArray([...filteredDb]);
        for (const item of shuffledDb) {
          if (uniqueIncorrectMeanings.length >= 3) break;
          if (!uniqueIncorrectMeanings.includes(item.chineseMeaning)) {
            uniqueIncorrectMeanings.push(item.chineseMeaning);
          }
        }
        
        const options = shuffleArray([correct, ...uniqueIncorrectMeanings]);
        return {
          word,
          quizType,
          options,
          correctAnswer: correct
        };
      } else if (quizType === "chinese_to_english") {
        const correct = word.word;
        const filteredDb = vocabulary.filter(
          v => v.word.toLowerCase() !== word.word.toLowerCase()
        );
        
        const uniqueIncorrectWords: string[] = [];
        const shuffledDb = shuffleArray([...filteredDb]);
        for (const item of shuffledDb) {
          if (uniqueIncorrectWords.length >= 3) break;
          if (!uniqueIncorrectWords.includes(item.word)) {
            uniqueIncorrectWords.push(item.word);
          }
        }
        
        const options = shuffleArray([correct, ...uniqueIncorrectWords]);
        return {
          word,
          quizType,
          options,
          correctAnswer: correct
        };
      } else {
        const correct = word.word;
        const displayHint = generateSpellingHint(correct);
        return {
          word,
          quizType,
          options: [],
          correctAnswer: correct,
          displayHint
        };
      }
    });
  };

  /**
   * 9. shuffleArray()
   * Fisher-Yates shuffle helper
   */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  /**
   * Text To Speech (Audio helper)
   */
  const speakWord = (wordText: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // slightly slower for junior high kids to capture syllable phonetics
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Page Navigation Handlers ---

  const handleStartGame = () => {
    setView("level-map");
  };

  const handleSelectLevel = (day: number) => {
    // Check if level is unlocked: Day 1 is always unlocked, Day N is unlocked if Day N-1 is passed
    const isUnlocked = day === 1 || progress[day - 1]?.passed;

    if (!isUnlocked) {
      alert("🔒 請先通過前一關，達到 80 分以上，再來挑戰這一關喔！加油！");
      return;
    }

    setCurrentDay(day);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    
    const levelData = levels.find(l => l.day === day);
    // If there are review words, default to review tab first, else new words
    if (levelData && levelData.reviewWords.length > 0) {
      setActiveTab("review");
    } else {
      setActiveTab("new");
    }
    
    setView("study");
  };

  const handleStartQuiz = () => {
    const levelData = levels.find(l => l.day === currentDay);
    if (!levelData) return;

    const quizList = generateQuizQuestions(levelData.quizWords);
    setQuizQuestions(shuffleArray(quizList));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setWrongAnswersList([]);
    setCorrectAnswersCount(0);
    setSpellingInput("");
    setView("quiz");
  };

  const handleAnswerQuestion = (answer: string) => {
    if (hasAnswered) return;
    setSelectedAnswer(answer);
    setHasAnswered(true);

    const currentQ = quizQuestions[currentQuestionIndex];
    let isCorrect = false;
    if (currentQ.quizType === "spelling") {
      isCorrect = compareSpelling(answer, currentQ.correctAnswer);
    } else {
      isCorrect = answer === currentQ.correctAnswer;
    }

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      const wrongRecord: WrongWordRecord = {
        Word: currentQ.word.word,
        ChineseMeaning: currentQ.word.chineseMeaning,
        PartOfSpeech: currentQ.word.partOfSpeech,
        quizType: currentQ.quizType,
        userAnswer: answer,
        correctAnswer: currentQ.correctAnswer
      };
      setWrongAnswersList(prev => [...prev, wrongRecord]);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setSpellingInput("");
    if (nextIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      const totalQuestions = quizQuestions.length;
      const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
      saveQuizResult(currentDay, finalScore, correctAnswersCount, totalQuestions - correctAnswersCount, wrongAnswersList);
      setView("result");
    }
  };

  const handleRestartStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    const levelData = levels.find(l => l.day === currentDay);
    if (levelData && levelData.reviewWords.length > 0) {
      setActiveTab("review");
    } else {
      setActiveTab("new");
    }
    setView("study");
  };

  // Calculate high level progress parameters
  const totalStarsEarned = useMemo(() => {
    return (Object.values(progress) as UserProgress[]).reduce((acc, p) => acc + p.stars, 0);
  }, [progress]);

  const passedLevelsCount = useMemo(() => {
    return (Object.values(progress) as UserProgress[]).filter(p => p.passed).length;
  }, [progress]);

  const progressPercentage = useMemo(() => {
    return Math.round((passedLevelsCount / 60) * 100);
  }, [passedLevelsCount]);

  // --- Sub-components / View Renderers ---

  /**
   * Home Screen View
   */
  const renderHome = () => {
    return (
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 text-center">
        {/* Cute Mascot Header */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="bg-amber-400 text-slate-800 bubbly-border p-6 rounded-3xl bubbly-shadow max-w-md mx-auto">
              <span className="text-5xl block mb-2 animate-bounce-slow">🚀🎒</span>
              <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                單字冒險 60 天
              </h1>
              <div className="text-xl md:text-2xl font-display font-bold text-slate-800 mt-2 tracking-wide uppercase">
                Vocabulary Quest
              </div>
            </div>
            {/* Playful star decorations */}
            <div className="absolute -top-4 -right-4 text-4xl animate-wiggle">⭐</div>
            <div className="absolute -bottom-2 -left-6 text-4xl animate-bounce-slow">✨</div>
          </div>
        </motion.div>

        {/* Cute cartoon description box */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white bubbly-border p-6 rounded-2xl bubbly-shadow max-w-2xl w-full mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-amber-500 fill-amber-500" />
            冒險行前指南
          </h2>
          <p className="text-slate-600 text-left leading-relaxed text-base">
            歡迎來到單字冒險世界！這是一個專為國中生打造的英文單字背誦樂園。
            在 60 天的旅程中，你將攜手可愛的冒險小夥伴，每天背誦與測驗英文單字，一邊闖關，一邊收穫代表榮譽的奇幻星星！
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex gap-3 items-start">
              <span className="text-2xl">📅</span>
              <div>
                <h4 className="font-bold text-slate-800">循序漸進關卡</h4>
                <p className="text-xs text-slate-600">Day 1 包含 10 個核心單字，後續每天新增 5 個，總共 305 個常用不重複國中單字！</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex gap-3 items-start">
              <span className="text-2xl">🔄</span>
              <div>
                <h4 className="font-bold text-slate-800">滾動溫故知新</h4>
                <p className="text-xs text-slate-600">每天都會貼心準備前一天的 10 個單字進行複習，保證背得深、記得牢！</p>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex gap-3 items-start">
              <span className="text-2xl">⭐</span>
              <div>
                <h4 className="font-bold text-slate-800">星星與認證</h4>
                <p className="text-xs text-slate-600">測驗達到 80 分以上即算通關並解鎖下一天！滿分還能榮獲閃亮的三顆星獎章！</p>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex gap-3 items-start">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-bold text-slate-800">完整的學習履歷</h4>
                <p className="text-xs text-slate-600">自動記錄你的答題狀況與最容易答錯的生字，方便你在考前快速精準複習！</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buttons Action */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
        >
          <button 
            id="start-game-btn"
            onClick={handleStartGame}
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xl font-bold font-display py-4 px-8 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_rgba(30,41,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(30,41,59,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="fill-current w-6 h-6" />
            開始單字冒險
          </button>
          
          <button 
            id="view-records-btn"
            onClick={() => setView("records")}
            className="flex-1 bg-sky-400 hover:bg-sky-300 text-slate-900 text-xl font-bold font-display py-4 px-8 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_rgba(30,41,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(30,41,59,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            學習成果紀錄
          </button>
        </motion.div>

        {/* Status indicator / Data validation badge */}
        <div className="mt-12 text-sm bg-slate-100 border border-slate-200 text-slate-500 py-2 px-4 rounded-full flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dataSource === "csv" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${dataSource === "csv" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </span>
          <span>資料載入來源：</span>
          <strong className="text-slate-700">
            {dataSource === "csv" ? "📂 vocabulary_full.csv" : "💡 內建備用單字庫"}
          </strong>
          {validationInfo && (
            <span className="text-slate-400">| 不重複單字：{validationInfo.uniqueCount} 個</span>
          )}
        </div>

        {levelStats && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white bubbly-border p-6 rounded-2xl bubbly-shadow max-w-2xl w-full mt-6 text-left"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xl">📊</span>
              單字庫數據與關卡分配報告 (Level Generation Data Validation)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">總單字數</div>
                <div className="text-xl font-black text-slate-800">{levelStats.totalWords}</div>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <div className="text-xs text-slate-500 font-medium">不重複單字數</div>
                <div className="text-xl font-black text-emerald-700">{levelStats.uniqueWords}</div>
              </div>
              <div className="bg-sky-50 p-2 rounded-xl border border-sky-200">
                <div className="text-xs text-slate-500 font-medium">已建立關卡數</div>
                <div className="text-xl font-black text-sky-700">{levelStats.createdLevels} 關</div>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                <div className="text-xs text-slate-500 font-medium">已使用新單字數</div>
                <div className="text-xl font-black text-amber-700">{levelStats.usedNewWords}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                關卡新單字詞性混合分配統計：
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-indigo-600 block">名詞 (n)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.noun || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-rose-600 block">動詞 (v)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.verb || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-emerald-600 block">形容詞 (adj)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.adj || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-amber-600 block">副詞 (adv)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.adv || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-cyan-600 block">片語 (phrase)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.phrase || 0}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-150 shadow-sm">
                  <span className="font-bold text-purple-600 block">其他 (other)</span>
                  <span className="font-bold text-slate-700 text-sm">{levelStats.categoryCounts.other || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  /**
   * Level Map Screen View (60 Levels grid with locks, stars, status)
   */
  const renderLevelMap = () => {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white bubbly-border p-5 rounded-2xl bubbly-shadow mb-8">
          <div className="flex items-center gap-4">
            <button 
              id="map-back-home-btn"
              onClick={() => setView("home")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-3 rounded-xl border-2 border-slate-800 transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-5 h-5" />
              返回首頁
            </button>
            <div>
              <h2 className="text-2xl font-black font-display text-slate-800 flex items-center gap-2">
                <MapPin className="text-rose-500 fill-rose-500" />
                冒險地圖
              </h2>
              <p className="text-sm text-slate-500">60 天單字挑戰大長征</p>
            </div>
          </div>

          {/* Quick stats badges */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-amber-100 text-amber-800 font-bold px-4 py-2 rounded-xl border-2 border-amber-300 flex items-center gap-2">
              <Star className="fill-amber-400 text-amber-500 w-5 h-5 animate-bounce-slow" />
              <span>已獲星星 {totalStarsEarned} 顆</span>
            </div>
            
            <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl border-2 border-emerald-300 flex items-center gap-2">
              <Trophy className="text-emerald-500 w-5 h-5" />
              <span>進度 {passedLevelsCount} / 60 關 ({progressPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="bg-white bubbly-border p-4 rounded-xl bubbly-shadow-sm mb-8">
          <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
            <span>🎒 冒險總進度</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-5 bubbly-border-sm overflow-hidden p-0.5">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Instruction Info */}
        <div className="bg-sky-50 text-sky-800 rounded-xl p-4 border-2 border-sky-200 mb-8 flex gap-3 items-start">
          <Info className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">關卡解鎖規則：</h4>
            <p className="text-sm leading-relaxed">
              第一關預設開放挑戰。只要在任何一關的測驗中榮獲 <strong className="text-rose-600 font-black">80 分以上</strong> 即可通過該關，並自動解鎖解鎖下一關！
              你可以重複點擊任何已解鎖的關卡進行無限複習與重新挑戰測驗。
            </p>
          </div>
        </div>

        {/* 60 levels grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4 mb-12">
          {Array.from({ length: 60 }).map((_, idx) => {
            const day = idx + 1;
            const record = progress[day];
            const isFirst = day === 1;
            
            // Unlocked if it is day 1 OR the previous day was passed
            const isUnlocked = isFirst || (progress[day - 1]?.passed === true);
            const isPassed = record?.passed;
            const stars = record?.stars || 0;
            const score = record?.bestScore;

            // Animated bubble cartoon class
            return (
              <motion.button
                id={`level-btn-${day}`}
                key={day}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => handleSelectLevel(day)}
                className={`
                  relative h-24 rounded-2xl border-4 bubbly-shadow-sm flex flex-col items-center justify-between py-2 px-1 transition-all cursor-pointer select-none
                  ${isPassed 
                    ? "bg-emerald-400 border-emerald-900 text-emerald-950" 
                    : isUnlocked 
                      ? "bg-amber-300 border-amber-900 text-amber-950 animate-bounce-slow" 
                      : "bg-slate-200 border-slate-400 text-slate-400 opacity-60 cursor-not-allowed"
                  }
                `}
                style={{
                  animationDelay: `${idx * 0.05}s`
                }}
              >
                {/* Level Title */}
                <div className="text-xs font-black uppercase tracking-wider font-display">
                  Day {day}
                </div>

                {/* Center Icon/Status */}
                <div className="my-auto flex items-center justify-center">
                  {isPassed ? (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 3 }).map((_, sIdx) => (
                        <Star 
                          key={sIdx} 
                          className={`w-3.5 h-3.5 ${sIdx < stars ? "fill-yellow-300 text-yellow-600" : "text-emerald-800 opacity-30"}`} 
                        />
                      ))}
                    </div>
                  ) : isUnlocked ? (
                    <span className="text-sm font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full text-center bubbly-border-sm">
                      挑戰
                    </span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Score or Status label */}
                <div className="text-[10px] font-bold">
                  {isPassed ? `最佳: ${score}分` : isUnlocked ? "可挑戰" : "尚未解鎖"}
                </div>

                {/* Visual Connector dots (concept only, stylish top right banner) */}
                {isPassed && (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 border border-slate-800 rounded-full p-0.5">
                    <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Word Study (Flashcards) Screen View
   */
  const renderStudyPage = () => {
    const levelData = levels.find(l => l.day === currentDay);
    if (!levelData) return null;

    const hasReviewWords = levelData.reviewWords.length > 0;
    const activeWords = activeTab === "review" ? levelData.reviewWords : levelData.newWords;
    const currentWord = activeWords[currentCardIndex];

    const nextCard = () => {
      setIsFlipped(false);
      setTimeout(() => {
        if (currentCardIndex < activeWords.length - 1) {
          setCurrentCardIndex(prev => prev + 1);
        }
      }, 100);
    };

    const prevCard = () => {
      setIsFlipped(false);
      setTimeout(() => {
        if (currentCardIndex > 0) {
          setCurrentCardIndex(prev => prev - 1);
        }
      }, 100);
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Navigation header */}
        <div className="flex justify-between items-center bg-white bubbly-border p-4 rounded-xl bubbly-shadow-sm mb-6">
          <button 
            id="study-back-map-btn"
            onClick={() => setView("level-map")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl border-2 border-slate-800 transition-all cursor-pointer flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            返回地圖
          </button>
          
          <h2 className="text-xl font-display font-black text-slate-800">
            Day {currentDay} 任務解密
          </h2>

          <div className="w-10"></div> {/* spacer */}
        </div>

        {/* Tab Selection if review words exist */}
        {hasReviewWords && (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200 rounded-xl border-2 border-slate-800 mb-6 font-display font-bold">
            <button
              id="study-tab-review"
              onClick={() => {
                setActiveTab("review");
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`py-2 px-4 rounded-lg text-center transition-all cursor-pointer ${activeTab === "review" ? "bg-sky-400 text-slate-900 shadow-sm border-2 border-slate-800" : "text-slate-600 hover:text-slate-900"}`}
            >
              🔄 溫故回顧 ({levelData.reviewWords.length} 字)
            </button>
            <button
              id="study-tab-new"
              onClick={() => {
                setActiveTab("new");
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`py-2 px-4 rounded-lg text-center transition-all cursor-pointer ${activeTab === "new" ? "bg-amber-400 text-slate-900 shadow-sm border-2 border-slate-800" : "text-slate-600 hover:text-slate-900"}`}
            >
              🌟 今日新字 ({levelData.newWords.length} 字)
            </button>
          </div>
        )}

        {/* Info card of current mode */}
        <div className={`p-3 rounded-xl border-2 border-slate-800 text-center mb-6 font-bold ${activeTab === "review" ? "bg-sky-50 text-sky-800" : "bg-amber-50 text-amber-800"}`}>
          {activeTab === "review" ? (
            <span>💡 正在複習前一天的單字，先熟練它們，打好基礎！</span>
          ) : (
            <span>🚀 正在背誦今日全新單字，完成後即可發起挑戰測驗！</span>
          )}
        </div>

        {/* Interactive Flashcard */}
        {currentWord ? (
          <div className="flex flex-col items-center mb-8">
            <div className="text-sm font-bold text-slate-500 mb-2">
              進度：{currentCardIndex + 1} / {activeWords.length} 字
            </div>

            {/* The 3D Flip Card */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-md h-72 perspective-1000 cursor-pointer mb-6 group"
            >
              <div className={`w-full h-full duration-500 preserve-3d relative ${isFlipped ? "rotate-y-180" : ""}`}>
                
                {/* Front Side of Card (English word) */}
                <div className="absolute inset-0 bg-white bubbly-border rounded-3xl bubbly-shadow p-6 flex flex-col justify-between items-center backface-hidden">
                  <div className="w-full flex justify-between items-center text-slate-400 text-xs">
                    <span className="bg-slate-100 py-1 px-2.5 rounded-full font-mono">ID: {currentWord.id}</span>
                    <span className="text-amber-500 font-bold">點擊卡片翻看解釋 👆</span>
                    <span className="bg-slate-100 py-1 px-2.5 rounded-full font-mono">頁碼: p.{currentWord.sourcePage}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2 my-auto text-center">
                    <h3 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-wide select-text">
                      {currentWord.word}
                    </h3>
                    <span className="text-sm bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full border border-indigo-200">
                      詞性: [{currentWord.partOfSpeech}]
                    </span>
                  </div>

                  {/* Audio Speaker */}
                  <button
                    id="audio-speaker-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card flipping
                      speakWord(currentWord.word);
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black p-3.5 rounded-full border-2 border-slate-800 bubbly-shadow-sm flex items-center gap-1 animate-pulse"
                    title="英文發音"
                  >
                    <Volume2 className="w-6 h-6 stroke-[3]" />
                    <span className="text-xs">發音</span>
                  </button>
                </div>

                {/* Back Side of Card (Chinese meaning) */}
                <div className="absolute inset-0 bg-amber-100 bubbly-border rounded-3xl bubbly-shadow p-6 flex flex-col justify-between items-center backface-hidden rotate-y-180">
                  <div className="w-full flex justify-between items-center text-slate-400 text-xs">
                    <span className="bg-amber-50 py-1 px-2.5 rounded-full font-mono text-slate-600">ID: {currentWord.id}</span>
                    <span className="text-amber-700 font-bold">已翻面 🔄</span>
                    <span className="bg-amber-50 py-1 px-2.5 rounded-full font-mono text-slate-600">頁碼: p.{currentWord.sourcePage}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-3 my-auto text-center">
                    <span className="text-lg bg-amber-200 text-amber-900 font-bold px-3.5 py-1 rounded-full border border-amber-300">
                      [{currentWord.partOfSpeech}] 詞性
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                      {currentWord.chineseMeaning}
                    </h3>
                    {currentWord.rawMeaning && currentWord.rawMeaning !== currentWord.chineseMeaning && (
                      <p className="text-xs text-slate-500 max-w-xs italic">
                        原義: {currentWord.rawMeaning}
                      </p>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-600 bg-amber-200 py-1 px-3 rounded-full">
                    英文：{currentWord.word}
                  </div>
                </div>

              </div>
            </div>

            {/* Flashcard Controller Buttons */}
            <div className="flex items-center gap-4 w-full max-w-xs">
              <button
                id="study-prev-card-btn"
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className={`flex-1 bg-slate-100 text-slate-800 py-3.5 px-4 rounded-xl border-2 border-slate-800 font-bold flex items-center justify-center gap-1 transition-all ${currentCardIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-200 bubbly-shadow-sm cursor-pointer"}`}
              >
                <ChevronLeft className="w-5 h-5" />
                上一張
              </button>

              <button
                id="study-next-card-btn"
                onClick={nextCard}
                disabled={currentCardIndex === activeWords.length - 1}
                className={`flex-1 bg-slate-100 text-slate-800 py-3.5 px-4 rounded-xl border-2 border-slate-800 font-bold flex items-center justify-center gap-1 transition-all ${currentCardIndex === activeWords.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-200 bubbly-shadow-sm cursor-pointer"}`}
              >
                下一張
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 font-bold bg-white bubbly-border rounded-xl">
            暫無單字資料
          </div>
        )}

        {/* Start Quiz section */}
        <div className="flex flex-col items-center mt-12 pt-8 border-t-2 border-dashed border-slate-300">
          <div className="text-center max-w-md mb-6">
            <h4 className="text-lg font-black text-slate-800 mb-1">準備好接受今天的冒險試煉了嗎？</h4>
            <p className="text-sm text-slate-500">
              測驗題目將結合<strong className="text-amber-600">今日新單字</strong>與<strong className="text-sky-600">前日複習單字</strong>，共 {levelData.quizWords.length} 題，答對達 80% 以上即算成功！
            </p>
          </div>

          <button
            id="start-level-quiz-btn"
            onClick={handleStartQuiz}
            className="w-full max-w-sm bg-brand-green bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xl font-bold py-4 px-8 rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_rgba(30,41,59,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(30,41,59,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2 animate-bounce-slow"
          >
            <Zap className="fill-yellow-300 stroke-slate-900 text-yellow-300 w-6 h-6" />
            發起 Day {currentDay} 測驗
          </button>
        </div>
      </div>
    );
  };

  /**
   * Interactive Quiz Page Screen View
   */
  const renderQuizPage = () => {
    if (quizQuestions.length === 0) return null;

    const currentQ = quizQuestions[currentQuestionIndex];
    const isAnswerChecked = hasAnswered;
    const isCorrect = selectedAnswer !== null && (
      currentQ.quizType === "spelling"
        ? compareSpelling(selectedAnswer, currentQ.correctAnswer)
        : selectedAnswer === currentQ.correctAnswer
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress dashboard header */}
        <div className="bg-white bubbly-border p-4 rounded-xl bubbly-shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-800">Day {currentDay} 試煉中</span>
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
              第 {currentQuestionIndex + 1} / {quizQuestions.length} 題
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-1/3 bg-slate-200 h-3 rounded-full border border-slate-700 overflow-hidden">
            <div 
              className="bg-sky-400 h-full"
              style={{ width: `${((currentQuestionIndex) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="text-sm font-bold text-slate-600">
            答對: <span className="text-emerald-500 font-extrabold">{correctAnswersCount}</span> 題
          </div>
        </div>

        {/* Quiz word card */}
        <div className="bg-white bubbly-border p-8 rounded-3xl bubbly-shadow mb-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-9xl text-slate-50 opacity-5 select-none font-display">?</div>

          {currentQ.quizType === "english_to_chinese" && (
            <>
              <span className="text-sm bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full border border-indigo-200">
                📖 選擇題：看英文選中文解釋
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mt-4 mb-2 tracking-wide select-text">
                {currentQ.word.word}
              </h2>
            </>
          )}

          {currentQ.quizType === "chinese_to_english" && (
            <>
              <span className="text-sm bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full border border-teal-200">
                📖 選擇題：看中文選英文單字
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-2 leading-tight select-text">
                {currentQ.word.chineseMeaning}
              </h2>
            </>
          )}

          {currentQ.quizType === "spelling" && (
            <>
              <span className="text-sm bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full border border-rose-200">
                ✍️ 拼字題：根據中文拼出英文單字
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-2 leading-tight select-text">
                {currentQ.word.chineseMeaning}
              </h2>
            </>
          )}

          <p className="text-slate-400 font-bold mb-4 font-mono">
            [{currentQ.word.partOfSpeech}] 詞性
          </p>

          {/* Show speaker button immediately only for english_to_chinese, for others show only after answering to avoid cheating */}
          {(currentQ.quizType === "english_to_chinese" || isAnswerChecked) ? (
            <button
              id="quiz-speaker-btn"
              onClick={() => speakWord(currentQ.word.word)}
              className="mx-auto bg-amber-50 hover:bg-amber-100 border border-slate-400 text-slate-700 py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-500 stroke-[3.5]" />
              聽發音 (Pronounce)
            </button>
          ) : (
            <div className="text-xs text-slate-400 italic font-medium">回答後將開放發音聆聽 🎧</div>
          )}
        </div>

        {/* Input area or Options list */}
        {currentQ.quizType === "spelling" ? (
          <div className="bg-white bubbly-border p-6 rounded-2xl bubbly-shadow mb-8 text-center max-w-xl mx-auto">
            {/* Spelling hint */}
            <div className="mb-4">
              <span className="text-xs text-slate-400 font-black block mb-1 uppercase tracking-widest">
                單字結構提示 (Word Structure Hint)
              </span>
              <div className="inline-block bg-slate-100 py-3 px-6 rounded-2xl border-2 border-slate-300 font-mono text-xl md:text-2xl tracking-widest text-slate-800 font-bold select-none">
                {currentQ.displayHint}
              </div>
              <div className="text-xs text-slate-500 font-bold mt-1.5">
                單字長度：{currentQ.word.word.length} 個字元
              </div>
            </div>

            {/* Input field */}
            <div className="w-full max-w-md mx-auto flex flex-col gap-3">
              <input
                id="spelling-input-field"
                type="text"
                value={spellingInput}
                onChange={(e) => setSpellingInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isAnswerChecked && spellingInput.trim() !== "") {
                    handleAnswerQuestion(spellingInput.trim());
                  }
                }}
                disabled={isAnswerChecked}
                autoFocus
                placeholder="在此輸入答案..."
                className="w-full p-4 text-center border-4 border-slate-900 rounded-2xl text-lg md:text-xl font-bold font-mono bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-300 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
              />
              {!isAnswerChecked && (
                <button
                  id="submit-spelling-btn"
                  onClick={() => handleAnswerQuestion(spellingInput.trim())}
                  disabled={spellingInput.trim() === ""}
                  className={`w-full py-3.5 px-6 rounded-2xl border-4 border-slate-950 font-black text-base md:text-lg transition-all ${
                    spellingInput.trim() === ""
                      ? "bg-slate-200 text-slate-400 border-slate-400 cursor-not-allowed"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-900 bubbly-shadow-sm cursor-pointer active:translate-y-0.5"
                  }`}
                >
                  確認答案 (Submit)
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Choices Grid for multiple choice questions */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer;
              
              let btnStyle = "bg-white border-slate-800 hover:bg-slate-50 text-slate-800 hover:translate-y-[-2px] bubbly-shadow-sm";
              let stateIcon = null;

              if (isAnswerChecked) {
                if (isCorrectOption) {
                  btnStyle = "bg-emerald-100 border-emerald-900 text-emerald-950 font-black scale-[1.01]";
                  stateIcon = <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 flex-shrink-0" />;
                } else if (isSelected) {
                  btnStyle = "bg-rose-100 border-rose-900 text-rose-950 font-black scale-[0.99]";
                  stateIcon = <XCircle className="w-6 h-6 text-rose-500 fill-rose-100 flex-shrink-0" />;
                } else {
                  btnStyle = "bg-slate-50 border-slate-300 text-slate-400 opacity-50 cursor-not-allowed";
                }
              }

              return (
                <button
                  id={`quiz-option-${idx}`}
                  key={idx}
                  onClick={() => handleAnswerQuestion(option)}
                  disabled={isAnswerChecked}
                  className={`
                    w-full p-5 rounded-2xl border-4 flex justify-between items-center text-left font-bold text-lg transition-all cursor-pointer select-none
                    ${btnStyle}
                  `}
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-slate-400 font-mono text-sm border-2 border-slate-300 bg-slate-100 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-tight">{option}</span>
                  </div>
                  {stateIcon}
                </button>
              );
            })}
          </div>
        )}

        {/* Answer verification alert box */}
        <AnimatePresence>
          {isAnswerChecked && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`p-5 rounded-2xl border-4 bubbly-shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${isCorrect ? "bg-emerald-100 border-emerald-900 text-emerald-900" : "bg-rose-100 border-rose-900 text-rose-900"}`}
            >
              <div className="flex gap-3 items-center text-center sm:text-left w-full">
                <span className="text-3xl">{isCorrect ? "🎉" : "😭"}</span>
                <div className="flex-grow">
                  <h4 className="font-extrabold text-lg">
                    {isCorrect ? "回答正確！太棒了！" : currentQ.quizType === "spelling" ? "差一點！" : "哎呀，答錯囉！"}
                  </h4>
                  <div className="text-xs opacity-90 mt-0.5">
                    {currentQ.quizType === "spelling" ? (
                      !isCorrect ? (
                        <p className="text-sm">
                          正確答案是：<strong className="underline text-lg ml-1 font-mono text-slate-900">{currentQ.correctAnswer}</strong>
                          {selectedAnswer && (
                            <span className="block text-xs text-rose-600 mt-1">
                              你的輸入是：<span className="font-mono line-through">{selectedAnswer}</span>
                            </span>
                          )}
                        </p>
                      ) : (
                        <p>恭喜拼對了！答案：<strong className="underline font-mono ml-1">{currentQ.correctAnswer}</strong></p>
                      )
                    ) : (
                      <p>
                        <strong>{currentQ.word.word}</strong> 的中文解釋是：
                        <strong className="underline text-sm ml-1">{currentQ.word.chineseMeaning}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                id="quiz-next-question-btn"
                onClick={handleNextQuestion}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl bubbly-shadow-sm transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
              >
                {currentQuestionIndex + 1 === quizQuestions.length ? "看測驗結果" : "下一題"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  /**
   * Quiz Result Score View Screen
   */
  const renderResultPage = () => {
    if (!lastQuizResult) return null;

    const { score, stars, passed, correctCount, wrongCount, wrongWords, typeStats } = lastQuizResult;

    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white bubbly-border p-8 rounded-3xl bubbly-shadow max-w-2xl mx-auto mb-8"
        >
          {/* Passed badges / Stars illustration */}
          <div className="mb-6">
            {passed ? (
              <div className="relative inline-block">
                <div className="bg-emerald-100 border-4 border-emerald-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 bubbly-shadow-sm">
                  <Trophy className="w-12 h-12 text-emerald-600 animate-bounce-slow" />
                </div>
                <div className="absolute top-16 -right-2 text-3xl">🥳</div>
              </div>
            ) : (
              <div className="bg-slate-100 border-4 border-slate-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 bubbly-shadow-sm">
                <Smile className="w-12 h-12 text-slate-500" />
              </div>
            )}

            <h2 className="text-3xl font-display font-black text-slate-800">
              {passed ? "🎉 恭喜通關！" : "💪 再接再厲！"}
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Day {currentDay} 測驗冒險結束
            </p>
          </div>

          {/* Stars display */}
          {passed && (
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, idx) => {
                const isActive = idx < stars;
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <Star 
                       className={`w-12 h-12 ${isActive ? "fill-yellow-300 text-yellow-600 drop-shadow-md" : "text-slate-200"}`} 
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Score Box */}
          <div className="inline-block bg-slate-900 text-white bubbly-border py-4 px-8 rounded-2xl mb-6">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">測驗成績</div>
            <div className="text-5xl font-black font-mono">
              {score}<span className="text-xl text-slate-400">分</span>
            </div>
          </div>

          {/* Detailed answers stats */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-center">
              <div className="text-2xl font-black">{correctCount}</div>
              <div className="text-xs font-bold">答對題數</div>
            </div>
            <div className="bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-200 text-center">
              <div className="text-2xl font-black">{wrongCount}</div>
              <div className="text-xs font-bold">答錯題數</div>
            </div>
          </div>

          {/* Question Type Accuracy Stats */}
          {typeStats && (
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-6">
              <h3 className="font-extrabold text-slate-700 text-sm mb-3 flex items-center justify-center gap-1.5">
                📊 各題型答對率統計 (Type Breakdown)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(typeStats).map(([type, stats]) => {
                  const s = stats as { total: number; correct: number };
                  let label = "看英選中";
                  let emoji = "📖";
                  let bgStyle = "bg-indigo-50 border-indigo-200 text-indigo-900";
                  if (type === "chinese_to_english") {
                    label = "看中選英";
                    emoji = "📝";
                    bgStyle = "bg-teal-50 border-teal-200 text-teal-900";
                  } else if (type === "spelling") {
                    label = "拼字挑戰";
                    emoji = "✍️";
                    bgStyle = "bg-rose-50 border-rose-200 text-rose-900";
                  }

                  if (s.total === 0) return null;

                  const accuracy = Math.round((s.correct / s.total) * 100);

                  return (
                    <div key={type} className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center ${bgStyle}`}>
                      <span className="text-xs font-bold mb-1">{emoji} {label}</span>
                      <span className="text-lg font-black">{accuracy}%</span>
                      <span className="text-[10px] opacity-75">({s.correct} / {s.total} 題)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Encouragement Text */}
          <p className="text-slate-600 font-bold text-sm bg-slate-50 p-4 rounded-xl border-2 border-slate-200 mb-6 leading-relaxed">
            {passed ? (
              score === 100 
                ? "💯 完美大滿貫！你真的是英文小天才，獲得最高榮譽三顆星！" 
                : "🌟 表現相當傑出！成功奪星，下一關的大門已經為你敞開！"
            ) : (
              "🌱 別灰心！只要達到 80 分即可解鎖下一天，趕快點擊下方「重新練習」將單字卡多看幾遍，再重新測驗挑戰看看！你一定做得到的！"
            )}
          </p>

          {/* Detailed Wrong words list */}
          {wrongWords.length > 0 && (
            <div className="text-left bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 mb-6">
              <h4 className="font-extrabold text-rose-800 flex items-center gap-1.5 mb-3">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                本次答錯的單字與解析 (Let's Review!)
              </h4>
              <div className="flex flex-col gap-3">
                {wrongWords.map((word, wIdx) => {
                  let typeLabel = "看英選中";
                  if (word.quizType === "chinese_to_english") typeLabel = "看中選英";
                  else if (word.quizType === "spelling") typeLabel = "拼字題";

                  return (
                    <div key={wIdx} className="bg-white p-3.5 rounded-xl border border-rose-100 flex flex-col gap-1.5 bubbly-shadow-sm">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                        <div>
                          <span className="font-black text-slate-950 text-base">{word.Word}</span>
                          <span className="text-xs text-slate-500 ml-2 font-mono">[{word.PartOfSpeech}]</span>
                        </div>
                        <span className="text-xs bg-slate-100 font-bold px-2 py-0.5 rounded text-slate-600">
                          {typeLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1">
                        <div>
                          <span className="font-semibold text-slate-500">中文：</span>
                          <span className="font-bold text-slate-800">{word.ChineseMeaning}</span>
                        </div>
                        <div className="text-rose-600">
                          <span className="font-semibold text-slate-500">你的回答：</span>
                          <span className="font-bold line-through">{word.userAnswer || "(未輸入/未作答)"}</span>
                        </div>
                        <div className="text-emerald-600">
                          <span className="font-semibold text-slate-500">正確答案：</span>
                          <span className="font-black underline font-mono">{word.correctAnswer}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Buttons navigation */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto justify-center">
          <button
            id="result-re-study-btn"
            onClick={handleRestartStudy}
            className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold py-3.5 px-6 rounded-xl border-2 border-slate-800 bubbly-shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-5 h-5" />
            重新練習單字
          </button>

          <button
            id="result-re-quiz-btn"
            onClick={handleStartQuiz}
            className="flex-1 bg-sky-400 hover:bg-sky-300 text-slate-900 font-bold py-3.5 px-6 rounded-xl border-2 border-slate-800 bubbly-shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-5 h-5" />
            重新挑戰測驗
          </button>

          <button
            id="result-back-map-btn"
            onClick={() => setView("level-map")}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-6 rounded-xl border-2 border-slate-800 bubbly-shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-5 h-5" />
            回冒險地圖
          </button>
        </div>
      </div>
    );
  };

  /**
   * Learning Records Dashboard View Screen
   */
  const renderRecordsPage = () => {
    // Collect all played level records
    const recordsList = (Object.values(progress) as UserProgress[]).sort((a, b) => a.day - b.day);

    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Navigation header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white bubbly-border p-5 rounded-2xl bubbly-shadow mb-8">
          <div className="flex items-center gap-3">
            <button 
              id="records-back-home-btn"
              onClick={() => setView("home")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold p-3 rounded-xl border-2 border-slate-800 transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-5 h-5" />
              返回首頁
            </button>
            <div>
              <h2 className="text-2xl font-black font-display text-slate-800 flex items-center gap-2">
                <Trophy className="text-amber-500 fill-amber-300" />
                學習成果檔案
              </h2>
              <p className="text-sm text-slate-500">你的冒險戰績大盤點</p>
            </div>
          </div>

          <button
            id="clear-records-btn"
            onClick={clearProgress}
            className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold px-4 py-2.5 rounded-xl border-2 border-rose-300 transition-all cursor-pointer flex items-center gap-1.5 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            清除學習進度
          </button>
        </div>

        {/* Global summary card stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white bubbly-border p-5 rounded-2xl bubbly-shadow-sm text-center">
            <span className="text-3xl block mb-1">🏁</span>
            <div className="text-2xl font-black text-slate-800">{passedLevelsCount} 關</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-0.5">總通關關卡</div>
          </div>

          <div className="bg-white bubbly-border p-5 rounded-2xl bubbly-shadow-sm text-center">
            <span className="text-3xl block mb-1">⭐</span>
            <div className="text-2xl font-black text-slate-800">{totalStarsEarned} 顆</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-0.5">累計榮譽星星</div>
          </div>

          <div className="bg-white bubbly-border p-5 rounded-2xl bubbly-shadow-sm text-center">
            <span className="text-3xl block mb-1">📊</span>
            <div className="text-2xl font-black text-slate-800">{progressPercentage}%</div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-0.5">挑戰大長征進度</div>
          </div>

          <div className="bg-white bubbly-border p-5 rounded-2xl bubbly-shadow-sm text-center">
            <span className="text-3xl block mb-1">🔥</span>
            <div className="text-2xl font-black text-slate-800">
              {recordsList.reduce((acc, r) => acc + r.attemptCount, 0)} 次
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase mt-0.5">累計測驗次數</div>
          </div>
        </div>

        {/* Records list details table */}
        <div className="bg-white bubbly-border rounded-3xl bubbly-shadow p-6 mb-8 overflow-hidden">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-1.5">
            <FileSpreadsheet className="text-emerald-500" />
            每關學習挑戰歷程
          </h3>

          {recordsList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-xl border border-dashed border-slate-300">
              🐾 還沒有任何挑戰成績喔！趕快前往地圖，開啟你的第一天冒險吧！
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-4">關卡</th>
                    <th className="py-3 px-4 text-center">狀態</th>
                    <th className="py-3 px-4 text-center">最佳分數</th>
                    <th className="py-3 px-4 text-center">上次分數</th>
                    <th className="py-3 px-4 text-center">測驗次數</th>
                    <th className="py-3 px-4 text-center">榮譽星星</th>
                    <th className="py-3 px-4">最常出錯單字</th>
                    <th className="py-3 px-4 text-right">最後挑戰時間</th>
                  </tr>
                </thead>
                <tbody className="font-bold">
                  {recordsList.map((rec) => (
                    <tr key={rec.day} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-display font-black text-slate-700">Day {rec.day}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs ${rec.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {rec.passed ? "已通關" : "未通關"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-base">{rec.bestScore} 分</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">{rec.lastScore} 分</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">{rec.attemptCount}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex justify-center gap-0.5">
                          {Array.from({ length: 3 }).map((_, sIdx) => (
                            <Star 
                              key={sIdx} 
                              className={`w-3.5 h-3.5 ${sIdx < rec.stars ? "fill-yellow-300 text-yellow-500" : "text-slate-200"}`} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {rec.wrongWords && rec.wrongWords.length > 0 ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs select-all">
                            {rec.wrongWords.join(", ")}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">無錯題</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-400">{rec.lastPlayedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-[#F3F8FF] flex flex-col">
      
      {/* Cartoon Playful Header Banner */}
      <header className="bg-white border-b-4 border-slate-900 py-4 px-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setView("home")}
            className="bg-amber-400 bubbly-border-sm p-1.5 rounded-xl cursor-pointer"
          >
            <span className="text-2xl">🎒</span>
          </div>
          <div>
            <h1 
              onClick={() => setView("home")}
              className="text-2xl font-display font-black text-slate-800 tracking-tight cursor-pointer select-none"
            >
              單字冒險 60 天 <span className="text-amber-500">Vocabulary Quest</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
              國中生英文單字背誦試煉
            </p>
          </div>
        </div>

        {/* Global navbar triggers */}
        <nav className="flex items-center gap-3">
          <button
            id="nav-home-btn"
            onClick={() => setView("home")}
            className={`py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${view === "home" ? "bg-amber-400 border-2 border-slate-800 bubbly-shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
          >
            首頁
          </button>
          
          <button
            id="nav-map-btn"
            onClick={() => setView("level-map")}
            className={`py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${view === "level-map" ? "bg-amber-400 border-2 border-slate-800 bubbly-shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
          >
            冒險地圖
          </button>

          <button
            id="nav-records-btn"
            onClick={() => setView("records")}
            className={`py-2 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${view === "records" ? "bg-amber-400 border-2 border-slate-800 bubbly-shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-800"}`}
          >
            學習歷程
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-grow py-8 px-4 flex items-center justify-center">
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-amber-500 animate-spin" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">🎒</div>
            </div>
            <p className="text-slate-600 font-bold text-base">正在與單字冒險王國同步關卡，請稍候...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {view === "home" && renderHome()}
              {view === "level-map" && renderLevelMap()}
              {view === "study" && renderStudyPage()}
              {view === "quiz" && renderQuizPage()}
              {view === "result" && renderResultPage()}
              {view === "records" && renderRecordsPage()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Playful Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t-4 border-slate-950 text-center text-xs">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-bold text-slate-300">🎮 單字冒險 60 天 (Vocabulary Quest) — 國中專用卡通趣味背誦遊戲</p>
            <p className="mt-1 opacity-75">採用滾動式複習遺忘曲線機制 (溫故知新) · localStorage 本地儲存保證進度不流失</p>
          </div>
          <div className="flex gap-4">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert("📝 本遊戲單字庫是預留可替換設計的！\n\n您可以隨時在遊戲專案根目錄下，將自己編輯的 'vocabulary_full.csv' 檔案覆蓋，瀏覽器將自動讀取、驗證、並生成 60 天關卡！\n\nCSV 格式：\nID,Word,ChineseMeaning,PartOfSpeech,RawMeaning,SourcePage");
              }}
              className="hover:text-amber-400 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              📖 自訂單字指南
            </a>
            <span>|</span>
            <span className="text-slate-500">2026-07-01 Build</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
