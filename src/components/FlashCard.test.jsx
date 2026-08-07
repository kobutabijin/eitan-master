import React, { useCallback, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FlashCard from "./FlashCard";

function TestFlashCard() {
  const [learned, setLearned] = useState({});
  const isLearned = useCallback((id) => Boolean(learned[id]), [learned]);
  const markLearned = useCallback((id, value) => {
    setLearned((current) => ({ ...current, [id]: value }));
  }, []);

  return <FlashCard isLearned={isLearned} markLearned={markLearned} />;
}

describe("FlashCard", () => {
  it("未習得モードで覚えたカードをデッキから除外する", async () => {
    const user = userEvent.setup();
    render(<TestFlashCard />);

    await user.click(screen.getByRole("button", { name: /未習得のみ/ }));
    expect(screen.getByText("apple")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "わかった！" }));

    expect(screen.queryByText("apple")).not.toBeInTheDocument();
    expect(screen.getByText("banana")).toBeInTheDocument();
    expect(screen.getByText("1 / 99")).toBeInTheDocument();
  });
});
