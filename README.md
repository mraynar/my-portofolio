# Muhammad Raynar Hammam - Personal Portfolio & Admin CMS

Production portfolio and full-stack Admin CMS for **Muhammad Raynar Hammam**, built with the neo-brutalist Google palette design system, bilingual ID/EN support, and live Supabase persistence.

Live site: https://mraynar.my.id

## Technology Stack

- **Frontend**: React 19, Vite 8, React Router v7, Tailwind CSS v4, Lucide React
- **Backend & Database**: Supabase (PostgreSQL 15+, Row Level Security, Auth, Storage)
- **Caching & Resilience**: IndexedDB local mirror with cross-tab BroadcastChannel sync
- **Deployment**: Vercel (main-only auto-deployment) behind Cloudflare DNS proxy

## Core Features

- **Public Portfolio**:
  - Responsive Hero, About & Education Timeline, By The Numbers metrics, Technical Skills, Experience Timeline (2 latest preview per category with Show More toggle), Featured Projects & Case Study Modal, Certifications Slider (issuer-first badges), and Contact Form.
  - Full bilingual toggle (`ID` / `EN`) with exact translations and idempotent lookup.
  - Light and dark themes persisted in `localStorage` without flash.
  - Lazy-loaded Admin bundle and manual Vite vendor chunking for fast first paint.
- **Admin CMS (`/admin`)**:
  - Protected by Supabase Auth + `admins` table RLS (`is_admin()`).
  - Full CRUD for Site Profile, Projects, Experience, Skills, Formal Education, Certifications, and Contact Messages.
  - Drag-and-drop card reordering and position dropdown selectors.
  - Multi-select bulk deletion (`BulkActionBar`) across all CMS collections.
  - Client-side image cropping, compression, and Supabase Storage uploads.
  - Custom platform provider entry on certifications alongside quick presets.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your public Supabase credentials:
   ```bash
   cp .env.example .env
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

## Verification Scripts

- `npm run dev` - Run local dev server at `http://localhost:5173`
- `npm run build` - Build production client bundle with vendor chunk splitting
- `npm run lint` - Run ESLint across the repository
- `npm run check:comments` - Enforce English-only, single-line comments (max 80 chars)
- `npm run check:emoji` - Enforce zero emojis and zero text-glyph icons
- `npm run check:layout` - Run Playwright layout audit across 14 viewport/theme pairs
- `npm run check:all` - Execute all quality gates sequentially

## Documentation

- `docs/PRD.md` - Product requirements, personas, and delivered scope
- `docs/DESIGN.md` - Design tokens, typography, and neo-brutalist component specs
- `docs/ARCHITECTURE.md` - Topology, schema, RLS policies, and caching model
- `docs/RULES.md` - Coding conventions, security invariants, and git workflow
- `docs/CONTENT.md` - Content structure, case study schema, and i18n rules
- `docs/TASKS.md` - Phase roadmap and completion status
- `docs/DECISIONS.md` - Architectural Decision Records (ADR)
- `supabase/README.md` - SQL setup and bulk import reference
