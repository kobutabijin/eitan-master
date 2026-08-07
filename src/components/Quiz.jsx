import React, { useState, useMemo, useCallback } from "react";
import words from "../data/words.json";
import "./Quiz.css";

const QUIZ_LENGTH = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions() {
  const pool = shuffle(words).slice(0, QUIZ_LENGTH);
  return pool.map((w) => {
    const distractors = shuffle(words.filter((x) => x.id !== w.id)).slice(0, 3);
    const choices = shuffle([w, ...distractors]).map((c) => c.meaning);
    return { word: w, choices, answer: w.meaning };
  });
}

export default function Quiz({ addQuizResult }) {
  const [questions, setQuestions] = useState(buildQuestions);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongWords, setWrongWords] = useState([]);
  const [finished, setFinished] = useState(false);

  const current = questions[qIndex];
  const isLast = qIndex === questions.length - 1;

  const handleSelect = useCallback(
    (choice) => {
      if (selected) return; // 二重回答防止
      setSelected(choice);
      const isCorrect = choice === current.answer;
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        setWrongWords((w) => [...w, current.word]);
      }
    },
    [selected, current]
  );

  const handleNext = () => {
    if (isLast) {
      addQuizResult(correctCount, questions.length);
      setFinished(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setQuestions(buildQuestions());
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setWrongWords([]);
    setFinished(false);
  };

  const scorePercent = useMemo(
    () => Math.round((correctCount / questions.length) * 100),
    [correctCount, questions.length]
  );

  if (finished) {
    return (
      <div className="app-shell">
        <div className="top-bar">
          <a href="/" className="back-link">← ホーム</a>
          <h1 className="page-title">クイズ結果</h1>
        </div>

        <div className="result-card">
          <p className="result-score">{correctCount} / {questions.length} 問正解</p>
          <p className="result-percent">正答率 {scorePercent}%</p>
        </div>

        {wrongWords.length > 0 && (
          <div className="result-wrong">
            <h2 className="result-wrong-title">まちがえた単語</h2>
            <ul className="result-wrong-list">
              {wrongWords.map((w) => (
                <li key={w.id} className="result-wrong-item">
                  <span className="word-en">{w.word}</span>
                  <span className="word-ja">{w.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="result-actions">
          <button className="result-btn primary" onClick={restart}>もう一度挑戦する</button>
          <a href="/" className="result-btn secondary">ホームへ戻る</a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <a href="/" className="back-link">← ホーム</a>
        <h1 className="page-title">クイズ</h1>
      </div>

      <p className="quiz-progress">問題 {qIndex + 1} / {questions.length}</p>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-label="クイズの進み具合"
        aria-valuenow={qIndex + (selected ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={questions.length}
      >
        <div
          className="quiz-progress-fill"
          style={{ width: `${((qIndex + (selected ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="quiz-question-card">
        <span className="quiz-question-label">この単語の意味は？</span>
        <span className="quiz-question-word">{current.word.word}</span>
      </div>

      <div className="quiz-choices">
        {current.choices.map((choice) => {
          const isSelected = selected === choice;
          const isAnswer = choice === current.answer;
          let stateClass = "";
          if (selected) {
            if (isAnswer) stateClass = "correct";
            else if (isSelected) stateClass = "incorrect";
          }
          return (
            <button
              key={choice}
              className={`quiz-choice ${stateClass}`}
              onClick={() => handleSelect(choice)}
              disabled={Boolean(selected)}
            >
              {choice}
              {selected && isAnswer && <span className="quiz-choice-mark">○</span>}
              {selected && isSelected && !isAnswer && <span className="quiz-choice-mark">×</span>}
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {selected && (
          <>
            <p className="quiz-feedback">
              {selected === current.answer
                ? "正解です。"
                : `不正解です。正解は「${current.answer}」です。`}
            </p>
            <button className="quiz-next-btn" onClick={handleNext}>
              {isLast ? "結果を見る" : "次の問題へ"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
