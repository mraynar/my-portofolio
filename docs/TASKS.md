# Task Roadmap & Implementation Tracking

## 1. Project Phase Overview
- **Active Phase**: Phase E (Production Hardening & Launch - COMPLETED)
- **Current Blocker**: None (Production live at `https://mraynar.my.id`)

## 2. Phase Checklist

### Phase 0A: Documentation Foundation (CURRENT)
- [x] Create `AGENTS.md` (under 100 lines, stack, commands, absolute rules, security).
- [x] Create `CLAUDE.md` (`@AGENTS.md` + Claude Code notes).
- [x] Create `docs/PRD.md` (problem, personas, user stories, scope, metrics, risks).
- [x] Create `docs/DESIGN.md` (tokens table, typography, geometry, anti-slop, component states).
- [x] Create `docs/ARCHITECTURE.md` (stack, folder layout, data flow, schema, RLS, storage).
- [x] Create `docs/RULES.md` (code quality, a11y, security, git convention, comment enforcement).
- [x] Create `docs/CONTENT.md` (voice, forbidden cliches, case study schema, bullet formula).
- [x] Create `docs/TASKS.md` (phase tracking, blockers, open questions).
- [x] Create `docs/DECISIONS.md` (concise technical decision log).
- [x] Create `.claude/skills/portfolio-ui/SKILL.md` (UI component guide under 60 lines).
- [x] Create `.claude/skills/supabase-schema/SKILL.md` (Supabase schema guide under 60 lines).
- [x] Create `.cursor/rules/main.mdc` and `.github/copilot-instructions.md`.
- [x] Create `scripts/check-comments.mjs` and register `npm run check:comments`.
- [x] STOP and request confirmation from user before Phase 0B.

### Phase 0B: Codebase Audit & Schema Mapping (PENDING)
- [ ] Audit repository structure, dependencies, components, styling, and static data.
- [ ] Verify reported legacy issues (hero yellow box overlap, uneven card alignment, translation bugs).
- [ ] Provide comprehensive file-by-file refactor plan and static-to-Supabase schema mapping.
- [ ] STOP and request confirmation before Phase A.

### Phase A: Design System, Tokens & Base Components (PENDING)
- [ ] Refactor CSS variables for light/dark themes according to `docs/DESIGN.md`.
- [ ] Implement static code-symbol background pattern tile with opacity controls.
- [ ] Build core UI primitives (Button, Chip, Card, RowCard, PillTabs, Input, Toggle).
- [ ] Verify theme transitions, zero-flash script, and floating bottom-right controls.
- [ ] Run `npm run lint` and `npm run check:comments`.

### Phase B: Supabase Database, RLS & Seed Data (PENDING)
- [ ] Author versioned SQL migrations in `supabase/migrations/`.
- [ ] Establish Row Level Security (RLS) policies for all 12 tables.
- [ ] Author `is_admin()` security definer function and configure storage buckets.
- [ ] Populate `seed.sql` from current portfolio data.
- [ ] Generate TypeScript/JSDoc types and verify RLS test policies.
- [ ] Run `npm run lint` and `npm run check:comments`.

### Phase M: Admin CMS Panel & Supabase Backend (COMPLETED)
- [x] Author comprehensive idempotent SQL schema in `supabase/schema.sql`.
- [x] Setup RLS policies, security definer function, and storage buckets.
- [x] Build data access layer in `src/lib/supabase.js` with offline fallback.
- [x] Connect public site (`App.jsx`, `ProjectPage.jsx`, `ExperiencePage.jsx`) to dynamic data.
- [x] Build interactive contact form submitting to `contact_messages`.
- [x] Build admin authentication (`AdminLogin.jsx`) and protected dashboard layout (`AdminLayout.jsx`).
- [x] Build management tabs: Overview, Profile, Projects, Experience, Skills, Education, Messages.
- [x] Implement client-side storage uploader for images and CV documents.
- [x] Pass all quality checks (`check:comments`, `check:emoji`, `lint`, `check:layout`, `build`).

### Phase C: Static Asset Cleanup & Waste Removal (COMPLETED)
- [x] Remove unused template assets in `src/assets/` (`hero.png`, `vite.svg`, `react.svg`).
- [x] Remove legacy unused logos in `public/images/logo/` (14 unused logo files, 708 KB).
- [x] Remove unused certificate scans, duplicates, and PDFs in `public/images/sertifikasi/` (16 MB).
- [x] Remove unreferenced portrait duplicates (`Profile Kedua.PNG`, `profile.PNG`).
- [x] Remove unreferenced static SVG sprite (`public/icons.svg`).
- [x] Remove OS clutter (`.DS_Store`) and empty tool folders (`.qodo`).
- [x] Clean up unreferenced image fields in `src/data.jsx`.
- [x] Verify zero broken references across codebase via `git grep` and automated layout test.

### Phase D: Public Site Integration & Resilient Caching (COMPLETED)
- [x] Connect public pages to Supabase data with IndexedDB offline mirror.
- [x] Trust empty Supabase tables without resurrecting static seed arrays.
- [x] Render all public sections with neo-brutalist design tokens and zero emojis.
- [x] Verify SEO meta tags, canonical link, robots.txt, sitemap.xml, and manifest.
- [x] Audit full bilingual ID/EN translation coverage across all public views.

### Phase E: Quality Assurance, Performance & Launch (COMPLETED)
- [x] Verify responsiveness across 360px to 1920px in light and dark themes.
- [x] Add skip-to-content link, Escape key dismissal, and dynamic route titles.
- [x] Split Vite vendor chunks and lazy-load `/admin` routes for smaller payloads.
- [x] Add multi-select bulk deletion and drag-and-drop reordering in Admin CMS v2.1.
- [x] Configure `vercel.json` SPA `no-store` HTML headers and main-only deploys.
- [x] Pass `npm run check:all` and deploy verified build to `https://mraynar.my.id`.
