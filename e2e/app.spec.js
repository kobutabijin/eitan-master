import { expect, test } from "@playwright/test";

test("主要画面へ移動できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /えいたんマスター/ })).toBeVisible();

  await page.getByRole("link", { name: /単語一覧/ }).click();
  await expect(page.getByRole("heading", { name: "単語一覧" })).toBeVisible();
  await expect(page.getByText("apple")).toBeVisible();
});

test("クイズ画面に問題と4つの選択肢を表示する", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/quiz");
  await expect(page.getByRole("heading", { name: "クイズ" })).toBeVisible();
  await expect(page.locator(".quiz-question-word")).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(4);
  await page.getByRole("button").first().click();
  await expect(page.getByText(/正解です|不正解です/)).toBeVisible();
  await expect(page.getByRole("button", { name: "次の問題へ" })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("未習得モードで評価を戻すと件数へ即時反映する", async ({ page }) => {
  await page.goto("/flashcard");
  await page.getByRole("button", { name: /未習得のみ/ }).click();
  await expect(page.getByText("apple")).toBeVisible();
  await page.getByRole("button", { name: "わかった！" }).click();
  await expect(page.getByRole("button", { name: "未習得のみ (99)" })).toBeVisible();
  await expect(page.getByText("banana")).toBeVisible();

  await page.getByRole("button", { name: "前のカード" }).click();
  await expect(page.getByText("apple")).toBeVisible();
  await page.getByRole("button", { name: "まだ覚えていない" }).click();
  await expect(page.getByRole("button", { name: "未習得のみ (100)" })).toBeVisible();
});

test("すべてモードの評価変更を未習得件数へ即時反映する", async ({ page }) => {
  await page.goto("/flashcard");
  await expect(page.getByRole("button", { name: "未習得のみ (100)" })).toBeVisible();

  await page.getByRole("button", { name: "わかった！" }).click();
  await expect(page.getByRole("button", { name: "未習得のみ (99)" })).toBeVisible();

  await page.getByRole("button", { name: "前のカード" }).click();
  await page.getByRole("button", { name: "まだ覚えていない" }).click();
  await expect(page.getByRole("button", { name: "未習得のみ (100)" })).toBeVisible();
});
