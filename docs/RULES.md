# Engineering Rules & Standards

## 0. Permanent Rule: Zero Emojis and Text Glyphs, Icons Only
1. **Absolute Ban**: STRICTLY FORBIDDEN to use emojis and text characters used as icons (checkmarks, crosses, arrows, stars, lightning bolts, locks, envelopes, etc.) anywhere: public UI, admin UI, database seeds/content, code comments, logs/console, error messages, alt text, meta/OG, README, docs, commit messages, and agent replies.
2. **Unified SVG Icon**: All iconography MUST use the unified SVG `Icon` component from Lucide React (`src/components/icons/Icon.jsx`). Size from tokens (16, 20, 24), color `currentColor`, uniform line weight (strokeWidth 2).
3. **Database Schema**: Database `icon` columns store curated registry keys (`src/components/icons/registry`), never emoji characters or raw SVG strings. Admin provides an icon picker.
4. **Enforcement**: Run `scripts/check-emoji.mjs` via `npm run check:emoji`. Every phase requires `check:emoji` to pass cleanly with 0 violations.

## 0.1 Permanent Rule: Git Commit and Push Every Change
1. **Mandatory Push**: After EVERY completed change (feature, fix, refactor, deletion, doc update), you MUST commit and push to remote. Never pile up uncommitted changes. Never end a task, turn, or phase with a dirty working tree or unpushed commits.
2. **Pre-commit Verification**: Run lint, check:comments, check:emoji, check:layout, and build before committing. Never bypass with --no-verify.
3. **Atomic Commits**: One commit = one concern. Conventional Commits format, English, single line max 72 characters, zero emojis.
4. **Branching**: Always work on a feature branch (feat/..., fix/...). Push with git push -u origin <branch>.
5. **Security Invariant**: Never commit .env*, service_role keys, passwords, or credentials. Check git diff --staged for secrets.
6. **Destructive Safety**: Create checkpoint commits and push before destructive operations.
7. **Prohibited Operations**: Never use git push --force, git reset --hard on pushed commits, or commit --amend on pushed commits.
8. **Reporting**: Every report to user MUST explicitly state branch name and pushed commit hash.

## 1. Absolute Comment & Language Rules
1. **Language**: ALL code comments, JSDoc tags, SQL comments, commit messages, README, and docs/ files MUST be written in English.
2. **Length**: Comments MUST be single line, maximum 80 characters. Block comments (`/* ... */`) and multi-line explanations are strictly forbidden.
3. **Intent**: Comments only explain "why" (non-obvious rationale), never "what" (which the code already communicates).
4. **Forbidden Elements**:
   - Comments repeating code.
   - Decorative dividers (`// =====`, `// -----`).
   - Commented-out dead code.
   - Emojis inside code comments.
   - Attribution or date stamps ("added by AI", "author: xyz").
   - Context-free TODO markers.
5. **Exception**: User-facing copy in UI components and database seed content may be in Indonesian because it represents application data, not code comments.

## 2. Code Quality & Conventions
- **Component File Limits**: Individual React component files must not exceed 300 lines of code. Split subcomponents cleanly.
- **Styling Enforcement**: Hardcoded hex colors, arbitrary pixel borders, and inline shadow declarations are strictly forbidden. All styling must consume CSS variables defined in `docs/DESIGN.md`.
- **Strict Linting**: The codebase runs under strict ESLint rules. Unused variables, unresolved imports, and React hook dependency warnings are treated as build failures.
- **Error Boundaries**: Root routes and dynamic data queries must be wrapped in error boundaries that provide actionable recovery options without exposing internal stack traces.

## 3. Accessibility (a11y) Standards
- WCAG 2.1 Level AA color contrast is mandatory across both light and dark themes (minimum 4.5:1 for normal prose, 3:1 for large text).
- Semantic HTML tags (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) must be used appropriately; avoid `<div>` soups.
- All interactive elements must supply visible keyboard focus rings (`3px solid var(--google-blue)` with offset).
- Touch target sizes for all buttons, inputs, and interactive pills must measure at least `44px x 44px`.
- Every image must possess meaningful, descriptive `alt` text. Purely decorative elements must declare `aria-hidden="true"`.

## 4. Security Protocols
- `SUPABASE_SERVICE_ROLE_KEY` must never be referenced or imported into any client-side file.
- Supabase Row Level Security (RLS) is enabled and tested on all tables without exception.
- Form inputs must be validated with Zod schemas both before submission and upon data receipt.
- Contact forms must implement a hidden honeypot field and client-side throttle to mitigate automated bot submissions.
- Markdown rendering in case studies must sanitize HTML to prevent Cross-Site Scripting (XSS).

## 5. Git Workflow & Commit Guidelines
- Use Conventional Commits format in English:
  - `feat: add project case study modal`
  - `fix: resolve card height misalignment on tablet`
  - `docs: update design tokens table in DESIGN.md`
  - `refactor: extract form input primitives`
- Commit messages must be concise, single line, and maximum 72 characters.
- Prefer atomic bulk delete helpers (`delete*Bulk`) over sequential single deletes in Admin CMS to avoid IndexedDB race conditions.
- Always trust valid empty arrays (`[]`) returned by Supabase; never resurrect static seed arrays when a table is intentionally emptied.
- Keep `vercel.json` configured for `main`-only auto-deployments and `no-store` HTML caching on all SPA routes.
