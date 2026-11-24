# Content Strategy, Voice & Taxonomy

## 1. Tone of Voice & Style Guide
- **Tone**: Authoritative, objective, structured, and metric-driven. Raynar writes as a pragmatic software engineer and Information Systems student who solves tangible operational problems.
- **Language Policy**:
  - User-facing UI copy and database seed content is written in clear, professional Indonesian.
  - All code identifiers, comments, documentation (`docs/`), git commits, and technical keys are written in English.
- **Forbidden Cliche Vocabulary**:
  Do NOT use these generic phrases:
  - "passionate developer", "cutting-edge solutions", "high-performance architecture",
  - "frictionless experience", "all-in-one platform", "my journey", "proud to present".
  Instead, state the exact process, tools, user scale, and quantifiable outcome.

## 2. Project Case Study Pattern
Every project in the database must follow this structured schema:
1. **Title & Category**: Clear title in Title Case (e.g. *Sistem Manajemen Rumah Kos Griya*), paired with a semantic category chip (`Web App`, `Mobile App`, `UI/UX Design`, `Data Analyst`).
2. **Context & Problem**: Exactly 1 to 2 sentences detailing the operational bottleneck before intervention.
3. **Role & Client/Scope**: Explicit scope (e.g. *Full-stack Developer (Frontend, Backend, Database Architecture)* for a commercial client or campus organization).
4. **Architecture & Solution**: Key architectural choices (framework, database design, external API integrations such as Midtrans or Firebase).
5. **Measurable Outcome / Impact**: Concrete metric (e.g. *Memangkas waktu rekapitulasi pembayaran bulanan hingga 70%*).
6. **Repository Disclosure**: If private, specify reason (e.g. *Repositori Privat (Proyek Komersial Klien)*) and provide deep case study evidence.

## 3. Experience Bullet Formula
Every bullet point in the Experience section MUST strictly follow this formula:
`[Strong Action Verb] + [System / Organizational Objective] + [Measurable Metric / Tangible Outcome]`

### Examples:
- **Correct**: *Merancang dan mengimplementasikan portal web UKM mandiri berbasis PHP dan MySQL, mendigitalisasi lebih dari 100 arsip proposal riset mahasiswa.*
- **Correct**: *Mengotomatisasi rekonsiliasi pembayaran sewa bulanan dengan gateway Midtrans, mereduksi waktu rekap manual sebesar 70%.*
- **Incorrect (Rejected)**: *Make a communication cooperation with other universities.* (Poor translation, zero metrics).
- **Incorrect (Rejected)**: *Active student reasoning department member.* (Vague and awkward).

## 4. Placeholders & Open Questions (`[TBD: ...]`)
When seeding the database or drafting case studies, use these placeholders until verified:
- `[TBD: ADMIN_EMAIL]`: What is your primary Google Account email address for `/admin` login? (Recommended: `raynarham23@gmail.com`).
- `[TBD: SUPABASE_PROJECT_URL]`: What is the Supabase project reference URL and public anon key?
- `[TBD: CV_FILE_PATH]`: Path or URL to the latest verified PDF curriculum vitae.
- `[TBD: LIVE_DEMO_URLS]`: Specific live demo URLs or video screencasts for private projects to replace private repository notices.
