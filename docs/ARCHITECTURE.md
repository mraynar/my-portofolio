# Technical Architecture & System Design

## 1. Stack & System Topology
- **Client**: React 19 SPA, Vite 8, React Router v7, Tailwind CSS v4.
- **Backend / BaaS**: Supabase (PostgreSQL 15+, Supabase Auth with Google OAuth, Supabase Storage).
- **Communication**: Supabase JavaScript Client (`@supabase/supabase-js`) using public anon key.
- **Static Assets**: SVG code pattern tiles, optimized WebP image assets in `/public/images/`.

## 2. Directory Structure
```text
mraynar-portfolio/
├── AGENTS.md
├── CLAUDE.md
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── CONTENT.md
│   ├── TASKS.md
│   └── DECISIONS.md
├── .claude/skills/
│   ├── portfolio-ui/SKILL.md
│   └── supabase-schema/SKILL.md
├── .cursor/rules/main.mdc
├── .github/copilot-instructions.md
├── scripts/
│   └── check-comments.mjs
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── src/
│   ├── components/
│   │   ├── ui/ (Button, Chip, Card, Input, Modal, Tabs)
│   │   ├── layout/ (Navbar, Footer, Container, BackgroundPattern)
│   │   └── admin/ (AdminSidebar, StatCard, DataTable, MarkdownEditor)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Experience.jsx
│   │   ├── Certificates.jsx
│   │   └── admin/ (Dashboard, Projects, Experience, Skills, Messages, Settings)
│   ├── lib/
│   │   ├── supabase.js (Anon client with memory cache)
│   │   ├── fallbackData.js (Offline & paused DB snapshot)
│   │   └── utils.js
│   ├── hooks/
│   │   ├── useDarkMode.js
│   │   ├── usePortfolioData.js
│   │   └── useAuth.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 3. Data Flow & Resilient Caching
1. **Public Site**:
   - `usePortfolioData` fetches published rows from Supabase on initial mount.
   - Successful queries populate an in-memory cache and write an encrypted snapshot to `localStorage`.
   - **Failure Mode / Graceful Degradation**: If Supabase responds with a network failure, 5xx, or paused project error, the hook falls back seamlessly to `fallbackData.js`, ensuring zero downtime for recruiters.
2. **Admin CMS**:
   - Operations require an authenticated session verified against the `admins` table via `is_admin()`.
   - Mutating mutations (INSERT, UPDATE, DELETE) directly execute through Supabase RPC / table clients.
   - Upon save, the client invalidates the local memory cache so public views update immediately.

## 4. Database Schema Specification

### 4.1 Core Tables
1. `profile`: Singleton table (`id uuid primary key default gen_random_uuid()`, `name text`, `tagline text`, `university text`, `value_prop text`, `bio text`, `avatar_url text`, `cv_url text`, `location text`, `status text`).
2. `socials`: Social links (`id`, `platform`, `url`, `label`, `sort_order`).
3. `skill_groups`: Groups (`id`, `name text`, `sort_order`, `color_accent text`).
4. `skills`: Skill items (`id`, `group_id references skill_groups`, `name text`, `sort_order`).
5. `projects`: Work showcase (`id`, `slug text unique`, `title text`, `label text`, `summary text`, `problem text`, `role text`, `solution text`, `impact text`, `badges text[]`, `image text`, `demo_url text`, `video_url text`, `repo_url text`, `repo_notice text`, `repo_reason text`, `featured boolean`, `status text`, `sort_order int`).
6. `project_media`: Additional gallery media for case studies (`id`, `project_id`, `url`, `alt text`, `caption text`, `sort_order`).
7. `experiences`: Timeline entries (`id`, `role text`, `org text`, `type text`, `period text`, `current boolean`, `photo text`, `photo_alt text`, `tags text[]`, `status text`, `sort_order int`).
8. `experience_bullets`: Impact bullets (`id`, `experience_id references experiences`, `content text`, `sort_order int`).
9. `certificates`: Credentials (`id`, `title text`, `issuer text`, `provider text`, `date text`, `credential_id text`, `credential_url text`, `thumbnail text`, `sort_order int`, `status text`).
10. `contact_messages`: Inbound inquiries (`id`, `name text`, `email text`, `message text`, `created_at timestamptz default now()`, `read boolean default false`).
11. `site_settings`: Configuration (`id`, `pattern_enabled boolean`, `availability_status text`, `seo_title text`, `seo_description text`, `section_visibility jsonb`).
12. `admins`: Authorized users (`id uuid references auth.users primary key`, `email text unique`, `created_at timestamptz default now()`).

### 4.2 Row Level Security (RLS) Policy Table
| Table | Anonymous / Public Permissions | Authenticated Admin Permissions |
| :--- | :--- | :--- |
| `profile`, `socials`, `skill_groups`, `skills`, `site_settings` | `SELECT` all rows | Full `ALL` (INSERT, UPDATE, DELETE, SELECT) |
| `projects`, `experiences`, `certificates` | `SELECT` where `status = 'published'` | Full `ALL` (all statuses) |
| `project_media`, `experience_bullets` | `SELECT` joined on published parent | Full `ALL` |
| `contact_messages` | `INSERT` only (rate-limited, no SELECT) | Full `ALL` (read, delete, triage) |
| `admins` | `NO ACCESS` (checked via `security definer`) | `SELECT` own record |

### 4.3 Auth Helper Function
```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where id = auth.uid()
  );
$$;
```

## 5. Storage Buckets
- `media`: Public read bucket for project images, gallery shots, and profile avatars. Max upload size: 5MB. MIME types: `image/webp, image/jpeg, image/png, image/svg+xml`.
- `documents`: Public read bucket for downloadable CV and credential PDFs. Max upload size: 10MB. MIME types: `application/pdf`.

## 6. Environment Variables
```bash
# Public variables (Client safe)
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Server / Local Migration variables (Never committed)
# SUPABASE_SERVICE_ROLE_KEY=ey... (CLI migrations only, never in code)
```

## 7. Production Caching & Bundle Strategy
- **SPA HTML Routes**: `vercel.json` sends `Cache-Control: no-cache, no-store, must-revalidate` for all non-asset routes (`/`, `/admin`, `/admin/*`, `/projects`, `/experience`) so browsers always fetch the latest hashed JS bundle.
- **Hashed Assets**: `/assets/*` uses `Cache-Control: public, max-age=31536000, immutable`.
- **Code Splitting**: Public routes ship `index.js` alongside independent `vendor-react`, `vendor-supabase`, and `vendor-icons` chunks; `AdminLayout` and `AdminLogin` load lazily on demand.
- **Deployment Policy**: `vercel.json` restricts automatic builds to `main` to preserve Vercel Hobby deployment quota.
```
