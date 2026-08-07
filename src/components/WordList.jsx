import React, { useMemo, useState } from "react";
import words from "../data/words.json";
import "./WordList.css";

export default function WordList({ isLearned, markLearned }) {
  const [filter, setFilter] = useState("all"); // all | learned | notLearned
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(words.map((w) => w.category));
    return Array.from(set);
  }, []);
  const [category, setCategory] = useState("すべて");

  const filtered = words.filter((w) => {
    if (category !== "すべて" && w.category !== category) return false;
    if (filter === "learned" && !isLearned(w.id)) return false;
    if (filter === "notLearned" && isLearned(w.id)) return false;
    if (query && !w.word.toLowerCase().includes(query.toLowerCase()) && !w.meaning.includes(query)) {
      return false;
    }
    return true;
  });

  return (
    <div className="app-shell">
      <div className="top-bar">
        <a href="/" className="back-link">← ホーム</a>
        <h1 className="page-title">単語一覧</h1>
      </div>

      <div className="list-controls">
        <input
          type="search"
          className="search-input"
          placeholder="単語や意味で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="単語を検索"
        />

        <div className="filter-row" role="group" aria-label="覚えた状態で絞り込み">
          {[
            { key: "all", label: "すべて" },
            { key: "notLearned", label: "未習得" },
            { key: "learned", label: "習得済み" },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-chip ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="カテゴリで絞り込み"
        >
          <option value="すべて">すべてのカテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="list-count">{filtered.length}件 表示中</p>

      <ul className="word-list">
        {filtered.map((w) => (
          <li key={w.id} className={`word-row ${isLearned(w.id) ? "is-learned" : ""}`}>
            <label className="word-checkbox">
              <input
                type="checkbox"
                checked={isLearned(w.id)}
                onChange={(e) => markLearned(w.id, e.target.checked)}
              />
              <span className="checkbox-mark" aria-hidden="true" />
            </label>
            <div className="word-text">
              <span className="word-en">{w.word}</span>
              <span className="word-ja">{w.meaning}</span>
            </div>
            <span className="word-category">{w.category}</span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="empty-state">条件に合う単語が見つかりませんでした。</li>
        )}
      </ul>
    </div>
  );
}
