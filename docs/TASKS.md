# Task Roadmap & Implementation Tracking

## 1. Project Phase Overview
- **Active Phase**: Phase 0A (Foundation Documentation)
- **Current Blocker**: None (Awaiting user confirmation of Phase 0A before proceeding to Phase 0B Audit)

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

### Phase C: Admin CMS Panel (`/admin`) (PENDING)
- [ ] Build Google OAuth authentication flow and admin session provider.
- [ ] Develop responsive admin layout (grouped sidebar, topbar, mobile drawer).
- [ ] Build Admin Dashboard (overview stats, draft/published counts, unread inquiries).
- [ ] Build CRUD interfaces for Profile, Socials, Skills, Projects, Experiences, Certificates.
- [ ] Build client-side image compressor (max 1600px WebP) and Markdown editor.
- [ ] Build Contact Inbox (mark read, delete, mailto action).
- [ ] Run `npm run lint` and `npm run check:comments`.

### Phase D: Public Site Integration & Resilient Caching (PENDING)
- [ ] Connect public pages to Supabase data via `usePortfolioData`.
- [ ] Implement memory cache and localStorage snapshot fallback for paused database mode.
- [ ] Render all public sections using newly built design system components.
- [ ] Verify dynamic SEO meta tags and Person structured data.
- [ ] Run `npm run lint` and `npm run check:comments`.

### Phase E: Quality Assurance, Performance & Launch (PENDING)
- [ ] Test responsiveness across 360px, 768px, 1024px, and 1440px without horizontal scroll.
- [ ] Verify keyboard accessibility, focus rings, and screen reader announcements.
- [ ] Run Lighthouse audits targeting scores >= 95 in both themes.
- [ ] Run `npm run check:comments` and `npm run lint` to guarantee zero violations.
- [ ] Deliver final deployment guide and README.
