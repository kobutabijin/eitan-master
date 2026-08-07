import React, { useEffect, useState } from "react";
import words from "../data/words.json";
import "./FlashCard.css";

export default function FlashCard({ learned, markLearned }) {
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [deck, setDeck] = useState(words);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const isLearned = (id) => Boolean(learned[id]);
  const unlearnedCount = words.length - Object.keys(learned).length;

  const current = deck[index];
  const isDone = deck.length === 0;

  useEffect(() => {
    if (deck.length > 0 && index >= deck.length) {
      setIndex(deck.length - 1);
    }
  }, [deck.length, index]);

  const goNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  };

  const goPrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : deck.length - 1));
  };

  const handleEvaluate = (learned) => {
    if (!current) return;
    markLearned(current.id, learned);
    setFlipped(false);

    setIndex((i) => (i + 1 < deck.length ? i + 1 : 0));
  };

  const showAll = () => {
    setOnlyUnlearned(false);
    setDeck(words);
    setIndex(0);
    setFlipped(false);
  };

  const showUnlearned = () => {
    setOnlyUnlearned(true);
    setDeck(words.filter((word) => !isLearned(word.id)));
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="app-shell">
      <div className="top-bar">
        <a href="/" className="back-link">← ホーム</a>
        <h1 className="page-title">暗記カード</h1>
      </div>

      <div className="fc-mode-row">
        <button
          className={`filter-chip ${!onlyUnlearned ? "active" : ""}`}
          onClick={showAll}
          aria-pressed={!onlyUnlearned}
        >
          すべて ({words.length})
        </button>
        <button
          className={`filter-chip ${onlyUnlearned ? "active" : ""}`}
          onClick={showUnlearned}
          aria-pressed={onlyUnlearned}
        >
          未習得のみ ({unlearnedCount})
        </button>
      </div>

      {isDone ? (
        <div className="fc-empty">
          <p>🎉 このモードのカードはすべて習得済みです！</p>
          <a href="/" className="fc-home-btn">ホームへ戻る</a>
        </div>
      ) : (
        <>
          <p className="fc-counter">{index + 1} / {deck.length}</p>

          <div className="fc-stage">
            <button
              className={`fc-card ${flipped ? "is-flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label={`${flipped ? "日本語訳" : "英単語"}を表示中。押すと${flipped ? "英単語" : "日本語訳"}を表示します`}
            >
              <div className="fc-card-inner">
                <div className="fc-card-face fc-front">
                  <span className="fc-face-label">ENGLISH</span>
                  <span className="fc-word">{current.word}</span>
                  <span className="fc-hint">タップして意味を見る</span>
                </div>
                <div className="fc-card-face fc-back">
                  <span className="fc-face-label">意味</span>
                  <span className="fc-meaning">{current.meaning}</span>
                  <span className="fc-category-tag">{current.category}</span>
                </div>
              </div>
            </button>
          </div>

          <div className="fc-nav-row">
            <button className="fc-nav-btn" onClick={goPrev} aria-label="前のカード">‹ 前へ</button>
            <button className="fc-nav-btn" onClick={goNext} aria-label="次のカード">次へ ›</button>
          </div>

          <div className="fc-evaluate-row">
            <button
              className={`fc-eval-btn fc-eval-no ${!isLearned(current.id) ? "is-selected" : ""}`}
              onClick={() => handleEvaluate(false)}
              aria-pressed={!isLearned(current.id)}
            >
              まだ覚えていない
            </button>
            <button
              className={`fc-eval-btn fc-eval-yes ${isLearned(current.id) ? "is-selected" : ""}`}
              onClick={() => handleEvaluate(true)}
              aria-pressed={isLearned(current.id)}
            >
              わかった！
            </button>
          </div>
        </>
      )}
    </div>
  );
}
