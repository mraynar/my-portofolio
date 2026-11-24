import fs from "node:fs";
import path from "node:path";

// Unicode escaped regex preventing self-matching
const EMOJI_AND_GLYPH_REGEX =
  /[\p{Extended_Pictographic}\uFE0F\u200D\u2713\u2714\u2717\u2718\u2605\u2606\u2190-\u2193\u2197\u279C\u25BA\u25B8\u26A1\u2709]/u;

const SCAN_DIRS = ["src", "docs", "scripts", "supabase"];
const SCAN_FILES = ["README.md", "AGENTS.md", "CLAUDE.md"];
const TEXT_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".html",
  ".md",
  ".json",
  ".sql",
  ".mjs",
]);

let violations = 0;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const match = line.match(EMOJI_AND_GLYPH_REGEX);
    if (match) {
      const char = match[0];
      const codePoint = char.codePointAt(0).toString(16).toUpperCase();
      console.error(
        `FAIL: ${filePath}:${index + 1}: Found forbidden character U+${codePoint} in: "${line.trim()}"`
      );
      violations++;
    }
  });
}

function walkDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      checkFile(fullPath);
    }
  }
}

// Execute checks
for (const dir of SCAN_DIRS) {
  walkDir(path.resolve(process.cwd(), dir));
}

for (const file of SCAN_FILES) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    checkFile(fullPath);
  }
}

if (violations > 0) {
  console.error(`Check failed: Found ${violations} forbidden emoji/glyph occurrences.`);
  process.exit(1);
}

console.log("Check passed: Zero emoji or text glyph icons found.");
