-- Supabase SQL schema and initial seed data
create extension if not exists "uuid-ossp";

-- 1. Admins Table
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz default now()
);

-- Admin verification helper function
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.admins where id = auth.uid()
  );
$$;

-- 2. Site Settings Table (Single row configuration)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Muhammad Raynar Hammam',
  kicker text not null default 'SISTEM INFORMASI & SOFTWARE ENGINEER',
  status_badge text not null default 'UPN Veteran Jawa Timur',
  headline text not null default 'Muhammad Raynar',
  headline_accent text not null default 'Hammam',
  value_prop text not null,
  university text not null default 'UPN "Veteran" Jawa Timur',
  photo_url text not null default '/images/about/Profile Utama.PNG',
  cv_url text not null default '/documents/CV_Muhammad_Raynar_Hammam.pdf',
  github_url text not null default 'https://github.com/mraynar',
  linkedin_url text not null default 'https://linkedin.com/in/mraynar',
  email text not null default 'raynarham23@gmail.com',
  location text not null default 'Surabaya, ID',
  timezone text not null default 'WIB (UTC+7)',
  availability_status text not null default 'Terbuka untuk Magang & Peluang Kolaborasi Proyek',
  about_p1 text not null,
  about_p2 text not null,
  about_p3 text not null,
  principle_title text not null default 'PRINSIP REKAYASA (KEY POINT)',
  principle_quote text not null default 'Menghubungkan proses bisnis nyata dengan arsitektur perangkat lunak yang fungsional, terukur, dan efisien.',
  about_kicker text default 'TENTANG SAYA',
  about_title text default 'Tentang',
  about_title_accent text default 'Saya',
  about_subtitle text,
  skills_kicker text default 'KEAHLIAN TEKNIS',
  skills_title text default 'Keahlian &',
  skills_title_accent text default 'Teknologi',
  skills_subtitle text,
  projects_kicker text default 'PORTOFOLIO DIGITAL',
  projects_title text default 'Proyek',
  projects_title_accent text default 'Unggulan',
  projects_subtitle text,
  exp_kicker text default 'REKAM JEJAK PROFESIONAL',
  exp_title text default 'Pengalaman',
  exp_title_accent text default 'Magang & Organisasi',
  exp_subtitle text,
  certs_kicker text default 'KREDENSIAL PROFESIONAL',
  certs_title text default 'Sertifikasi &',
  certs_title_accent text default 'Lisensi',
  certs_subtitle text,
  contact_kicker text default 'HUBUNGI SAYA',
  contact_title text default 'Mari',
  contact_title_accent text default 'Berkolaborasi',
  contact_subtitle text,
  numbers_kicker text default 'BY THE NUMBERS',
  numbers_title text default 'Dampak & Pencapaian Riil',
  updated_at timestamptz default now()
);

-- 3. Stat Metrics Table (By The Numbers)
create table if not exists public.stat_metrics (
  id uuid primary key default gen_random_uuid(),
  number_value text not null,
  label text not null,
  description text not null,
  color_theme text not null check (color_theme in ('blue', 'green', 'yellow', 'red')),
  order_index int not null default 0,
  updated_at timestamptz default now()
);

-- 4. Education History Table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  period text not null,
  focus text not null,
  active boolean not null default false,
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- 5. Skill Categories Table
create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  skills text[] not null default '{}',
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- 6. Projects Table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  label text not null check (label in ('Web App', 'Mobile App', 'UI/UX Design', 'Data Analyst')),
  featured boolean not null default false,
  image text not null,
  problem text not null,
  solution text not null,
  impact text not null,
  badges text[] not null default '{}',
  demo_url text,
  repo_notice text not null default 'Repositori Privat (Proyek Komersial / Institusi)',
  repo_reason text not null default 'Kode sumber dilindungi NDA atau hak cipta klien.',
  case_study_role text not null default 'Full-Stack Developer',
  case_study_client text,
  case_study_duration text not null default '2024',
  case_study_background text,
  case_study_solution text,
  case_study_architecture text,
  case_study_impact text,
  order_index int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz default now()
);

