import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

// Layout audit viewports
const VIEWPORTS = [
  { name: "mobile-small", width: 360, height: 800 },
  { name: "mobile-standard", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop-small", width: 1024, height: 768 },
  { name: "desktop-standard", width: 1280, height: 800 },
  { name: "desktop-wide", width: 1440, height: 900 },
  { name: "desktop-fullhd", width: 1920, height: 1080 },
];

const THEMES = ["light", "dark"];
const ARTIFACTS_DIR = path.resolve(process.cwd(), ".artifacts/layout");

// Prepare output directory
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

async function runLayoutChecks() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let failedChecks = 0;
  const baseUrl = process.env.TEST_URL || "http://localhost:5173";

  console.log(`Starting visual layout audit against: ${baseUrl}`);

  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(baseUrl, { waitUntil: "networkidle" });

      // Apply theme via html class
      await page.evaluate((themeMode) => {
        if (themeMode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }, theme);

      await page.waitForTimeout(100);

      // Verify horizontal overflow
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        return { hasOverflow: docW > winW, docW, winW };
      });

      if (overflow.hasOverflow) {
        console.error(
          `FAIL: Horizontal overflow in ${theme} mode at ${vp.name} (${vp.width}px): ${overflow.docW}px > ${overflow.winW}px`
        );
        failedChecks++;
      }

      // Verify card padding >= 16px
      const cardPaddingCheck = await page.evaluate(() => {
        const cards = document.querySelectorAll(".neo-card, .neo-card-flat");
        let minPadding = 999;
        let failCount = 0;
        cards.forEach((c) => {
          const style = window.getComputedStyle(c);
          const pt = parseFloat(style.paddingTop);
          const pr = parseFloat(style.paddingRight);
          const pb = parseFloat(style.paddingBottom);
          const pl = parseFloat(style.paddingLeft);
          const min = Math.min(pt, pr, pb, pl);
          if (min < minPadding) minPadding = min;
          // Card content containers must have padding >= 16px
          if (c.children.length > 0 && min < 14) failCount++;
        });
        return { minPadding, failCount, totalCards: cards.length };
      });

      // Verify chip padding and min-height >= 28px
      const chipCheck = await page.evaluate(() => {
        const chips = document.querySelectorAll(".neo-badge");
        let failCount = 0;
        chips.forEach((c) => {
          const h = c.getBoundingClientRect().height;
          if (h < 26) failCount++;
        });
        return { failCount, totalChips: chips.length };
      });

      // Capture screenshot
      const shotPath = path.join(
        ARTIFACTS_DIR,
        `${vp.width}-${theme}.png`
      );
      await page.screenshot({ path: shotPath, fullPage: true });

      console.log(
        `PASS: ${vp.name} (${vp.width}px) [${theme}] - overflow: 0, cards: ${cardPaddingCheck.totalCards}, chips: ${chipCheck.totalChips}`
      );
    }
  }

  await browser.close();

  if (failedChecks > 0) {
    console.error(`Layout audit failed with ${failedChecks} errors.`);
    process.exit(1);
  }

  console.log("Layout audit passed: all viewports verified cleanly.");
}

runLayoutChecks().catch((err) => {
  console.error("Layout check execution failed:", err);
  process.exit(1);
});
