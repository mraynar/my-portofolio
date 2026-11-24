#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

// Indonesian common words to flag in comments
const INDONESIAN_WORDS = [
  "yang", "untuk", "dengan", "tidak", "ini", "dan", "dari", "akan",
  "sudah", "atau", "pada", "adalah", "bisa", "juga", "oleh", "sebagai",
  "saya", "kami", "mereka", "kita", "kamu", "anda", "karena", "hanya",
  "dapat", "lebih", "secara", "dalam", "bagi", "setiap", "seperti",
  "kolom", "maksimal", "baris", "tautan", "warna", "teks", "kiri", "kanan",
  "tampilan", "unggulan", "penanda", "lengkap", "resmi", "pendidikan",
  "pengalaman", "keahlian", "proyek", "tentang", "beranda", "halaman"
];

const INDO_REGEX = new RegExp(`\\b(${INDONESIAN_WORDS.join("|")})\\b`, "i");

const EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".css", ".sql", ".mjs"
]);

const IGNORED_DIRS = new Set([
  "node_modules", "dist", ".git", ".claude", ".cursor", ".gemini"
]);

let totalViolations = 0;

function checkCommentString(commentText, fullLine, filePath, lineNum) {
  if (fullLine.length > 80) {
    console.error(`[MAX-LEN] ${filePath}:${lineNum} - Comment line exceeds 80 characters (${fullLine.length}).`);
    totalViolations++;
  }
  if (INDO_REGEX.test(commentText)) {
    const match = commentText.match(INDO_REGEX)?.[0];
    console.error(`[INDONESIAN] ${filePath}:${lineNum} - Indonesian word "${match}" found in comment: "${commentText.slice(0, 50)}".`);
    totalViolations++;
  }
}

function scanFile(filePath) {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let consecutiveCommentCount = 0;
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // JSX comments ({/* ... */})
    if (trimmed.startsWith("{/*")) {
      const commentText = trimmed.replace(/^\{\/\*+/, "").replace(/\*+\/\}$/, "").trim();
      checkCommentString(commentText, rawLine, filePath, lineNum);
      consecutiveCommentCount = 0;
      continue;
    }

    // Block comments (/* ... */)
    if (inBlockComment) {
      consecutiveCommentCount++;
      console.error(`[MULTI-LINE] ${filePath}:${lineNum} - Multi-line comments forbidden.`);
      totalViolations++;
      const commentText = trimmed.replace(/\*+\/$/, "").trim();
      checkCommentString(commentText, rawLine, filePath, lineNum);
      if (trimmed.includes("*/")) {
        inBlockComment = false;
        consecutiveCommentCount = 0;
      }
      continue;
    }

    if (trimmed.startsWith("/*")) {
      if (trimmed.includes("*/")) {
        // Single-line block comment
        const commentText = trimmed.replace(/^\/\*+/, "").replace(/\*+\/$/, "").trim();
        checkCommentString(commentText, rawLine, filePath, lineNum);
        consecutiveCommentCount = 0;
      } else {
        // Multi-line block comment opening
        inBlockComment = true;
        consecutiveCommentCount = 1;
        const commentText = trimmed.replace(/^\/\*+/, "").trim();
        checkCommentString(commentText, rawLine, filePath, lineNum);
      }
      continue;
    }

    // Single-line comments by extension
    let isSingleComment = false;
    let commentText = "";

    if (ext === ".sql" && trimmed.startsWith("--")) {
      isSingleComment = true;
      commentText = trimmed.replace(/^--+/, "").trim();
    } else if (ext !== ".css" && trimmed.startsWith("//")) {
      isSingleComment = true;
      commentText = trimmed.replace(/^\/\/+/, "").trim();
    }

    if (isSingleComment) {
      consecutiveCommentCount++;
      if (consecutiveCommentCount > 1) {
        console.error(`[CONSECUTIVE] ${filePath}:${lineNum} - Consecutive comment lines forbidden.`);
        totalViolations++;
      }
      checkCommentString(commentText, rawLine, filePath, lineNum);
    } else {
      consecutiveCommentCount = 0;
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) {
      scanFile(fullPath);
    }
  }
}

const targetDir = process.cwd();
walkDir(targetDir);

if (totalViolations > 0) {
  console.error(`\nCheck failed: Found ${totalViolations} comment violation(s).`);
  process.exit(1);
} else {
  console.log("Check passed: All comments comply with language and length rules.");
  process.exit(0);
}
