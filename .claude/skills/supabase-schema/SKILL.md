---
name: supabase-schema
description: Procedures for defining Supabase migrations, RLS security policies, TypeScript definitions, and seed data.
---
# Procedure: Managing Supabase Schema & Security
1. **Migration File**: Create timestamped SQL in `supabase/migrations/<timestamp>_<name>.sql`. Never modify live databases manually.
2. **Table Standards**: Include `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, and `status text`.
3. **Mandatory RLS**: Execute `alter table public.<name> enable row level security;` on every table.
4. **Public Policy**: Restrict public SELECT with `status = 'published'` (or deny SELECT entirely for `contact_messages`).
5. **Admin Policy**: Grant full access using `to authenticated using (public.is_admin()) with check (public.is_admin());`.
6. **Types & Seeds**: Update client interfaces and append realistic seed records to `supabase/seed.sql`.
7. **Verification**: Verify that anon clients cannot access draft rows or mutate data.
