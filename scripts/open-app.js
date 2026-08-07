import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { createServer } from "vite";

const host = "127.0.0.1";
const headless = process.env.EITAN_HEADLESS === "1";
const autoClose = process.env.EITAN_AUTO_CLOSE === "1";
let server;
let context;
let profileDirectory;

async function close() {
  await context?.close().catch(() => {});
  await server?.close().catch(() => {});
  if (profileDirectory) {
    await rm(profileDirectory, { recursive: true, force: true }).catch(() => {});
  }
}

async function waitUntilClosed() {
  if (autoClose) {
    await context.close();
    return;
  }
  await new Promise((resolve) => context.on("close", resolve));
}

try {
  server = await createServer({
    server: {
      host,
      port: 0,
      strictPort: false,
    },
  });
  await server.listen();

  const address = server.httpServer.address();
  if (!address || typeof address === "string") {
    throw new Error("ローカルサーバーのポートを取得できませんでした。");
  }
  const appUrl = `http://${host}:${address.port}/`;

  profileDirectory = await mkdtemp(join(tmpdir(), "eitan-master-browser-"));
  context = await chromium.launchPersistentContext(profileDirectory, {
    headless,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] ?? await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") pageErrors.push(message.text());
  });

  const response = await page.goto(appUrl, {
    waitUntil: "networkidle",
    timeout: 30_000,
  });
  if (!response?.ok()) {
    throw new Error(`画面の取得に失敗しました（HTTP ${response?.status() ?? "不明"}）。`);
  }

  await page.getByRole("heading", { name: /えいたんマスター/ }).waitFor({
    state: "visible",
    timeout: 15_000,
  });
  if (pageErrors.length > 0) {
    throw new Error(`ブラウザエラー: ${pageErrors.join(" / ")}`);
  }

  console.log(`えいたんマスターを専用ブラウザで起動しました: ${appUrl}`);
  console.log("ブラウザを閉じるとアプリも終了します。");
  await waitUntilClosed();
} catch (error) {
  console.error("アプリを起動できませんでした。", error);
  process.exitCode = 1;

  if (context) {
    const page = context.pages()[0] ?? await context.newPage();
    const detail = String(error?.stack ?? error);
    await page.setContent(`
      <!doctype html>
      <html lang="ja">
        <meta charset="utf-8">
        <title>えいたんマスター 起動エラー</title>
        <body style="font-family: sans-serif; margin: 40px; line-height: 1.7">
          <h1>アプリを起動できませんでした</h1>
          <p>空白画面の代わりに、検出したエラーを表示しています。</p>
          <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 16px"></pre>
        </body>
      </html>
    `);
    await page.locator("pre").evaluate((element, text) => {
      element.textContent = text;
    }, detail);
    if (!autoClose) await new Promise((resolve) => context.on("close", resolve));
  }
} finally {
  await close();
}
