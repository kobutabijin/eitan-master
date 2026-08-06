import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import words from "../data/words.json";
import "./FlashCard.css";

export default function FlashCard({ isLearned, markLearned }) {
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    return onlyUnlearned ? words.filter((w) => !isLearned(w.id)) : words;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyUnlearned]);

  const current = deck[index];
  const isDone = deck.length === 0;

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
    goNext();
  };

  const toggleMode = () => {
    setOnlyUnlearned((v) => !v);
    setIndex(0);
    setFlipped(false);
  };

  return (
    <div className="app-shell">
      <div className="top-bar">
        <Link to="/" className="back-link">← ホーム</Link>
        <h1 className="page-title">暗記カード</h1>
      </div>

      <div className="fc-mode-row">
        <button
          className={`filter-chip ${!onlyUnlearned ? "active" : ""}`}
          onClick={() => onlyUnlearned && toggleMode()}
        >
          すべて ({words.length})
        </button>
        <button
          className={`filter-chip ${onlyUnlearned ? "active" : ""}`}
          onClick={() => !onlyUnlearned && toggleMode()}
        >
          未習得のみ ({words.filter((w) => !isLearned(w.id)).length})
        </button>
      </div>

      {isDone ? (
        <div className="fc-empty">
          <p>🎉 このモードのカードはすべて習得済みです！</p>
          <Link to="/" className="fc-home-btn">ホームへ戻る</Link>
        </div>
      ) : (
        <>
          <p className="fc-counter">{index + 1} / {deck.length}</p>

          <div className="fc-stage">
            <button
              className={`fc-card ${flipped ? "is-flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label="タップして裏返す"
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
            <button className="fc-eval-btn fc-eval-no" onClick={() => handleEvaluate(false)}>
              まだ覚えていない
            </button>
            <button className="fc-eval-btn fc-eval-yes" onClick={() => handleEvaluate(true)}>
              わかった！
            </button>
          </div>
        </>
      )}
    </div>
  );
}
