# Product Requirements Document (PRD)

## 1. Problem Statement
The current portfolio suffers from visual clutter (floating stars, diamonds, and particles), an oversized hero section, inconsistent card heights, generic non-impact copy, unverified stat claims ("2022 Since"), and unaccessible "Private Repository" labels offering zero proof of work. Furthermore, content is hardcoded in frontend files, requiring manual code modifications for every update.

## 2. Goals & Non-Goals
### 2.1 Goals
- Redesign the portfolio with the GDG Cloud Surabaya neo-brutalism design system (Google palette, clean cards, light and dark themes).
- Provide verifiable proof of engineering competence through deep case studies, architectural breakdowns, live links, and demo previews.
- Introduce a full-featured `/admin` CMS backed by Supabase (PostgreSQL, Auth, Storage) for real-time content management without code redeployment.
- Achieve Lighthouse scores >= 95 across Performance, Accessibility, Best Practices, and SEO in both light and dark themes.

### 2.2 Non-Goals
- Building an e-commerce store, paid subscription system, or public blogging community.
- Migrating frontend frameworks; the existing React 19 + Vite setup is strictly preserved.

## 3. Target Personas
1. **Technical Recruiters**: Scan within 30 seconds for core stack, notable projects, role experience, contact info, and downloadable CV.
2. **Academic Lecturers & Thesis Advisors**: Seek structural thinking, database architecture rigor, and clean engineering methodologies.
3. **Competition & Scholarship Judges**: Value tangible outcomes, quantifiable community/leadership metrics, and formal credentials.

## 4. User Stories & Acceptance Criteria

### 4.1 Public Portfolio
- **US-01 (Hero & Identity)**: As a visitor, I see Raynar's role, academic focus, primary CTAs, and verified social links in a balanced card layout.
  - *Acceptance*: Title max 2 lines, no overlapping elements, functioning CV download and project link.
- **US-02 (Project Showcase)**: As a recruiter, I can filter projects by category (All, Web, Mobile, UI/UX, Data) and review consistent 16:10 project cards.
  - *Acceptance*: Equal card heights, category chips, problem-solution-impact summary, no broken image ratios.
- **US-03 (Case Study Modal & Detail)**: As an interviewer, I can read the context, architecture, tech stack, and key metrics for any private or client project.
  - *Acceptance*: Case study modal opens smoothly, displays rationale for private repos, and supports deep-linking.
- **US-04 (Experience Timeline)**: As a judge, I can review Raynar's leadership and engineering roles ordered chronologically with measurable bullet points.
  - *Acceptance*: Step badges (01, 02...) in Google colors, single "Sekarang" marker for active positions, impact-first text.
- **US-05 (Certificates & Credentials)**: As a visitor, I can view verified certificates with issuer details and external verification links.
  - *Acceptance*: Display cards with category chips, Mono credential IDs, and working verification anchor tags.
- **US-06 (Contact Channel)**: As a collaborator, I can send a message directly or connect via email/LinkedIn.
  - *Acceptance*: Form with honeypot spam protection, client validation, rate limiting, and instant notification state.
- **US-07 (Theme Toggle)**: As a visitor, I can toggle between light and dark themes without page flash.
  - *Acceptance*: Theme persists in localStorage, follows system preference by default, and maintains AA contrast.

### 4.2 Admin Panel (`/admin`)
- **US-08 (Authentication)**: As the portfolio owner, I log in securely using Google OAuth with email whitelisting.
  - *Acceptance*: Public sign-ups blocked; non-whitelisted emails rejected; admin routes guarded.
- **US-09 (Dashboard Overview)**: As the owner, I can monitor draft vs published counts, unread messages, and profile status.
  - *Acceptance*: Real-time stat cards, quick action links, and recent message queue.
- **US-10 (Project Management)**: As the owner, I can create, edit, reorder, and toggle publication status for projects and media.
  - *Acceptance*: Markdown editor for case studies, image upload with automatic client compression (max 1600px).
- **US-11 (Experience & Skills Management)**: As the owner, I can manage skill categories, chips, experience entries, and bullet points.
  - *Acceptance*: Drag-and-drop sort order, status badges, and instant validation.
- **US-12 (Inbox & Inquiries)**: As the owner, I can read incoming contact messages, mark as read, delete, and reply via mailto.
  - *Acceptance*: Clean message list with sender details, timestamps, and read/unread status.
- **US-13 (Site Settings & SEO)**: As the owner, I can toggle section visibility, background pattern opacity, availability status, and default meta tags.
  - *Acceptance*: Real-time state updates and instant public reflection.

## 5. Scope In / Scope Out
- **Scope In**:
  - Full redesign of public pages (Home, Projects, Experience, Certificates, Contact).
  - Supabase database schema, RLS policies, migrations, and seed script.
  - Protected `/admin` interface with CRUD for all content entities.
  - Automated comment and lint validation pipeline.
- **Scope Out**:
  - Multi-user collaboration or role hierarchy beyond singleton admin.
  - Server-side email relay server (standard Supabase + client-side submission with honeypot).

## 6. Success Metrics
- Lighthouse scores >= 95 across Performance, Accessibility, Best Practices, and SEO in both themes.
- 100% of public content sourced dynamically from Supabase database with client fallback cache.
- Zero horizontal layout shift (CLS < 0.05) and zero layout clipping across 360px, 768px, 1024px, and 1440px viewports.
- Zero Indonesian comments and zero comments exceeding 80 characters.

## 7. Risks & Mitigation
- **Risk: Supabase free tier database pause**: Mitigation: Client-side cached snapshot fallback ensures site remains rendered even if remote database is paused.
- **Risk: Slow image load on mobile**: Mitigation: Client-side compression upon upload, WebP format, responsive image sizing, and lazy loading.
