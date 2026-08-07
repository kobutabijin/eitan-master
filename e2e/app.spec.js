import { expect, test } from "@playwright/test";

test("主要画面へ移動できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /えいたんマスター/ })).toBeVisible();

  await page.getByRole("link", { name: /単語一覧/ }).click();
  await expect(page.getByRole("heading", { name: "単語一覧" })).toBeVisible();
  await expect(page.getByText("apple")).toBeVisible();
});

test("未習得カードは習得後にデッキから外れる", async ({ page }) => {
  await page.goto("/flashcard");
  await page.getByRole("button", { name: /未習得のみ/ }).click();
  await expect(page.getByText("apple")).toBeVisible();
  await page.getByRole("button", { name: "わかった！" }).click();
  await expect(page.getByText("apple")).toBeHidden();
  await expect(page.getByText("banana")).toBeVisible();
});
