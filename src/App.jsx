import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Container,
  Section,
  Stack,
  Cluster,
  Card,
  Chip,
  SectionHeading,
  FeaturedHeroCard,
  ProjectCard,
  ExpCard,
  CaseStudyModal,
  Navbar,
  Footer,
  ScrollTopFab,
  Icon,
} from "./components";
import { useDarkMode } from "./useDarkMode";
import {
  PERSONAL_INFO,
  SKILL_CATEGORIES,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
} from "./data";
import ProjectPage from "./ProjectPage";
import ExperiencePage from "./ExperiencePage";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Scroll helper for in-page anchors
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// Hero section with balanced 2-column layout and generous spacing
function Hero() {
  return (
    <Section
      id="home"
      className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      <div className="bg-code-tile absolute inset-0 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left column: narrative and actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <Cluster gap={8} className="mb-4">
              <Chip variant="blue">SISTEM INFORMASI & SOFTWARE ENGINEER</Chip>
              <Chip variant="green">UPN Veteran Jawa Timur</Chip>
            </Cluster>

            {/* Main heading limited to two lines */}
            <h1
              className="font-extrabold tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
                lineHeight: 1.1,
                color: "var(--ink)",
              }}
            >
              Muhammad Raynar <br />
              <span style={{ color: "var(--google-blue)" }}>Hammam</span>
            </h1>

            <p
              className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 font-normal"
              style={{
                color: "var(--ink-secondary)",
                maxWidth: "58ch",
              }}
            >
              {PERSONAL_INFO.valueProp} Mahasiswa aktif Sistem Informasi di{" "}
              {PERSONAL_INFO.university}.
            </p>

            {/* Primary actions */}
            <Cluster gap={16} className="mb-6">
              <button
                onClick={() => scrollToSection("projects")}
                className="neo-btn-primary font-bold text-base"
              >
                Lihat Proyek
                <Icon name="arrow-right" size={18} />
              </button>

              <a
                href={PERSONAL_INFO.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary font-bold text-base"
              >
                <Icon name="download" size={18} />
                Unduh CV
              </a>
            </Cluster>

            {/* Social link pills */}
            <Cluster gap={8} className="pt-1">
              <span
                className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mr-1"
                style={{ color: "var(--ink-muted)" }}
              >
                Tautan:
              </span>
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="neo-badge text-xs sm:text-sm font-bold"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--ink)",
                }}
              >
                GitHub
                <Icon name="external-link" size={13} />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="neo-badge text-xs sm:text-sm font-bold"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue-text)",
                  borderColor: "var(--google-blue)",
                }}
              >
                LinkedIn
                <Icon name="external-link" size={13} />
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="neo-badge text-xs sm:text-sm font-bold"
                style={{
                  backgroundColor: "var(--google-red-bg)",
                  color: "var(--google-red-text)",
                  borderColor: "var(--google-red)",
                }}
              >
                Email
                <Icon name="mail" size={13} />
              </a>
            </Cluster>
          </div>

          {/* Right column: profile photo card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px]">
              <Card variant="flat" className="p-0 overflow-hidden">
                <div
                  className="h-11 px-4 flex items-center justify-between border-b-2"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#ea4335]" />
                    <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#fbbc04]" />
                    <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#34a853]" />
                    <span
                      className="text-xs font-mono ml-2 font-bold"
                      style={{ color: "var(--ink)" }}
                    >
                      raynar-dev.ts
                    </span>
                  </div>
                  <Chip variant="green">Online</Chip>
                </div>

                <div className="p-4 sm:p-5">
                  <div
                    className="w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 relative"
                    style={{
                      backgroundColor: "var(--canvas)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <img
                      src="/images/about/Profile Utama.PNG"
                      alt="Foto Profil Muhammad Raynar Hammam"
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </div>

                  <div
                    className="mt-4 p-3.5 rounded-xl border-2 flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div>
                      <div
                        className="font-extrabold text-base font-mono"
                        style={{ color: "var(--ink)" }}
                      >
                        M. RAYNAR HAMMAM
                      </div>
                      <div
                        className="text-xs font-semibold"
                        style={{ color: "var(--google-blue)" }}
                      >
                        Mahasiswa Sistem Informasi - UPN Jatim
                      </div>
                    </div>
                    <Chip variant="blue">Surabaya, ID</Chip>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// About section
function About() {
  return (
    <Section id="about" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <SectionHeading
          kicker="PROFIL PENGEMBANG"
          title="Tentang"
          accent="Saya"
          subtitle="Latar belakang akademik, rekayasa perangkat lunak, dan pendekatan praktis dalam membangun sistem informasi bisnis."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          {/* Narrative text with 65ch line width constraint */}
          <div
            className="lg:col-span-7 space-y-4 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--ink-secondary)", maxWidth: "65ch" }}
          >
            <p>
              Saya adalah mahasiswa{" "}
              <strong className="font-bold text-blue-600 dark:text-blue-400">
                Sistem Informasi di {PERSONAL_INFO.university}
              </strong>{" "}
              dengan fokus rekayasa perangkat lunak web full-stack, solusi
              mobile lintas platform, dan pemodelan basis data relasional.
            </p>
            <p>
              Perjalanan teknis saya berakar dari pendidikan kejuruan di SMK
              Negeri 2 Surabaya (Jurusan Rekayasa Perangkat Lunak). Di sana saya
              membangun fondasi pemrograman terstruktur, algoritma, serta
              arsitektur aplikasi berbasis web modern.
            </p>
            <p>
              Dalam setiap proyek, saya mengutamakan{" "}
              <strong className="font-bold" style={{ color: "var(--ink)" }}>
                fungsionalitas dan efisiensi operasional
              </strong>
              : memetakan alur proses bisnis riil ke dalam antarmuka yang
              intuitif dan sistem backend yang tangguh.
            </p>
          </div>

          {/* Principle card and education items in vertical stack */}
          <div className="lg:col-span-5">
            <Stack gap={16}>
              <div
                className="neo-card p-5 sm:p-6 border-2"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  borderColor: "var(--google-blue)",
                }}
              >
                <div
                  className="text-xs font-extrabold font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  style={{ color: "var(--google-blue-text)" }}
                >
                  <Icon name="bolt" size={14} />
                  PRINSIP REKAYASA (KEY POINT)
                </div>
                <blockquote
                  className="text-base sm:text-lg font-bold leading-snug"
                  style={{ color: "var(--google-blue-text)" }}
                >
                  &ldquo;Menghubungkan proses bisnis nyata dengan arsitektur
                  perangkat lunak yang fungsional, terukur, dan efisien.&rdquo;
                </blockquote>
              </div>

              {EDUCATION.map((edu, idx) => (
                <div
                  key={edu.school}
                  className="neo-card-flat p-4 sm:p-5 border-l-4"
                  style={{
                    borderLeftColor:
                      idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {edu.period}
                    </span>
                    {edu.active && <Chip variant="green">Aktif</Chip>}
                  </div>
                  <h4
                    className="font-extrabold text-base sm:text-lg"
                    style={{
                      color: "var(--ink)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {edu.degree}
                  </h4>
                  <p
                    className="text-xs sm:text-sm font-bold mb-1.5"
                    style={{
                      color:
                        idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                    }}
                  >
                    {edu.school}
                  </p>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {edu.focus}
                  </p>
                </div>
              ))}
            </Stack>
          </div>
        </div>

        {/* Real impact metrics (By The Numbers) */}
        <div
          className="pt-10 border-t-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mb-6">
            <div className="kicker mb-2 text-xs sm:text-sm font-extrabold">
              <span
                style={{
                  width: 20,
                  height: 2.5,
                  background: "var(--google-blue)",
                  display: "inline-block",
                }}
              />
              BY THE NUMBERS
            </div>
            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              Dampak & Pencapaian Riil
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blue stat */}
            <div className="devfest-card-blue p-6 flex flex-col justify-between">
              <div>
                <div
                  className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight mb-2"
                  style={{ color: "var(--google-blue)" }}
                >
                  [{PROJECTS.length}+]
                </div>
                <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2">
                  PROYEK DIGITAL
                </div>
              </div>
              <p
                className="text-xs sm:text-sm font-medium leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                Aplikasi web full-stack, mobile lintas platform, dan sistem
                informasi bisnis operasional.
              </p>
            </div>

            {/* Green stat */}
            <div className="devfest-card-green p-6 flex flex-col justify-between">
              <div>
                <div
                  className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight mb-2"
                  style={{ color: "var(--google-green)" }}
                >
                  [{CERTIFICATIONS.length}+]
                </div>
                <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2">
                  SERTIFIKASI RESMI
                </div>
              </div>
              <p
                className="text-xs sm:text-sm font-medium leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                Kompetensi terverifikasi dari IBM, Dicoding, DQLab, Udemy & AWS.
              </p>
            </div>

            {/* Yellow stat */}
            <div className="devfest-card-yellow p-6 flex flex-col justify-between">
              <div>
                <div
                  className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight mb-2"
                  style={{ color: "var(--google-yellow-hover)" }}
                >
                  [2021]
                </div>
                <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2">
                  REKAYASA SOFTWARE
                </div>
              </div>
              <p
                className="text-xs sm:text-sm font-medium leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                Fondasi pemrograman terstruktur dimulai dari bangku SMK RPL
                hingga S1 Sistem Informasi.
              </p>
            </div>

            {/* Red stat */}
            <div className="devfest-card-red p-6 flex flex-col justify-between">
              <div>
                <div
                  className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight mb-2"
                  style={{ color: "var(--google-red)" }}
                >
                  [100%]
                </div>
                <div className="text-sm sm:text-base font-extrabold uppercase tracking-wider mb-2">
                  INTEGRITAS SOLUSI
                </div>
              </div>
              <p
                className="text-xs sm:text-sm font-medium leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                Komitmen arsitektur bersih, performa terukur, dan dokumentasi
                yang transparan.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Skills section
function Skills() {
  const categoryBarColors = [
    "var(--google-blue)",
    "var(--google-green)",
    "var(--google-yellow)",
    "var(--google-red)",
  ];

  return (
    <Section id="skills" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <SectionHeading
          kicker="KOMPETENSI TEKNIS"
          title="Keahlian &"
          accent="Teknologi"
          subtitle="Teknologi dan kerangka kerja yang saya kuasai dan terapkan dalam pengembangan perangkat lunak."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <Card key={cat.name} className="flex flex-col justify-between">
              <div>
                <div
                  className="flex items-center gap-2.5 mb-5 pb-3 border-b-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      backgroundColor:
                        categoryBarColors[idx % categoryBarColors.length],
                      border: "2px solid var(--border)",
                    }}
                  />
                  <h3
                    className="font-extrabold text-lg sm:text-xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {cat.name}
                  </h3>
                </div>

                <Cluster gap={8}>
                  {cat.skills.map((skill) => (
                    <Chip key={skill} variant="default">
                      {skill}
                    </Chip>
                  ))}
                </Cluster>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Projects preview
function ProjectsPreview({ onOpenCaseStudy }) {
  const featuredHero = PROJECTS.find((p) => p.featured);
  const secondaryFeatured = PROJECTS.filter(
    (p) => p.featured && p.id !== featuredHero?.id
  );

  return (
    <Section id="projects" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            kicker="HASIL KARYA"
            title="Proyek"
            accent="Unggulan"
            subtitle="Pilihan solusi digital nyata dengan dokumentasi arsitektur sistem dan dampak terukur."
          />
          <Link
            to="/projects"
            className="neo-btn-secondary text-base font-bold self-start sm:self-end"
          >
            Lihat Semua Proyek ({PROJECTS.length})
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        {featuredHero && (
          <FeaturedHeroCard
            project={featuredHero}
            onOpenCaseStudy={onOpenCaseStudy}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondaryFeatured.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenCaseStudy={onOpenCaseStudy}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Experience preview
function ExperiencePreview() {
  return (
    <Section id="experience" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            kicker="REKAM JEJAK"
            title="Pengalaman"
            accent="Organisasi & Magang"
            subtitle="Kontribusi aktif dalam program kepemimpinan, kepengurusan kampus, dan praktik industri."
          />
          <Link
            to="/experience"
            className="neo-btn-secondary text-base font-bold self-start sm:self-end"
          >
            Lihat Linimasa Lengkap
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        <Stack gap={24}>
          {EXPERIENCE.slice(0, 3).map((item, idx) => (
            <ExpCard key={item.role + item.org} item={item} index={idx} />
          ))}
        </Stack>
      </Container>
    </Section>
  );
}

// Certifications section
function CertificationsSection() {
  const providerColors = {
    Coursera: "var(--google-blue)",
    Dicoding: "var(--google-green)",
    Udemy: "var(--google-yellow-hover)",
    Karirnex: "var(--google-red)",
  };

  return (
    <Section id="certifications" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <SectionHeading
          kicker="KREDENSIAL RESMI"
          title="Sertifikasi &"
          accent="Lisensi"
          subtitle="Bukti kompetensi terverifikasi dari penyedia kredensial teknologi global (AWS, IBM, Dicoding, Udemy)."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.slice(0, 6).map((cert) => {
            const pColor =
              providerColors[cert.provider] || "var(--google-blue)";

            return (
              <Card
                key={cert.credentialId}
                className="flex flex-col justify-between"
              >
                <div>
                  <div
                    className="flex items-center justify-between mb-3.5 pb-2.5 border-b-2"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span
                      className="neo-badge text-xs sm:text-sm font-bold"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        color: pColor,
                        borderColor: pColor,
                      }}
                    >
                      {cert.provider}
                    </span>
                    <span
                      className="text-xs sm:text-sm font-mono font-bold"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {cert.date}
                    </span>
                  </div>

                  <h3
                    className="font-extrabold text-lg sm:text-xl mb-1.5 leading-snug line-clamp-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {cert.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base font-semibold mb-4"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    Penerbit: {cert.issuer}
                  </p>
                </div>

                <div
                  className="pt-3.5 border-t-2 mt-auto"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="text-xs font-mono mb-3 truncate"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    ID: {cert.credentialId}
                  </div>
                  {cert.credentialUrl && cert.credentialUrl !== "#" ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="neo-btn-primary text-sm w-full font-bold"
                    >
                      Verifikasi Kredensial
                      <Icon name="external-link" size={14} />
                    </a>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-gray-500 block text-center py-1">
                      Terverifikasi Internal
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

// Contact section
function Contact() {
  return (
    <Section id="contact" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <Card variant="flat" className="p-0 overflow-hidden max-w-3xl mx-auto">
          <div className="google-bar" />

          <div className="p-8 sm:p-12 text-center">
            <div className="kicker mb-3 justify-center text-xs sm:text-sm font-extrabold">
              <span
                style={{
                  width: 20,
                  height: 2.5,
                  background: "var(--google-blue)",
                  display: "inline-block",
                }}
              />
              TERBUKA UNTUK KOLABORASI
            </div>

            <h2
              className="font-extrabold tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4.4vw, 3.2rem)",
                color: "var(--ink)",
              }}
            >
              Mari Membangun{" "}
              <span style={{ color: "var(--google-blue)" }}>
                Sesuatu Bersama
              </span>
            </h2>

            <p
              className="text-base sm:text-lg mb-8 mx-auto leading-relaxed"
              style={{
                color: "var(--ink-secondary)",
                maxWidth: "56ch",
              }}
            >
              Memiliki peluang magang, proyek rekayasa perangkat lunak, atau
              diskusi seputar sistem informasi? Jangan ragu untuk menghubungi
              saya.
            </p>

            <Cluster gap={16} className="justify-center mb-8">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="neo-btn-primary font-bold text-base"
                style={{
                  backgroundColor: "var(--google-red)",
                  borderColor: "var(--border)",
                }}
              >
                <Icon name="mail" size={20} />
                {PERSONAL_INFO.email}
              </a>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary font-bold text-base"
              >
                Hubungi via LinkedIn
                <Icon name="external-link" size={16} />
              </a>
            </Cluster>

            <Cluster
              gap={16}
              className="pt-6 border-t-2 justify-center text-sm font-semibold"
              style={{
                borderColor: "var(--border)",
                color: "var(--ink-muted)",
              }}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon name="map-pin" size={15} />
                {PERSONAL_INFO.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={15} />
                {PERSONAL_INFO.timezone}
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                {PERSONAL_INFO.status}
              </span>
            </Cluster>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

// Home page view
function HomePage({ onOpenCaseStudy }) {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <ProjectsPreview onOpenCaseStudy={onOpenCaseStudy} />
      <ExperiencePreview />
      <CertificationsSection />
      <Contact />
    </main>
  );
}

// App root component
export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
      >
        <Navbar dark={dark} toggleDark={toggleDark} />
        <ScrollTopFab />

        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<HomePage onOpenCaseStudy={setSelectedCaseStudy} />}
            />
            <Route
              path="/projects"
              element={<ProjectPage onOpenCaseStudy={setSelectedCaseStudy} />}
            />
            <Route path="/experience" element={<ExperiencePage />} />
          </Routes>
        </div>

        <Footer />

        {selectedCaseStudy && (
          <CaseStudyModal
            project={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
