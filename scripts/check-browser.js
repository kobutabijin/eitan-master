import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";

if (existsSync(chromium.executablePath())) {
  console.log("Chromium is ready.");
  process.exit(0);
}

console.log("Chromium is not installed yet.");
process.exit(1);
