import React from "react";
import Home from "./components/Home";
import WordList from "./components/WordList";
import FlashCard from "./components/FlashCard";
import Quiz from "./components/Quiz";
import { useProgress } from "./hooks/useProgress";

function App() {
  const { learned, isLearned, markLearned, learnedCount, addQuizResult } = useProgress();
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/list") {
    return <WordList isLearned={isLearned} markLearned={markLearned} />;
  }
  if (path === "/flashcard") {
    return <FlashCard learned={learned} markLearned={markLearned} />;
  }
  if (path === "/quiz") {
    return <Quiz addQuizResult={addQuizResult} />;
  }
  return <Home learnedCount={learnedCount} />;
}

export default App;
