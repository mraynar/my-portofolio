# Supabase Schema & Bulk Import Reference

## Schema Files

- `supabase/schema.sql` - Idempotent full schema, RLS policies, `is_admin()` helper, and storage buckets.
- `supabase/upgrade-columns.sql` - Safe additive column migrations for existing databases.
- `supabase/create-admin.sql` - Registers an authenticated Supabase user UUID in `public.admins`.

## Bulk Importing Projects via SQL Editor

All rows inserted into `public.projects` should follow these constraints:

- `id` (`text primary key`): unique kebab-case slug (e.g., `pelindo-ai-terminal`).
- `label` (`text not null`): one of `'Web App'`, `'Mobile App'`, `'UI/UX Design'`, or `'Data Analyst'`.
- `badges` (`text[] not null`): PostgreSQL array literal (`ARRAY['React', 'FastAPI', 'PostgreSQL']`).
- `case_study_architecture` (`text`): JSON-encoded string array (`'["Point 1.","Point 2."]'`) rendered as bullets in the case study modal.
- `status` (`text not null`): `'published'` or `'draft'`.
- `featured` (`boolean not null`): `true` for up to 3 projects highlighted on the home page.
- `image` (`text not null`): image URL or empty string `''` when uploading later through `/admin`.

Use `ON CONFLICT (id) DO UPDATE SET ...` so re-running an import script stays idempotent.
