# Agent Guidelines & Operating Instructions

## 0. PERMANENT RULE: ZERO EMOJIS, ICONS ONLY (MANDATORY ACROSS ALL SESSIONS)
- STRICTLY FORBIDDEN to use emojis and text characters used as icons (checkmarks,
  crosses, arrows, stars, lightning bolts, locks, envelopes, etc.) anywhere:
  public UI, admin UI, database seeds/content, code comments, logs/console, error
  messages, alt text, meta/OG, README, docs, commit messages, and agent replies.
- ALL iconography MUST use the unified SVG `Icon` component from Lucide React
  (`src/components/icons/Icon.jsx`). Size from tokens (16, 20, 24), color
  `currentColor`, uniform line weight.
- Database `icon` columns store curated registry keys (`src/components/icons/registry`),
  never emoji characters or raw SVG strings. Admin provides an icon picker.
- Enforcement: `npm run check:emoji` runs via `scripts/check-emoji.mjs`.

## 1. Project Summary
Personal portfolio and admin CMS for Muhammad Raynar Hammam (Information Systems student & developer).
The redesign implements the GDG Cloud Surabaya neo-brutalist visual system with Google palette and light/dark themes.
Built on React 19, Vite, React Router v7, Tailwind CSS v4, and Supabase (PostgreSQL, Auth, Storage).

## 2. Technology Stack
- Frontend: React 19, Vite, React Router v7, Tailwind CSS v4, Lucide React
- Backend & Database: Supabase (PostgreSQL 15+, Row Level Security, Auth, Storage)
- State & Validation: React Hooks, Zod, Supabase JS Client

## 3. Essential Commands
- `npm run dev`: Start local development server on http://localhost:5173
- `npm run build`: Build production client bundle
- `npm run lint`: Run ESLint checks across repository
- `npm run check:comments`: Enforce absolute comment language and length rules
- `npm run check:emoji`: Enforce zero emoji and text glyph icon rules
- `npm run check:layout`: Playwright multi-viewport visual layout audit
- `npx supabase status`: Inspect local Supabase container services
- `npx supabase db push`: Apply versioned migrations to remote database

## 4. Absolute Rules (Mandatory Across All Phases)
1. Language and comment length:
   - STRICTLY FORBIDDEN to write comments in Indonesian. All code comments, JSDoc, SQL comments,
     TODOs, commit messages, README, and docs/ content MUST be in English.
   - Comments MUST be short: single line, maximum 80 characters. STRICTLY FORBIDDEN: multi-line
     comment blocks, paragraphs, or long explanations.
   - Comments only explain "why", not "what".
   - FORBIDDEN: comments repeating code, decorative dividers (`// =====`), commented-out code,
     emojis, "added by AI"/date/author notes, context-free TODOs.
   - Variable names, functions, components, tables, and columns: English.
   - Only exception: user-facing copy in UI and database seed data may be Indonesian.
2. Automated enforcement:
   - Enforce ESLint `max-len` with 80 character limit for comments.
   - Run `scripts/check-comments.mjs` via `npm run check:comments`.
   - Run `scripts/check-emoji.mjs` via `npm run check:emoji`.
   - Before closing ANY phase: run lint, check:comments, check:emoji, report results.
   - If Indonesian or long comments exist in touched legacy files, fix them immediately.

## 5. Security Invariants
- `SUPABASE_SERVICE_ROLE_KEY` must NEVER exist in client bundles or `VITE_*` environment variables.
- Row Level Security (RLS) is mandatory on all Supabase tables without exception.
- Anonymous public users can only SELECT rows where `status = 'published'`.
- Table `contact_messages` allows public INSERT only; anonymous SELECT is denied.
- Admin dashboard (`/admin/*`) is strictly guarded by server-side / client-side auth checks.

## 6. Definition of Done
- Zero floating decorative elements; clean canvas with optional static code-symbol tile pattern.
- Light and dark themes consistent, AA contrast compliant, stored in localStorage without flash.
- All components use design tokens; no hardcoded colors, radii, or shadows.
- Blue is the dominant accent; red, yellow, green convey semantic status only.
- All public content is database-driven and manageable via `/admin` without code changes.
- Zero emojis and zero text glyph icons across codebase, UI, docs, and agent responses.
- Zero Indonesian comments; zero comments over 80 characters; lint, check:comments, check:emoji pass.

## 7. Documentation Index
Read these documents as required:
- `docs/PRD.md`: Requirements, user stories, personas, scope, and success criteria.
- `docs/DESIGN.md`: Tokens, component specs, typography, themes, and anti-slop rules.
- `docs/ARCHITECTURE.md`: Folder layout, Supabase schema, RLS policies, auth, and failure modes.
- `docs/RULES.md`: Coding conventions, a11y checklist, git workflow, and testing criteria.
- `docs/CONTENT.md`: Tone of voice, case study schema, bullet formulas, and data placeholders.
- `docs/TASKS.md`: Current phase tracker, task checklists, blockers, and open questions.
- `docs/DECISIONS.md`: Log of technical and architectural decisions.
