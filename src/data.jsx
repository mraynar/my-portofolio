// Data configuration
export const PERSONAL_INFO = {
  name: "Muhammad Raynar Hammam",
  shortName: "Raynar",
  role: "Mahasiswa Sistem Informasi & Pengembang Perangkat Lunak",
  university: 'UPN "Veteran" Jawa Timur',
  location: "Surabaya, Jawa Timur, Indonesia",
  timezone: "WIB (UTC+7)",
  status: "Terbuka untuk Magang & Peluang Kolaborasi Proyek",
  email: "raynarham23@gmail.com",
  github: "https://github.com/mraynar",
  linkedin: "https://linkedin.com/in/mraynar",
  instagram: "https://instagram.com/mraynarr",
  cvUrl: "https://drive.google.com/file/d/1pq52Be_s4RBNsxYBBS2YEAFgtYxQjrbi/view?usp=sharing",
  avatar: "",
  valueProp: "Mengembangkan aplikasi web dan mobile berbasis sistem informasi yang terukur, fungsional, dan berorientasi pada efisiensi operasional.",
  // Section headings configuration defaults
  aboutKicker: "TENTANG SAYA",
  aboutTitle: "Tentang",
  aboutTitleAccent: "Saya",
  aboutSubtitle: "Latar belakang akademik, rekayasa perangkat lunak, dan pendekatan praktis dalam membangun sistem informasi bisnis.",
  skillsKicker: "KEAHLIAN TEKNIS",
  skillsTitle: "Keahlian &",
  skillsTitleAccent: "Teknologi",
  skillsSubtitle: "Teknologi yang saya gunakan secara aktif dalam pengembangan perangkat lunak dan manajemen sistem informasi.",
  projectsKicker: "PORTOFOLIO DIGITAL",
  projectsTitle: "Proyek",
  projectsTitleAccent: "Unggulan",
  projectsSubtitle: "Studi kasus arsitektur perangkat lunak terkurasi dengan pemodelan sistem bisnis dan performa terukur.",
  expKicker: "REKAM JEJAK PROFESIONAL",
  expTitle: "Pengalaman",
  expTitleAccent: "Magang & Organisasi",
  expSubtitle: "Riwayat magang industri dan kepengurusan organisasi dalam kepemimpinan dan rekayasa perangkat lunak.",
  certsKicker: "KREDENSIAL PROFESIONAL",
  certsTitle: "Sertifikasi &",
  certsTitleAccent: "Lisensi",
  certsSubtitle: "Sertifikasi resmi kompetensi teknis dari platform pembelajaran dan industri global.",
  contactKicker: "HUBUNGI SAYA",
  contactTitle: "Mari",
  contactTitleAccent: "Berkolaborasi",
  contactSubtitle: "Terbuka untuk peluang magang, proyek kolaboratif, atau konsultasi teknis.",
  numbersKicker: "BY THE NUMBERS",
  numbersTitle: "Dampak & Pencapaian Riil",
  stat1Value: "20+",
  stat1Label: "PROYEK DIGITAL",
  stat1Desc: "Aplikasi web full-stack, mobile lintas platform, dan sistem informasi bisnis operasional.",
  stat2Value: "15+",
  stat2Label: "SERTIFIKASI RESMI",
  stat2Desc: "Kompetensi terverifikasi dari IBM, Dicoding, DQLab, Udemy & AWS.",
  stat3Value: "2021",
  stat3Label: "REKAYASA SOFTWARE",
  stat3Desc: "Fondasi pemrograman terstruktur dimulai dari bangku SMK RPL hingga S1 Sistem Informasi.",
  stat4Value: "100%",
  stat4Label: "INTEGRITAS SOLUSI",
  stat4Desc: "Komitmen arsitektur bersih, performa terukur, dan dokumentasi yang transparan.",
};

