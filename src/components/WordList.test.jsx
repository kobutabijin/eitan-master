import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WordList from "./WordList";

describe("WordList", () => {
  it("英単語と日本語訳で検索できる", async () => {
    const user = userEvent.setup();
    render(<WordList isLearned={() => false} markLearned={vi.fn()} />);

    const search = screen.getByRole("searchbox", { name: "単語を検索" });
    await user.type(search, "banana");
    expect(screen.getByText("バナナ")).toBeInTheDocument();
    expect(screen.queryByText("apple")).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "りんご");
    expect(screen.getByText("apple")).toBeInTheDocument();
  });
});
