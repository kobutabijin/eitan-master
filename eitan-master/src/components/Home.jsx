import { Link } from "react-router-dom";
import words from "../data/words.json";
import "./Home.css";

export default function Home({ learnedCount }) {
  const total = words.length;
  const percent = Math.round((learnedCount / total) * 100);

  const menu = [
    {
      to: "/list",
      label: "単語一覧",
      desc: "100個の単語をまとめてチェック",
      icon: "📖",
      tone: "leaf",
    },
    {
      to: "/flashcard",
      label: "暗記カード",
      desc: "カードをめくって覚える",
      icon: "🗂️",
      tone: "sun",
    },
    {
      to: "/quiz",
      label: "クイズに挑戦",
      desc: "4択問題で力だめし",
      icon: "✏️",
      tone: "coral",
    },
  ];

  return (
    <div className="app-shell home">
      <header className="home-header">
        <p className="home-eyebrow">中学受験 英単語トレーニング</p>
        <h1 className="home-title">
          えいたん<span className="home-title-accent">マスター</span>
        </h1>
        <p className="home-sub">毎日すこしずつ、100個の単語をものにしよう。</p>
      </header>

      <section className="progress-strip" aria-label="学習の進み具合">
        <div className="progress-strip-text">
          <span className="progress-count">{learnedCount}</span>
          <span className="progress-total"> / {total} 語 おぼえた</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <nav className="menu-grid">
        {menu.map((item) => (
          <Link key={item.to} to={item.to} className={`menu-card tone-${item.tone}`}>
            <span className="menu-icon" aria-hidden="true">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
            <span className="menu-desc">{item.desc}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