export const NAV_LINKS = [
  { id: "home", label: "Beranda", href: "/#home" },
  { id: "about", label: "Tentang", href: "/#about" },
  { id: "skills", label: "Keahlian", href: "/#skills" },
  { id: "experience", label: "Pengalaman", href: "/#experience" },
  { id: "projects", label: "Proyek", href: "/#projects" },
  { id: "contact", label: "Kontak", href: "/#contact" },
];

// Categorized technical skills
export const SKILL_CATEGORIES = [
  {
    id: "cat-frontend",
    name: "Frontend Development",
    accent: "blue",
    skills: ["React", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "Bootstrap", "HTML5 / CSS3"],
  },
  {
    id: "cat-backend",
    name: "Backend & Database",
    accent: "green",
    skills: ["Laravel", "PHP", "Python", "MySQL", "Supabase", "RESTful API"],
  },
  {
    id: "cat-mobile",
    name: "Mobile & Cloud",
    accent: "yellow",
    skills: ["Flutter", "Dart", "Firebase", "Google Cloud Run"],
  },
  {
    id: "cat-tools",
    name: "Tools & Analytics",
    accent: "red",
    skills: ["Git & GitHub", "Google Looker Studio", "Power BI", "Figma", "Postman"],
  },
];

// Projects with case studies
export const PROJECTS = [
  {
    id: "griya-asri-kos",
    title: "Sistem Manajemen Rumah Kos Griya Asri",
    label: "Web App",
    categoryColor: "blue", // Google Blue
    image: "",
    featured: true,
    badges: ["Laravel", "Tailwind CSS", "Midtrans", "MySQL"],
    problem: "Pengelolaan sewa kos dan penagihan sewa bulanan sebelumnya masih dicatat manual via nota fisik dan spreadsheet, sering terjadi selisih dan keterlambatan konfirmasi pembayaran.",
    solution: "Membangun sistem informasi web terpadu dengan automasi pencatatan kamar, rekonsiliasi tagihan berkala, dan gateway pembayaran Midtrans untuk verifikasi otomatis.",
    impact: "Memangkas waktu rekapitulasi pembayaran bulanan hingga 70% dan menyediakan rekam jejak transaksi yang transparan bagi pemilik dan penyewa kos.",
    repo: null,
    repoNotice: "Repositori Privat (Proyek Komersial Klien)",
    demoUrl: null,
    caseStudy: {
      client: "Griya Asri Kos Surabaya",
      role: "Lead Full-Stack Developer",
      duration: "3 Bulan (2025)",
      architecture: [
        "Arsitektur Monolitik MVC dengan Laravel 10 dan Tailwind CSS untuk responsivitas tinggi.",
        "Integrasi Webhook Payment Gateway Midtrans (Snap API) untuk sinkronisasi status transaksi real-time.",
        "Relasi basis data MySQL terstruktur untuk manajemen kamar, riwayat penghuni, dan invoice berkala.",
      ],
      challenges: "Menangani status transaksi pembayaran yang tertunda (*pending*) agar kamar tidak terkunci sebelum ada konfirmasi pembayaran berhasil dari payment gateway.",
      keyResults: "Sistem aktif melayani pencatatan lebih dari 20 unit kamar dan mengeliminasi proses verifikasi transfer manual melalui bukti mutasi WhatsApp.",
    },
  },
  {
    id: "portal-ukm-penalaran",
    title: "Portal Digital UKM Penalaran & Penelitian",
    label: "Web App",
    categoryColor: "green", // Google Green
    image: "",
    featured: true,
    badges: ["WordPress Engine", "PHP", "MySQL", "UI/UX Design"],
    problem: "Alur pengumpulan proposal riset ilmiah mahasiswa dan publikasi dokumentasi kegiatan tersebar di berbagai tautan formulir terpisah tanpa repositori terpusat.",
    solution: "Merancang portal web organisasi mandiri yang mengintegrasikan direktori arsip karya ilmiah, kalender kompetisi kampus, dan sistem informasi keanggotaan.",
    impact: "Mendigitalisasi lebih dari 100 arsip proposal dan artikel ilmiah serta mempercepat verifikasi berkas lomba internal anggota UKM.",
    repo: null,
    repoNotice: "Repositori Institusi Kampus",
    demoUrl: null,
    caseStudy: {
      client: "UKM Penalaran dan Penelitian Kampus",
      role: "Staff Web & Maintenance",
      duration: "4 Bulan (2024)",
      architecture: [
        "CMS WordPress yang dikustomisasi dengan tema dinamis berbasis PHP dan CSS terstruktur.",
        "Sistem kategorisasi taksonomi bertingkat untuk pembagian bidang penelitian sains dan sosial humaniora.",
        "Optimalisasi caching dan kompresi aset gambar guna menjaga stabilitas waktu muat di jaringan kampus.",
      ],
      challenges: "Menyusun skema hak akses multi-author agar staf divisi riset dapat mengunggah draf karya ilmiah tanpa risiko mengubah konfigurasi sistem utama.",
      keyResults: "Portal berhasil dijadikan pusat referensi karya ilmiah tahunan dengan rata-rata 500+ kunjungan mahasiswa aktif per semester.",
    },
  },
  {
    id: "temuaksi-mobile",
    title: "TemuAksi - Platform Kolaborasi Aksi Sosial",
    label: "Mobile App",
    categoryColor: "yellow", // Google Yellow
    image: "",
    featured: true,
    badges: ["Flutter", "Firebase Auth", "Firestore", "Google Sign-In"],
    problem: "Inisiator komunitas sosial lokal kesulitan mencari sukarelawan berkeahlian spesifik karena ketiadaan platform agregator aksi sosial yang terpercaya.",
    solution: "Mengembangkan aplikasi mobile lintas platform untuk pendaftaran relawan, pencarian aksi sosial berbasis minat, dan autentikasi cepat menggunakan akun Google.",
    impact: "Menghubungkan puluhan relawan mahasiswa dengan inisiatif sosial lokal melalui proses onboarding satu klik yang aman dan instan.",
    repo: null,
    repoNotice: "Repositori Privat (Proyek Tim Pengembang)",
    demoUrl: null,
    caseStudy: {
      client: "Inisiatif Kolaborasi Mahasiswa",
      role: "Mobile Frontend & Firebase Engineer",
      duration: "2 Bulan (2024)",
      architecture: [
        "Aplikasi Flutter (Dart) dengan arsitektur Provider / BLoC untuk pemisahan logika bisnis dan antarmuka.",
        "Firebase Authentication terintegrasi Google Sign-In untuk otentikasi aman tanpa kata sandi rumit.",
        "Cloud Firestore untuk penyimpanan data real-time status keikutsertaan relawan dan daftar kegiatan.",
      ],
      challenges: "Menjamin tampilan UI responsif pada berbagai resolusi layar Android dengan rasio aspek berbeda tanpa layout breaking.",
      keyResults: "Prototipe aplikasi berhasil diuji coba kepada 30+ pengguna uji dan mendapatkan apresiasi dalam kompetisi ide solusi digital.",
    },
  },
  {
    id: "shopping-kuy",
    title: "Shopping Kuy - Marketplace C2C Pre-Loved",
    label: "Web App",
    categoryColor: "blue",
    image: "",
    featured: false,
    badges: ["Laravel", "React", "RajaOngkir API", "MySQL"],
    problem: "Transaksi jual beli pakaian bekas (*pre-loved*) antar mahasiswa sering terkendala kalkulasi ongkos kirim manual dan risiko penipuan rekening pribadi.",
    solution: "Membangun sistem web marketplace C2C dengan kalkulasi otomatis ongkos kirim kurir domestik dan rekening bersama.",
    impact: "Memfasilitasi transaksi aman antar mahasiswa dengan kalkulasi tarif pengiriman real-time dari RajaOngkir.",
    repo: null,
    repoNotice: "Repositori Privat",
    demoUrl: null,
    caseStudy: {
      client: "Proyek Akademik",
      role: "Full-Stack Developer",
      duration: "2 Bulan",
      architecture: [
        "Backend Laravel REST API melayani frontend React SPA.",
        "Integrasi RajaOngkir API untuk penentuan tarif kurir JNE, TIKI, dan POS secara dinamis.",
      ],
      challenges: "Menangani latensi request API kurir eksternal saat checkout.",
      keyResults: "Sistem verifikasi transaksi otomatis dengan integrasi simulasi pembayaran.",
    },
  },
  {
    id: "rent-car-b2b",
    title: "Rent Car Management System",
    label: "Web App",
    categoryColor: "blue",
    image: "",
    featured: false,
    badges: ["Laravel", "Bootstrap 5", "Midtrans", "MySQL"],
    problem: "Penyewaan armada kendaraan rental rental membutuhkan pencatatan jadwal ketersediaan unit yang presisi agar terhindar dari *double booking*.",
    solution: "Sistem web reservasi dan manajemen armada yang memvalidasi ketersediaan mobil secara otomatis berdasarkan rentang tanggal peminjaman.",
    impact: "Menghindari bentrok jadwal sewa mobil dan memberikan ringkasan status armada (Tersedia, Disewa, Servis) kepada pengelola.",
    repo: null,
    repoNotice: "Repositori Privat",
    demoUrl: null,
    caseStudy: {
      client: "Rental Mobil Mandiri",
      role: "Backend & System Analyst",
      duration: "2 Bulan",
      architecture: [
        "Laravel 9 dengan validasi query bentrok tanggal sewa.",
        "Dashboard analitik pendapatan armada bulanan.",
      ],
      challenges: "Pengecekan logika ketersediaan armada saat durasi sewa bertumpuk.",
      keyResults: "Meningkatkan akurasi penjadwalan unit kendaraan hingga 100%.",
    },
  },
  {
    id: "si-paling-uiux",
    title: "Si Paling - Platform Pelaporan Warga",
    label: "UI/UX Design",
    categoryColor: "red",
    image: "",
    featured: false,
    badges: ["Figma", "Design System", "User Research", "Wireframing"],
    problem: "Masyarakat enggan melaporkan masalah fasilitas umum karena proses birokrasi formulir pemerintah yang berbelit dan tidak transparan.",
    solution: "Merancang desain antarmuka mobile yang memprioritaskan alur 3 langkah pelaporan: Ambil Foto, Deteksi Lokasi Otomatis, dan Kirim Laporan.",
    impact: "Menghasilkan purwarupa interaktif dengan *System Usability Scale (SUS)* bernilai tinggi dari sesi uji keterpakaian pengguna.",
    repo: null,
    repoNotice: "Aset Desain di Figma",
    demoUrl: null,
    caseStudy: {
      client: "Desain Kompetisi Inovasi Publik",
      role: "UI/UX Designer",
      duration: "1 Bulan",
      architecture: [
        "Design system konsisten dengan komponen atomik, palet warna aksesibel, dan tipografi hierarkis.",
        "Alur pelacakan status penanganan aduan berbasis timeline interaktif.",
      ],
      challenges: "Menjaga keterbacaan kontras visual untuk pengguna lanjut usia di layar smartphone entry-level.",
      keyResults: "Desain purwarupa rampung dalam 18 artboard dengan navigasi prototipe penuh di Figma.",
    },
  },
  {
    id: "saleslens-analytics",
    title: "SalesLens - Dashboard Analitik E-Commerce",
    label: "Data Analyst",
    categoryColor: "yellow",
    image: "",
    featured: false,
    badges: ["Google Looker Studio", "Data Cleaning", "E-Commerce", "SQL"],
    problem: "Data transaksi penjualan e-commerce mentah sulit dibaca oleh tim bisnis untuk mengambil keputusan promosi musiman dan segmentasi produk.",
    solution: "Membangun dashboard interaktif di Google Looker Studio dengan visualisasi *customer retention*, tren penjualan bulanan, dan matriks kontribusi profit.",
    impact: "Memudahkan pemantauan metrik penjualan secara visual dan menemukan pola produk dengan margin keuntungan tertinggi.",
    repo: null,
    repoNotice: "Dataset & Dashboard Analisis",
    demoUrl: null,
    caseStudy: {
      client: "Proyek Analisis Bisnis",
      role: "Data Analyst",
      duration: "1 Bulan",
      architecture: [
        "Pembersihan dan validasi data transaksi menggunakan formula spreadsheet & query SQL.",
        "Visualisasi KPI pendapatan, rata-rata nilai pesanan (AOV), dan peta sebaran wilayah pembeli.",
      ],
      challenges: "Menormalkan data ribuan baris dengan format tanggal dan kategori ganda.",
      keyResults: "Dashboard interaktif siap pakai yang menyajikan *insight* tren penjualan musiman.",
    },
  },
  {
    id: "fmcg-sales-bi",
    title: "Analisis Kinerja Distribusi FMCG",
    label: "Data Analyst",
    categoryColor: "yellow",
    image: "",
    featured: false,
    badges: ["Power BI", "Data Modeling", "DAX", "FMCG"],
    problem: "Distributor produk FMCG memerlukan visibilitas cepat terhadap stok lambat laku (*slow-moving items*) di berbagai gerai retail.",
    solution: "Merancang model data relasional di Microsoft Power BI dengan ukuran DAX khusus untuk mendeteksi anomali penjualan dan target pencapaian toko.",
    impact: "Menyediakan laporan analitik terpadu untuk mengevaluasi kinerja tim sales per area distribusi.",
    repo: null,
    repoNotice: "Laporan Business Intelligence",
    demoUrl: null,
    caseStudy: {
      client: "Studi Kasus Distribusi",
      role: "BI Developer",
      duration: "1 Bulan",
      architecture: [
        "Data modeling skema bintang (Fact & Dimension tables).",
        "Kalkulasi DAX untuk metrik *Year-over-Year (YoY) Growth* dan pencapaian target penjualan.",
      ],
      challenges: "Memastikan performa kalkulasi DAX tetap cepat pada dataset volume besar.",
      keyResults: "Laporan visual komprehensif dengan filter dinamis berdasarkan kuartal, kategori, dan cabang.",
    },
  },
];

