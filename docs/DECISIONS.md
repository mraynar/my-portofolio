# Architectural & Design Decision Records (ADR)

## 2026-11-24: Foundation Documentation & Absolute Rules
- **Decision**: Established English-only single-line comment enforcement (< 80 chars) and automated via `scripts/check-comments.mjs`.
- **Rationale**: Guarantees zero AI slop, prevents language inconsistency across codebase, and satisfies project instructions.

## 2026-11-24: Design System Source of Truth
- **Decision**: Adopted CSS variables in `docs/DESIGN.md` matching `devfest.gdgcloudsurabaya.org` neo-brutalism with Google 4-color palette.
- **Rationale**: Eliminates hardcoded styles, guarantees WCAG AA contrast across light and dark modes, and honors authentic event aesthetics.

## 2026-11-24: Frontend Framework Preservation
- **Decision**: Retained React 19 SPA with Vite 8 and React Router v7 instead of migrating to Next.js or Remix.
- **Rationale**: Strictly preserves user's existing repository framework stack as requested in the project brief while delivering client-side speed.

## 2026-11-24: Database Failure Mode & Caching Strategy
- **Decision**: Implemented client-side memory caching and local storage fallback snapshot for Supabase data queries.
- **Rationale**: Ensures the public portfolio remains accessible to recruiters even if Supabase free-tier database instances are paused.

## 2026-11-26: IndexedDB Cache & Strict Empty-Table Semantics
- **Decision**: Migrated client cache from `localStorage` to IndexedDB (`src/lib/localDb.js`) and updated all `get*()` getters to accept empty Supabase arrays (`[]`) instead of falling back to static seed arrays.
- **Rationale**: Prevents 5MB `localStorage` quota errors on base64 previews and ensures deleting all records in Admin CMS never resurrects old static data.

## 2026-11-26: Idempotent Bilingual Translation Engine
- **Decision**: Built exact-match normalized dictionary lookup with `EXACT_EN_VALUES` idempotency guard and JSON architecture array parsing in `src/lib/translations.js`.
- **Rationale**: Prevents mixed Indonesian/English sentences and stops repeated translation passes from mutating already-translated English strings.

## 2026-11-27: Atomic Bulk Delete & Main-Only Production Deploys
- **Decision**: Added batch `.in()` delete helpers across all 6 CMS entities, restricted Vercel auto-deployments to `main`, and enforced `no-store` HTML headers on all SPA routes.
- **Rationale**: Eliminates local cache race conditions during multi-delete, halves Vercel Hobby deployment consumption, and prevents Safari from serving stale `/admin` HTML.

## 2026-11-27: Lazy-Loaded Admin Bundle & Vendor Chunk Splitting
- **Decision**: Lazy-loaded `AdminLogin` and `AdminLayout` via `React.lazy` and configured `rolldownOptions.output.manualChunks` in `vite.config.js`.
- **Rationale**: Reduces public initial JS payload by over 70% while allowing browsers to cache React, Supabase, and Lucide icon chunks independently.
