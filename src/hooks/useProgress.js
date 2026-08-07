import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "eitan-master-progress";
const VALID_WORD_IDS = new Set(Array.from({ length: 100 }, (_, index) => index + 1));
const MAX_QUIZ_HISTORY = 20;

const EMPTY_PROGRESS = {
  learned: {},
  quizHistory: [],
};

export function normalizeProgress(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...EMPTY_PROGRESS };
  }

  const learned =
    value.learned && typeof value.learned === "object" && !Array.isArray(value.learned)
      ? Object.fromEntries(
          Object.entries(value.learned)
            .filter(([id, learnedValue]) => (
              VALID_WORD_IDS.has(Number(id)) && learnedValue === true
            ))
            .map(([id]) => [id, true])
        )
      : {};

  const quizHistory = Array.isArray(value.quizHistory)
    ? value.quizHistory
        .filter((result) => (
          result &&
          typeof result === "object" &&
          typeof result.date === "string" &&
          !Number.isNaN(Date.parse(result.date)) &&
          Number.isInteger(result.correct) &&
          Number.isInteger(result.total) &&
          result.total > 0 &&
          result.correct >= 0 &&
          result.correct <= result.total
        ))
        .slice(-MAX_QUIZ_HISTORY)
    : [];

  return { learned, quizHistory };
}

/**
 * 単語ごとの暗記状態と、クイズの履歴をlocalStorageに保存・復元するフック。
 *
 * progress の形:
 * {
 *   learned: { [wordId]: true },   // 覚えた単語
 *   quizHistory: [{ date, correct, total }]
 * }
 */
export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeProgress(JSON.parse(saved));
    } catch (e) {
      console.warn("進捗データの読み込みに失敗しました", e);
    }
    return { ...EMPTY_PROGRESS };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn("進捗データの保存に失敗しました", e);
    }
  }, [progress]);

  const markLearned = useCallback((id, learned) => {
    setProgress((prev) => ({
      ...prev,
      learned: { ...prev.learned, [id]: learned },
    }));
  }, []);

  const isLearned = useCallback(
    (id) => Boolean(progress.learned[id]),
    [progress.learned]
  );

  const learnedCount = Object.values(progress.learned).filter(Boolean).length;

  const addQuizResult = useCallback((correct, total) => {
    setProgress((prev) => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        { date: new Date().toISOString(), correct, total },
      ].slice(-MAX_QUIZ_HISTORY),
    }));
  }, []);

  return {
    markLearned,
    isLearned,
    learnedCount,
    addQuizResult,
  };
}