// Helper to check if experience item belongs to internship category
export function isInternshipExperience(item) {
  const typeText = String(item?.type || "").trim().toLowerCase();
  const catText = String(item?.category || "").trim().toLowerCase();
  const roleText = String(item?.role || "").trim().toLowerCase();

  if (
    typeText === "magang" ||
    typeText === "internship" ||
    typeText === "profesional" ||
    typeText === "professional"
  ) {
    return true;
  }
  if (
    typeText === "organisasi" ||
    typeText === "organization" ||
    typeText === "leadership" ||
    typeText === "kepemimpinan" ||
    typeText === "komunitas" ||
    typeText === "community"
  ) {
    return false;
  }
  const internWordRegex = /\bintern(ship|s)?\b/i;
  return (
    catText.includes("magang") ||
    internWordRegex.test(catText) ||
    catText.includes("industri") ||
    internWordRegex.test(roleText) ||
    roleText.includes("magang")
  );
}

// Helper to parse date for reverse chronological sorting
export function parseExperienceDate(item) {
  const isActive = Boolean(
    item.active ||
    item.current ||
    /sekarang|present|current/i.test(item.period || "")
  );

  const period = String(item.period || "");
  const years = period.match(/\b(20\d{2}|19\d{2})\b/g);

  let startYear = 0;
  let endYear = 0;
  if (years && years.length > 0) {
    startYear = parseInt(years[0], 10);
    endYear = years.length > 1 ? parseInt(years[1], 10) : (isActive ? 9999 : startYear);
  }

  const months = [
    "januari", "februari", "maret", "april", "mei", "juni",
    "juli", "agustus", "september", "oktober", "november", "desember",
  ];
  let startMonth = 0;
  const lowerPeriod = period.toLowerCase();
  for (let m = 0; m < months.length; m++) {
    if (lowerPeriod.includes(months[m])) {
      startMonth = m + 1;
      break;
    }
  }

  return {
    isActive,
    endYear,
    startYear,
    startMonth,
    orderIndex: typeof item.order_index === "number" ? item.order_index : 0,
  };
}

