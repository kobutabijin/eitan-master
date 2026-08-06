import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "eitan-master-progress";

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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("進捗データの読み込みに失敗しました", e);
    }
    return { learned: {}, quizHistory: [] };
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
      ].slice(-20), // 直近20件だけ保持
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ learned: {}, quizHistory: [] });
  }, []);

  return {
    progress,
    markLearned,
    isLearned,
    learnedCount,
    addQuizResult,
    resetProgress,
  };
}
