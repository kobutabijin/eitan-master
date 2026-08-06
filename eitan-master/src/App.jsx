import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import WordList from "./components/WordList";
import FlashCard from "./components/FlashCard";
import Quiz from "./components/Quiz";
import { useProgress } from "./hooks/useProgress";

function App() {
  const { isLearned, markLearned, learnedCount, addQuizResult } = useProgress();

  return (
    <Routes>
      <Route path="/" element={<Home learnedCount={learnedCount} />} />
      <Route
        path="/list"
        element={<WordList isLearned={isLearned} markLearned={markLearned} />}
      />
      <Route
        path="/flashcard"
        element={<FlashCard isLearned={isLearned} markLearned={markLearned} />}
      />
      <Route
        path="/quiz"
        element={<Quiz addQuizResult={addQuizResult} />}
      />
    </Routes>
  );
}

export default App;
