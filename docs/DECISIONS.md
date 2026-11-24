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
