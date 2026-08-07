import { describe, expect, it } from "vitest";
import { normalizeProgress } from "./useProgress";

describe("normalizeProgress", () => {
  it("不正な保存値を安全な初期値へ戻す", () => {
    expect(normalizeProgress(null)).toEqual({ learned: {}, quizHistory: [] });
    expect(normalizeProgress({})).toEqual({ learned: {}, quizHistory: [] });
  });

  it("実在する習得済みIDと正常なクイズ履歴だけを残す", () => {
    const validResult = {
      date: "2026-08-07T00:00:00.000Z",
      correct: 8,
      total: 10,
    };

    expect(normalizeProgress({
      learned: { 1: true, 2: false, 101: true, invalid: true },
      quizHistory: [
        validResult,
        { date: "invalid", correct: 20, total: 10 },
      ],
    })).toEqual({
      learned: { 1: true },
      quizHistory: [validResult],
    });
  });
});