-- 7. Experience Table
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  org text not null,
  period text not null,
  type text not null,
  current boolean not null default false,
  bullets text[] not null default '{}',
  tags text[] not null default '{}',
  photo text,
  photo_alt text,
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- 8. Certifications Table
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  provider text not null,
  credential_id text not null,
  credential_url text default '#',
  date text not null,
  order_index int not null default 0,
  image_url text,
  created_at timestamptz default now()
);

-- 9. Contact Messages Table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.stat_metrics enable row level security;
alter table public.education enable row level security;
alter table public.skill_categories enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.certifications enable row level security;
alter table public.contact_messages enable row level security;

-- Drop existing policies cleanly
drop policy if exists "Admins viewable by authenticated admins" on public.admins;
drop policy if exists "Public site settings read access" on public.site_settings;
drop policy if exists "Admin site settings full access" on public.site_settings;
drop policy if exists "Public stat metrics read access" on public.stat_metrics;
drop policy if exists "Admin stat metrics full access" on public.stat_metrics;
drop policy if exists "Public education read access" on public.education;
drop policy if exists "Admin education full access" on public.education;
drop policy if exists "Public skill categories read access" on public.skill_categories;
drop policy if exists "Admin skill categories full access" on public.skill_categories;
drop policy if exists "Public published projects read access" on public.projects;
drop policy if exists "Admin projects full access" on public.projects;
drop policy if exists "Public experience read access" on public.experience;
drop policy if exists "Admin experience full access" on public.experience;
drop policy if exists "Public certifications read access" on public.certifications;
drop policy if exists "Admin certifications full access" on public.certifications;
drop policy if exists "Public contact messages insert only" on public.contact_messages;
drop policy if exists "Admin contact messages full access" on public.contact_messages;

-- RLS Policies: Admins table
create policy "Admins viewable by authenticated admins"
  on public.admins for select to authenticated
  using (public.is_admin());

-- RLS Policies: Public read access
create policy "Public site settings read access"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "Public stat metrics read access"
  on public.stat_metrics for select to anon, authenticated
  using (true);

create policy "Public education read access"
  on public.education for select to anon, authenticated
  using (true);

create policy "Public skill categories read access"
  on public.skill_categories for select to anon, authenticated
  using (true);

create policy "Public published projects read access"
  on public.projects for select to anon, authenticated
  using (status = 'published');

create policy "Public experience read access"
  on public.experience for select to anon, authenticated
  using (true);

create policy "Public certifications read access"
  on public.certifications for select to anon, authenticated
  using (true);

-- Public insert only for contact form
create policy "Public contact messages insert only"
  on public.contact_messages for insert to anon, authenticated
  with check (true);

-- RLS Policies: Admin full access
create policy "Admin site settings full access"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin stat metrics full access"
  on public.stat_metrics for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin education full access"
  on public.education for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin skill categories full access"
  on public.skill_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin projects full access"
  on public.projects for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin experience full access"
  on public.experience for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin certifications full access"
  on public.certifications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Admin contact messages full access"
  on public.contact_messages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Storage Buckets Configuration (media and documents)
insert into storage.buckets (id, name, public)
values
  ('media', 'media', true),
  ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies
drop policy if exists "Public media bucket read access" on storage.objects;
drop policy if exists "Admin media bucket upload" on storage.objects;
drop policy if exists "Public documents bucket read access" on storage.objects;
drop policy if exists "Admin documents bucket upload" on storage.objects;

create policy "Public media bucket read access"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy "Admin media bucket upload"
  on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "Public documents bucket read access"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'documents');

create policy "Admin documents bucket upload"
  on storage.objects for all to authenticated
  using (bucket_id = 'documents' and public.is_admin())
  with check (bucket_id = 'documents' and public.is_admin());

