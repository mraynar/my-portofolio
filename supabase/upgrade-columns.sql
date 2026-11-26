-- Idempotent schema upgrade for existing Supabase projects
alter table public.site_settings
  add column if not exists role text default 'Mahasiswa Sistem Informasi & Pengembang Perangkat Lunak',
  add column if not exists code_card_title text default 'raynar-dev.ts',
  add column if not exists instagram_url text default 'https://instagram.com/mraynarr',
  add column if not exists custom_project_count text default '',
  add column if not exists custom_cert_count text default '',
  add column if not exists start_year text default '',
  add column if not exists code_quality text default '',
  add column if not exists about_kicker text default 'TENTANG SAYA',
  add column if not exists about_title text default 'Tentang',
  add column if not exists about_title_accent text default 'Saya',
  add column if not exists about_subtitle text,
  add column if not exists skills_kicker text default 'KEAHLIAN TEKNIS',
  add column if not exists skills_title text default 'Keahlian &',
  add column if not exists skills_title_accent text default 'Teknologi',
  add column if not exists skills_subtitle text,
  add column if not exists projects_kicker text default 'PORTOFOLIO DIGITAL',
  add column if not exists projects_title text default 'Proyek',
  add column if not exists projects_title_accent text default 'Unggulan',
  add column if not exists projects_subtitle text,
  add column if not exists exp_kicker text default 'REKAM JEJAK PROFESIONAL',
  add column if not exists exp_title text default 'Pengalaman',
  add column if not exists exp_title_accent text default 'Magang & Organisasi',
  add column if not exists exp_subtitle text,
  add column if not exists certs_kicker text default 'KREDENSIAL PROFESIONAL',
  add column if not exists certs_title text default 'Sertifikasi &',
  add column if not exists certs_title_accent text default 'Lisensi',
  add column if not exists certs_subtitle text,
  add column if not exists contact_kicker text default 'HUBUNGI SAYA',
  add column if not exists contact_title text default 'Mari',
  add column if not exists contact_title_accent text default 'Berkolaborasi',
  add column if not exists contact_subtitle text,
  add column if not exists numbers_kicker text default 'BY THE NUMBERS',
  add column if not exists numbers_title text default 'Dampak & Pencapaian Riil',
  add column if not exists stat1_value text default '20+',
  add column if not exists stat1_label text default 'PROYEK DIGITAL',
  add column if not exists stat1_desc text,
  add column if not exists stat2_value text default '15+',
  add column if not exists stat2_label text default 'SERTIFIKASI RESMI',
  add column if not exists stat2_desc text,
  add column if not exists stat3_value text default '2021',
  add column if not exists stat3_label text default 'REKAYASA SOFTWARE',
  add column if not exists stat3_desc text,
  add column if not exists stat4_value text default '100%',
  add column if not exists stat4_label text default 'INTEGRITAS SOLUSI',
  add column if not exists stat4_desc text;

alter table public.experience
  add column if not exists category text,
  add column if not exists org_url text;

alter table public.education
  add column if not exists score text,
  add column if not exists score_label text;

alter table public.certifications
  add column if not exists image_url text;

-- Relax project label check so custom labels sync cleanly
alter table public.projects drop constraint if exists projects_label_check;
