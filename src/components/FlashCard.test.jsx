import React, { useCallback, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FlashCard from "./FlashCard";

function TestFlashCard() {
  const [learned, setLearned] = useState({});
  const markLearned = useCallback((id, value) => {
    setLearned((current) => {
      const next = { ...current };
      if (value) next[id] = true;
      else delete next[id];
      return next;
    });
  }, []);

  return <FlashCard learned={learned} markLearned={markLearned} />;
}

describe("FlashCard", () => {
  it("未習得モードで評価後もカード履歴を保持して変更できる", async () => {
    const user = userEvent.setup();
    render(<TestFlashCard />);

    await user.click(screen.getByRole("button", { name: /未習得のみ/ }));
    expect(screen.getByText("apple")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "わかった！" }));

    expect(screen.getByText("banana")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "未習得のみ (99)" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "前のカード" }));
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "わかった！" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "まだ覚えていない" }));
    expect(screen.getByRole("button", { name: "未習得のみ (100)" })).toBeInTheDocument();
  });

  it("すべてモードで評価を変更すると未習得件数へ即時反映する", async () => {
    const user = userEvent.setup();
    render(<TestFlashCard />);

    expect(screen.getByRole("button", { name: "未習得のみ (100)" })).toBeInTheDocument();
    expect(screen.getByText("apple")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "わかった！" }));
    expect(screen.getByRole("button", { name: "未習得のみ (99)" })).toBeInTheDocument();
    expect(screen.getByText("banana")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "前のカード" }));
    expect(screen.getByText("apple")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "まだ覚えていない" }));

    expect(screen.getByRole("button", { name: "未習得のみ (100)" })).toBeInTheDocument();
  });
});