-- Seed initial site settings
insert into public.site_settings (
  site_name, kicker, status_badge, headline, headline_accent,
  value_prop, university, photo_url, cv_url, github_url, linkedin_url,
  email, location, timezone, availability_status,
  about_p1, about_p2, about_p3, principle_title, principle_quote
) values (
  'Muhammad Raynar Hammam',
  'SISTEM INFORMASI & SOFTWARE ENGINEER',
  'UPN Veteran Jawa Timur',
  'Muhammad Raynar',
  'Hammam',
  'Mengembangkan aplikasi web dan mobile berbasis sistem informasi yang terukur, fungsional, dan berorientasi pada efisiensi operasional.',
  'UPN "Veteran" Jawa Timur',
  '/images/about/Profile Utama.PNG',
  'https://drive.google.com/file/d/1B-wFm34HwZ9FpS7aI2K1v1u8z2C3d4E5/view',
  'https://github.com/mraynar',
  'https://www.linkedin.com/in/mraynar',
  'raynarham23@gmail.com',
  'Surabaya, Jawa Timur, Indonesia',
  'WIB (UTC+7)',
  'Terbuka untuk Magang & Peluang Kolaborasi Proyek',
  'Saya adalah mahasiswa Sistem Informasi di UPN "Veteran" Jawa Timur dengan fokus rekayasa perangkat lunak web full-stack, solusi mobile lintas platform, dan pemodelan basis data relasional.',
  'Perjalanan teknis saya berakar dari pendidikan kejuruan di SMK Negeri 2 Surabaya (Jurusan Rekayasa Perangkat Lunak). Di sana saya membangun fondasi pemrograman terstruktur, algoritma, serta arsitektur aplikasi berbasis web modern.',
  'Dalam setiap proyek, saya mengutamakan fungsionalitas dan efisiensi operasional: memetakan alur proses bisnis riil ke dalam antarmuka yang intuitif dan sistem backend yang tangguh.',
  'PRINSIP REKAYASA (KEY POINT)',
  'Menghubungkan proses bisnis nyata dengan arsitektur perangkat lunak yang fungsional, terukur, dan efisien.'
) on conflict do nothing;

-- 2. Stat Metrics Seed
insert into public.stat_metrics (number_value, label, description, color_theme, order_index)
values
  ('[8+]', 'PROYEK DIGITAL', 'Aplikasi web full-stack, mobile lintas platform, dan sistem informasi bisnis operasional.', 'blue', 1),
  ('[9+]', 'SERTIFIKASI RESMI', 'Kompetensi terverifikasi dari IBM, Dicoding, DQLab, Udemy & AWS.', 'green', 2),
  ('[2021]', 'REKAYASA SOFTWARE', 'Fondasi pemrograman terstruktur dimulai dari bangku SMK RPL hingga S1 Sistem Informasi.', 'yellow', 3),
  ('[100%]', 'INTEGRITAS SOLUSI', 'Komitmen arsitektur bersih, performa terukur, dan dokumentasi yang transparan.', 'red', 4)
on conflict do nothing;

-- 3. Education Seed
insert into public.education (school, degree, period, focus, active, order_index)
values
  ('UPN "Veteran" Jawa Timur', 'S1 Sistem Informasi', '2024 - Sekarang', 'Fokus pada rekayasa perangkat lunak, arsitektur basis data, dan analisis sistem bisnis.', true, 1),
  ('SMKN 2 Surabaya', 'Rekayasa Perangkat Lunak (RPL)', '2021 - 2024', 'Mempelajari dasar algoritma pemrograman, web development full-stack, dan basis data relasional.', false, 2)
on conflict do nothing;