// Sort experience list by custom order_index with date fallback
export function sortExperiencesLatestFirst(list = []) {
  return [...list].sort((a, b) => {
    const hasOrderA = typeof a.order_index === "number" && a.order_index > 0;
    const hasOrderB = typeof b.order_index === "number" && b.order_index > 0;

    if (hasOrderA && hasOrderB && a.order_index !== b.order_index) {
      return a.order_index - b.order_index;
    }

    const keyA = parseExperienceDate(a);
    const keyB = parseExperienceDate(b);

    if (keyA.isActive !== keyB.isActive) {
      return keyA.isActive ? -1 : 1;
    }
    if (keyA.endYear !== keyB.endYear) {
      return keyB.endYear - keyA.endYear;
    }
    if (keyA.startYear !== keyB.startYear) {
      return keyB.startYear - keyA.startYear;
    }
    if (keyA.startMonth !== keyB.startMonth) {
      return keyB.startMonth - keyA.startMonth;
    }
    return keyA.orderIndex - keyB.orderIndex;
  });
}

// Experience timeline items
export const EXPERIENCE = [
  {
    id: "exp-solusi",
    role: "Full-Stack Web Developer Intern",
    org: "PT Solusi Rekayasa Digital",
    period: "Februari 2026 – Sekarang",
    statusText: "Sekarang",
    active: true,
    current: true,
    category: "Magang Industri",
    type: "Magang",
    categoryColor: "blue",
    photo: "",
    photoAlt: "Dokumentasi Full-Stack Web Developer Intern",
    bullets: [
      "Mengembangkan modul RESTful API dan integrasi basis data PostgreSQL untuk sistem pengelolaan transaksi internal perusahaan.",
      "Membangun antarmuka dashboard monitoring operasional berbasis React dan Tailwind CSS yang responsif serta teruji di berbagai viewport.",
      "Menerapkan mekanisme validasi data terpusat dan penanganan galat asinkron guna menjaga integritas data operasional.",
    ],
    tags: ["Full-Stack Web", "React", "PostgreSQL", "REST API", "Tailwind CSS"],
    order_index: 1,
  },
  {
    id: "exp-novo",
    role: "Peserta Novo Entrepreneurship",
    org: "Novo Club by ParagonCorp",
    period: "Maret 2026 – Sekarang",
    statusText: "Sekarang",
    active: true,
    current: true,
    category: "Program Kepemimpinan",
    type: "Organisasi",
    categoryColor: "green",
    photo: "",
    photoAlt: "Dokumentasi Program Novo Entrepreneurship ParagonCorp",
    bullets: [
      "Mengikuti program intensif kepemimpinan dan kewirausahaan yang diselenggarakan oleh ekosistem ParagonCorp.",
      "Menganalisis strategi model bisnis dan alur validasi produk retail kecantikan berbasis kebutuhan pasar nyata.",
      "Menjalin jejaring profesional dan kolaborasi lintas disiplin bersama para mentor industri dan inovator muda.",
    ],
    tags: ["Kepemimpinan", "Validasi Bisnis", "Strategi Produk", "Kolaborasi"],
    order_index: 2,
  },
  {
    id: "exp-himasifo",
    role: "Staf Hubungan Masyarakat",
    org: "HIMASIFO UPN Veteran Jawa Timur",
    period: "Januari 2025 – Desember 2025",
    statusText: "2025",
    active: false,
    current: false,
    category: "Organisasi Kampus",
    type: "Organisasi",
    categoryColor: "blue",
    photo: "",
    photoAlt: "Dokumentasi Staf Humas HIMASIFO UPN Veteran Jawa Timur",
    bullets: [
      "Menginisiasi dan mengoordinasikan jalinan kemitraan eksternal bersama 5+ himpunan mahasiswa universitas mitra dan praktisi industri.",
      "Mengelola saluran komunikasi publik resmi himpunan untuk menyebarkan informasi akademik yang menjangkau 400+ mahasiswa aktif Sistem Informasi.",
      "Berperan sebagai penghubung dalam penyelenggaraan seminar teknologi dan forum studi banding antar-kampus.",
    ],
    tags: ["Komunikasi Publik", "Kemitraan", "Manajemen Acara"],
    order_index: 3,
  },
  {
    id: "exp-ukmpnk",
    role: "Staf Ahli Website & IT",
    org: "UKM Penalaran dan Penelitian",
    period: "Januari 2024 – Desember 2024",
    statusText: "2024",
    active: false,
    current: false,
    category: "Organisasi Kampus",
    type: "Organisasi",
    categoryColor: "yellow",
    photo: "",
    photoAlt: "Dokumentasi Tim Staf IT UKM Penalaran",
    bullets: [
      "Mengembangkan dan merawat portal web resmi organisasi untuk publikasi artikel karya tulis ilmiah dan pengumuman lomba.",
      "Membantu digitalisasi repositori pengumpulan proposal penelitian yang mengefisienkan waktu seleksi berkas panitia sebesar 50%.",
      "Mendukung penyelenggaraan lokakarya penulisan ilmiah dan pembinaan delegasi kompetisi mahasiswa.",
    ],
    tags: ["Pengembangan Web", "Administrasi IT", "Riset Mahasiswa"],
    order_index: 4,
  },
  {
    id: "exp-indra",
    role: "Front-End Developer Intern",
    org: "CV Indra Protection",
    period: "Juli 2022 – Desember 2022",
    statusText: "2022",
    active: false,
    current: false,
    category: "Magang Industri",
    type: "Magang",
    categoryColor: "red",
    photo: "",
    photoAlt: "Dokumentasi Magang Frontend Developer CV Indra Protection",
    bullets: [
      "Menerjemahkan desain purwarupa antarmuka ke dalam kode HTML, CSS, dan JavaScript yang modular dan responsif di berbagai perangkat.",
      "Melakukan pengujian lintas peramban (*cross-browser testing*) untuk memastikan konsistensi tampilan pada Chrome, Firefox, dan Safari.",
      "Mengoptimalkan kompresi aset gambar dan struktur skrip antarmuka guna meningkatkan kecepatan muat halaman web profil perusahaan.",
    ],
    tags: ["Front-End Web", "Responsive Design", "Cross-Browser Testing"],
    order_index: 5,
  },
];

// Formal education history
export const EDUCATION = [
  {
    degree: "S1 Sistem Informasi",
    school: 'UPN "Veteran" Jawa Timur',
    period: "2024 – Sekarang",
    status: "Mahasiswa Aktif",
    active: true,
    score: "3.84 / 4.00",
    scoreLabel: "IPK",
    focus: "Fokus pada rekayasa perangkat lunak, arsitektur basis data, dan analisis sistem bisnis.",
  },
  {
    degree: "Rekayasa Perangkat Lunak (RPL)",
    school: "SMKN 2 Surabaya",
    period: "2021 – 2024",
    status: "Lulus",
    active: false,
    score: "91.2 / 100",
    scoreLabel: "Nilai Akhir",
    focus: "Mempelajari dasar algoritma pemrograman, web development full-stack, dan basis data relasional.",
  },
];

// Dynamic certifications are loaded exclusively from Supabase and Admin CMS
export const CERTIFICATIONS = [];