-- 4. Skill Categories Seed
insert into public.skill_categories (name, skills, order_index)
values
  ('Frontend Development', array['React', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Bootstrap', 'HTML5 / CSS3'], 1),
  ('Backend & Database', array['Laravel', 'PHP', 'Python', 'MySQL', 'Supabase', 'RESTful API'], 2),
  ('Mobile & Cloud', array['Flutter', 'Dart', 'Firebase', 'Google Cloud Run'], 3),
  ('Tools & Analytics', array['Git & GitHub', 'Google Looker Studio', 'Power BI', 'Figma', 'Postman'], 4)
on conflict do nothing;

-- 5. Projects Seed
insert into public.projects (
  id, title, label, featured, image, problem, solution, impact,
  badges, demo_url, repo_notice, repo_reason,
  case_study_role, case_study_client, case_study_duration,
  case_study_background, case_study_solution, case_study_architecture, case_study_impact,
  order_index, status
) values
(
  'griya-asri',
  'Sistem Manajemen Rumah Kos Griya Asri',
  'Web App',
  true,
  '/images/projects/griyaasri.png',
  'Pengelolaan sewa kos dan penagihan sewa bulanan sebelumnya masih dicatat manual via nota fisik dan spreadsheet, sering terjadi selisih dan keterlambatan konfirmasi pembayaran.',
  'Membangun aplikasi web manajemen kos terpadu dengan integrasi payment gateway Midtrans, sistem otomatisasi invoice bulanan, dan portal mandiri penghuni kos.',
  'Memangkas waktu rekapitulasi pembayaran bulanan hingga 70% dan menyediakan rekam jejak transaksi yang transparan bagi pemilik dan penyewa kos.',
  array['Laravel', 'Tailwind CSS', 'Midtrans', 'MySQL'],
  'https://griyaasri.demo.app',
  'Repositori Privat (Proyek Komersial Klien)',
  'Kode sumber dilindungi NDA klien komersial. Akses demo dan potongan arsitektur dapat ditunjukkan saat wawancara.',
  'Lead Full-Stack Developer',
  'Manajemen Griya Asri Surabaya',
  '4 Bulan (2024)',
  'Rumah kos Griya Asri mengelola puluhan kamar dengan perputaran penghuni mahasiswa dan pekerja. Rekapitulasi sewa bulanan via chat WhatsApp manual memicu selisih pembukuan dan telat tagihan.',
  'Mengembangkan platform sistem informasi berbasis Laravel dengan arsitektur MVC, integrasi webhook Midtrans Snap, panel admin ringkas, serta notifikasi tagihan otomatis.',
  'Laravel 11 backend, MySQL relational database, Tailwind CSS frontend dengan layout responsif mobile-first, dan payment gateway API integration.',
  'Otomatisasi 100% verifikasi pembayaran sewa, menghilangkan komplain selisih pencatatan, dan mempercepat rekonsiliasi kas bulanan.',
  1,
  'published'
),
(
  'ukm-penalaran',
  'Portal Digital UKM Penalaran & Penelitian',
  'Web App',
  true,
  '/images/projects/ukm-penalaran.png',
  'Alur pengumpulan proposal riset ilmiah mahasiswa dan publikasi dokumentasi kegiatan tersebar di berbagai tautan formulir terpisah tanpa repositori terpusat.',
  'Merancang portal organisasi terintegrasi untuk arsip karya tulis ilmiah, pendaftaran lokakarya riset, dan sistem voting daring kepengurusan UKM.',
  'Mendigitalisasi lebih dari 100 arsip proposal dan artikel ilmiah serta mempercepat verifikasi berkas lomba internal anggota.',
  array['WordPress Engine', 'PHP', 'MySQL', 'UI/UX Design'],
  'https://penalaran.upnjatim.ac.id',
  'Repositori Institusi Kampus',
  'Dikelola di bawah infrastruktur internal kampus UPN Veteran Jawa Timur.',
  'Web & IT Staff',
  'UKM Penalaran dan Penelitian UPN Jatim',
  '6 Bulan (2024)',
  'Proses kurasi delegasi kompetisi karya tulis ilmiah membutuhkan pengarsipan terstruktur agar karya anggota tidak hilang antarperiode kepengurusan.',
  'Membangun sistem arsip digital berbasis kategori bidang ilmu dengan alur verifikasi multi-tahap oleh dewan pertimbangan organisasi.',
  'WordPress CMS kustom dengan arsitektur basis data relasional MySQL dan optimasi caching Cloudflare.',
  'Menghemat waktu verifikasi berkas lomba panitia sebesar 50% dan meningkatkan keterbacaan publikasi riset kampus.',
  2,
  'published'
),
(
  'temu-aksi',
  'TemuAksi - Platform Kolaborasi Aksi Sosial',
  'Mobile App',
  true,
  '/images/projects/temuaksi.png',
  'Inisiator komunitas sosial lokal kesulitan mencari sukarelawan berkeahlian spesifik karena ketiadaan platform agregator aksi sosial yang tepercaya.',
  'Mengembangkan aplikasi mobile penghubung sukarelawan dengan kampanye sosial berbasis lokasi, kategori minat keahlian, dan pelaporan dampak kegiatan real-time.',
  'Menghubungkan puluhan relawan mahasiswa dengan inisiatif sosial lokal melalui proses onboarding satu klik yang aman dan terverifikasi.',
  array['Flutter', 'Firebase Auth', 'Firestore', 'Google Sign-In'],
  null,
  'Repositori Privat (Proyek Tim Pengembang)',
  'Proyek kolaborasi tim dalam tahap pengujian beta dan persiapan rilis publik.',
  'Mobile Frontend Developer',
  'Inisiatif Tim Mahasiswa',
  '3 Bulan (2024)',
  'Banyak kegiatan bakti sosial dan aksi lingkungan di Jawa Timur kekurangan relawan tenaga medis, dokumentasi, dan logistik karena kanal rekrutmen konvensional terbatas pada grup pesan.',
  'Aplikasi mobile Flutter cross-platform dengan autentikasi Firebase, sinkronisasi data kegiatan Firestore real-time, dan filter geolokasi.',
  'Flutter (Dart) frontend dengan arsitektur State Management Provider, backend Serverless Firebase Cloud Functions, Firestore NoSQL DB, dan Storage.',
  'Mempercepat waktu pencocokan relawan dengan komunitas dari beberapa hari menjadi hitungan menit.',
  3,
  'published'
),
(
  'shopping-kuy',
  'Shopping Kuy - Marketplace C2C Pre-Loved',
  'Web App',
  false,
  '/images/projects/shoppingkuy.png',
  'Transaksi jual beli pakaian bekas antar-mahasiswa sering terkendala kalkulasi ongkos kirim manual dan risiko penipuan tanpa sistem escrow sederhana.',
  'Merancang antarmuka e-commerce C2C yang ringkas dengan alur checkout terpandu, kalkulasi ongkos kirim API, dan katalog berbasis kondisi barang.',
  'Memvalidasi purwarupa antarmuka dengan 90% skor kelayakan tugas pengguna pada sesi usability testing.',
  array['Laravel', 'Blade', 'Bootstrap', 'Midtrans'],
  null,
  'Repositori Privat (Proyek Pembelajaran Terarah)',
  'Arsip tugas rekayasa web institusi dengan fokus implementasi arsitektur MVC.',
  'Full-Stack Developer',
  'Proyek Akademik RPL',
  '2 Bulan (2023)',
  'Peluang sirkular ekonomi produk busana pre-loved di kalangan pelajar membutuhkan platform terverifikasi dengan kemudahan pembayaran tunai dan digital.',
  'Membangun marketplace web monolitik berbasis Laravel dengan keranjang belanja interaktif dan integrasi payment gateway sandbox.',
  'Laravel MVC, Blade templating, basis data MySQL dengan pemodelan relasi multi-penjual.',
  'Skor keberhasilan alur pemesanan mencapai 90% pada pengujian pengguna internal.',
  4,
  'published'
),
(
  'rent-car',
  'Rent Car Management System',
  'Web App',
  false,
  '/images/projects/rentcar.png',
  'Penyewaan armada kendaraan rental retail membutuhkan pencatatan jadwal ketersediaan unit yang akurat untuk mencegah bentrok jadwal booking pelanggan.',
  'Membangun dashboard reservasi kendaraan terpusat dengan kalender ketersediaan armada, status pemeliharaan berkala, dan rekapitulasi nota tagihan.',
  'Mencegah risiko double-booking armada kendaraan hingga nol insiden pada simulasi uji beban sistem.',
  array['PHP Native', 'MySQL', 'Bootstrap 5', 'DataTables'],
  null,
  'Repositori Privat (Portofolio Kejuruan RPL)',
  'Arsip tugas akhir kompetensi kejuruan rekayasa perangkat lunak.',
  'Backend & Database Developer',
  'SMKN 2 Surabaya',
  '3 Bulan (2023)',
  'Pencatatan rental mobil manual pada papan tulis dan buku catatan rentan terlewat saat frekuensi booking meningkat di akhir pekan.',
  'Aplikasi sistem inventaris dan booking mobil berbasis web dengan validasi bentrok tanggal otomatis pada level query database.',
  'PHP Native berorientasi objek, MySQL dengan stored procedure ketersediaan unit, dan DataTables server-side pagination.',
  'Nol insiden jadwal tumpang tindih dalam simulasi pengujian 100+ transaksi simultan.',
  5,
  'published'
),
(
  'si-paling',
  'Si Paling - Platform Pelaporan Warga',
  'UI/UX Design',
  false,
  '/images/projects/sipaling.png',
  'Masyarakat enggan melaporkan masalah fasilitas umum karena proses birokrasi formulir pemerintah yang rumit dan tidak transparan status penanganannya.',
  'Merancang purwarupa antarmuka mobile pelaporan warga berbasis geotagging foto bukti, pelacakan tiket perbaikan real-time, dan sistem upvote keluhan serupa.',
  'Menghasilkan purwarupa interaktif dengan 8 skenario pengujian pengguna dan skor kepuasan System Usability Scale (SUS) 84.5.',
  array['Figma', 'Design System', 'User Research', 'Prototyping'],
  'https://www.figma.com',
  'Dokumen Desain Publik (Figma Showcase)',
  'File purwarupa dan dokumentasi riset pengguna dapat diakses publik melalui Figma Community.',
  'UI/UX Designer & Researcher',
  'Studi Kasus Desain Interaksi',
  '1 Bulan (2024)',
  'Keluhan rusaknya jalan dan lampu penerangan umum membutuhkan kanal pelaporan yang cepat dalam 3 langkah tanpa login rumit.',
  'Desain antarmuka mobile ramah pemula dengan komponen neo-brutalist bersih, hierarki kontras tinggi, dan pelacak status tiket bergaya linimasa.',
  'Figma komponen modular dengan auto-layout, interaksi variabel, dan purwarupa terhubung penuh.',
  'Meraih skor SUS 84.5 (kategori Excellent) dalam pengujian usability dengan 12 responden.',
  6,
  'published'
),
(
  'analisis-retail',
  'Dashboard Analisis Penjualan Retail Multi-Cabang',
  'Data Analyst',
  false,
  '/images/projects/data-analyst.png',
  'Manajemen toko retail kesulitan mengidentifikasi cabang dengan performa laba di bawah target dan kategori produk yang mengalami kelebihan stok (overstock).',
  'Membangun dashboard analitik interaktif berbasis Looker Studio dan Google Sheets yang mengagregasi 10.000+ baris data transaksi penjualan dari 5 cabang.',
  'Menemukan anomali margin profit pada cabang spesifik yang membantu pengambil keputusan memangkas 15% biaya penahanan stok berlebih.',
  array['Google Looker Studio', 'Google Sheets', 'SQL', 'Data Cleansing'],
  'https://lookerstudio.google.com',
  'Laporan Analitik Publik',
  'Data sensitif telah di-masking (dianonimkan) untuk kebutuhan publikasi portofolio profesional.',
  'Data Analyst',
  'Simulasi Kasus Bisnis Retail',
  '2 Minggu (2024)',
  'Volume data penjualan bulanan tersimpan di beberapa spreadsheet terpisah tanpa visualisasi visual tren musiman.',
  'Pembersihan data dengan formula SQL, pembuatan skema data model bintang, dan pembangunan visualisasi dashboard interaktif dengan filter dinamis.',
  'Google BigQuery / SQL data cleansing, Google Sheets data pipeline, Looker Studio reporting visualizer.',
  'Memangkas waktu penyusunan laporan mingguan manajemen dari 4 jam menjadi real-time.',
  7,
  'published'
),
(
  'churn-prediction',
  'Exploratory Data Analysis: Customer Churn Telecommunication',
  'Data Analyst',
  false,
  '/images/projects/data-analyst.png',
  'Tingginya angka churn pelanggan layanan langganan internet tanpa analisis faktor risiko utama yang memicu pembatalan kontrak berlangganan.',
  'Melakukan analisis data eksploratif (EDA) pada dataset 7.000+ pelanggan telekomunikasi untuk mengidentifikasi korelasi antara jenis kontrak, tagihan bulanan, dan churn.',
  'Mengidentifikasi bahwa pelanggan dengan kontrak bulan-ke-bulan (month-to-month) memiliki tingkat churn 42%, 4 kali lebih tinggi dibanding kontrak tahunan.',
  array['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
  'https://github.com/mraynar',
  'Repositori Analisis Terbuka (Jupyter Notebook)',
  'Seluruh notebook analisis kode dan visualisasi grafik tersedia di GitHub.',
  'Data Analyst',
  'Proyek Riset Eksploratif',
  '3 Minggu (2024)',
  'Retensi pelanggan telekomunikasi memerlukan strategi berbasis bukti data untuk memfokuskan program loyalitas pada segmen pelanggan berisiko tinggi.',
  'Preprocessing data, penanganan nilai hilang (missing values), analisis univariat dan bivariat, serta visualisasi heatmap matriks korelasi fitur.',
  'Python 3, pustaka Pandas untuk manipulasi data, Seaborn & Matplotlib untuk visualisasi statistik, Jupyter Lab.',
  'Memberikan rekomendasi aksi konkret: penawaran insentif khusus pada bulan ke-3 dan ke-6 untuk migrasi kontrak bulanan ke kontrak tahunan.',
  8,
  'published'
)
on conflict (id) do nothing;

-- 6. Experience Seed
insert into public.experience (
  role, org, period, type, current, bullets, tags, photo, photo_alt, order_index
) values
(
  'Peserta Novo Entrepreneurship',
  'Novo Club by ParagonCorp',
  'Maret 2026 - Sekarang',
  'Program Kepemimpinan',
  true,
  array[
    'Mengikuti program intensif kepemimpinan dan kewirausahaan yang diselenggarakan oleh ekosistem ParagonCorp.',
    'Menganalisis strategi model bisnis dan alur validasi produk retail kecantikan berbasis kebutuhan pasar nyata.',
    'Menjalin jejaring profesional dan kolaborasi lintas disiplin bersama para mentor industri dan inovator muda.'
  ],
  array['Kepemimpinan', 'Validasi Bisnis', 'Strategi Produk', 'Kolaborasi'],
  '/images/experience/Novo Club.jpg',
  'Foto Kegiatan Novo Club ParagonCorp',
  1
),
(
  'Staf Hubungan Masyarakat',
  'HIMASIFO UPN Veteran Jawa Timur',
  'Januari 2025 - Desember 2025',
  'Organisasi Mahasiswa',
  false,
  array[
    'Menginisiasi dan mengoordinasikan jalinan kemitraan eksternal bersama 5+ himpunan mahasiswa universitas mitra dan praktisi industri.',
    'Mengelola saluran komunikasi publik resmi himpunan untuk menyebarkan informasi akademik yang menjangkau 400+ mahasiswa aktif Sistem Informasi.',
    'Berperan sebagai penghubung dalam penyelenggaraan seminar teknologi dan forum studi banding antar-kampus.'
  ],
  array['Komunikasi Publik', 'Kemitraan', 'Manajemen Acara'],
  '/images/experience/Himasifo.jpg',
  'Foto Pengurus HIMASIFO UPN Jatim',
  2
),
(
  'Staf Ahli Website & IT',
  'UKM Penalaran dan Penelitian',
  'Januari 2024 - Desember 2024',
  'Organisasi Kampus',
  false,
  array[
    'Mengembangkan dan merawat portal web resmi organisasi untuk publikasi artikel karya tulis ilmiah dan pengumuman lomba.',
    'Membantu digitalisasi repositori pengumpulan proposal penelitian yang mengefisienkan waktu seleksi berkas panitia sebesar 50%.',
    'Mendukung penyelenggaraan lokakarya penulisan ilmiah dan pembinaan delegasi kompetisi mahasiswa.'
  ],
  array['Pengembangan Web', 'Administrasi IT', 'Riset Mahasiswa'],
  '/images/experience/UKM Penalaran dan Penelitian.jpg',
  'Foto Tim IT UKM Penalaran dan Penelitian',
  3
)
on conflict do nothing;

-- 7. Certifications Seed
insert into public.certifications (
  title, issuer, provider, credential_id, credential_url, date, order_index
) values
(
  'Full Stack Web Development Professional',
  'Amazon Web Services (AWS)',
  'Coursera',
  'AWS-FSD-2024-8971',
  'https://coursera.org/verify/AWS-FSD-2024-8971',
  'April 2024',
  1
),
(
  'Software Engineering Mastery',
  'IBM',
  'Coursera',
  'IBM-SE-99214-X',
  'https://coursera.org/verify/IBM-SE-99214-X',
  'Mei 2024',
  2
),
(
  'Web Architecture & System Design',
  'University of London',
  'Coursera',
  'LON-ARCH-7712',
  'https://coursera.org/verify/LON-ARCH-7712',
  'Juni 2024',
  3
),
(
  'Pengembangan Aplikasi Web dengan React',
  'Dicoding Indonesia',
  'Dicoding',
  'DCD-REACT-4412',
  'https://www.dicoding.com/certificates/DCD-REACT-4412',
  'Agustus 2024',
  4
),
(
  'Enterprise Data Science with Microsoft Fabric',
  'Dicoding Indonesia',
  'Dicoding',
  'DCD-DATA-9921',
  'https://www.dicoding.com/certificates/DCD-DATA-9921',
  'Maret 2024',
  5
),
(
  'Full Stack Python & Django Expert',
  'Udemy Academy',
  'Udemy',
  'UDE-PY-DJ-2231',
  'https://udemy.com/certificate/UDE-PY-DJ-2231',
  'Mei 2023',
  6
),
(
  'Fundamental SQL Using SELECT Statement',
  'DQLab Academy',
  'DQLab',
  'DQLAB-SQL-01',
  'https://academy.dqlab.id/certificate/pdf/DQLAB-SQL-01',
  'Februari 2024',
  7
),
(
  'Data Engineer Challenge with SQL',
  'DQLab Academy',
  'DQLab',
  'DQLAB-SQL-02',
  'https://academy.dqlab.id/certificate/pdf/DQLAB-SQL-02',
  'Maret 2024',
  8
),
(
  'Git & GitHub for DevOps Collaboration',
  'Karirnex Bootcamp',
  'Karirnex',
  'KNX-GIT-1123',
  '#',
  'November 2023',
  9
)
on conflict do nothing;

-- Example admin grant: insert into public.admins values ('<uid>', '<email>');
