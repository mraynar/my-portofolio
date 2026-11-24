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
import {
  getSiteSettings,
  getProjects,
  getExperience,
  getSkillCategories,
  getEducation,
  getCertifications,
  submitContactMessage,
} from "./lib/supabase";
import ProjectPage from "./ProjectPage";
import ExperiencePage from "./ExperiencePage";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";

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

// Hero section with dynamic configuration
function Hero({ info = PERSONAL_INFO }) {
  const kicker = info.kicker || "SISTEM INFORMASI & SOFTWARE ENGINEER";
  const statusBadge = info.statusBadge || "UPN Veteran Jawa Timur";
  const headline = info.headline || "Muhammad Raynar";
  const headlineAccent = info.headlineAccent || "Hammam";
  const valueProp = info.valueProp || PERSONAL_INFO.valueProp;
  const university = info.university || PERSONAL_INFO.university;
  const cvUrl = info.cvUrl || PERSONAL_INFO.cvUrl;
  const github = info.github || PERSONAL_INFO.github;
  const linkedin = info.linkedin || PERSONAL_INFO.linkedin;
  const email = info.email || PERSONAL_INFO.email;
  const avatar = info.avatar || PERSONAL_INFO.avatar;
  const location = info.location || PERSONAL_INFO.location;
  const displayName = info.name ? info.name.toUpperCase() : "M. RAYNAR HAMMAM";

  return (
    <Section
      id="home"
      className="relative min-h-[calc(100dvh-var(--nav-h,64px))] flex items-center justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 sm:pb-12 lg:pb-14"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      <div className="bg-code-tile absolute inset-0 pointer-events-none" />

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left column: narrative and actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <Cluster gap={8} className="mb-3.5">
              <Chip variant="blue">{kicker}</Chip>
              <Chip variant="green">{statusBadge}</Chip>
            </Cluster>

            {/* Main heading limited to two lines */}
            <h1
              className="font-extrabold tracking-tight mb-3.5"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.3rem, 4.4vw, 3.8rem)",
                lineHeight: 1.1,
                color: "var(--ink)",
              }}
            >
              {headline} <br />
              <span style={{ color: "var(--google-blue)" }}>{headlineAccent}</span>
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed mb-5 font-normal"
              style={{
                color: "var(--ink-secondary)",
                maxWidth: "58ch",
              }}
            >
              {valueProp} Mahasiswa aktif Sistem Informasi di {university}.
            </p>

            {/* Primary actions */}
            <Cluster gap={16} className="mb-5">
              <button
                onClick={() => scrollToSection("projects")}
                className="neo-btn-primary font-bold text-base"
              >
                Lihat Proyek
                <Icon name="arrow-right" size={18} />
              </button>

              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary font-bold text-base"
              >
                <Icon name="download" size={18} />
                Unduh CV
              </a>
            </Cluster>

            {/* Social link pills */}
            <Cluster gap={8} className="pt-0.5">
              <span
                className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mr-1"
                style={{ color: "var(--ink-muted)" }}
              >
                Tautan:
              </span>
              <a
                href={github}
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
                href={linkedin}
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
                href={`mailto:${email}`}
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
            <div className="w-full max-w-[360px] lg:max-w-[380px]">
              <Card variant="flat" className="p-0 overflow-hidden">
                <div
                  className="h-10 px-3.5 flex items-center justify-between border-b-2"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#ea4335]" />
                    <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#fbbc04]" />
                    <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#34a853]" />
                    <span
                      className="text-[11px] font-mono ml-1.5 font-bold"
                      style={{ color: "var(--ink)" }}
                    >
                      raynar-dev.ts
                    </span>
                  </div>
                  <Chip variant="green" className="text-[11px] py-0.5 px-2">Online</Chip>
                </div>

                <div className="p-3.5 sm:p-4">
                  <div
                    className="w-full aspect-[4/4.5] max-h-[350px] rounded-2xl overflow-hidden border-2 relative"
                    style={{
                      backgroundColor: "var(--canvas)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <img
                      src={avatar}
                      alt={`Foto Profil ${info.name || "Muhammad Raynar Hammam"}`}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </div>

                  <div
                    className="mt-4 p-3.5 sm:p-4 rounded-xl border-2 flex flex-col gap-2.5"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div
                        className="font-extrabold text-sm sm:text-base font-mono tracking-tight"
                        style={{ color: "var(--ink)" }}
                      >
                        {displayName}
                      </div>
                      <div
                        className="text-xs font-semibold leading-relaxed"
                        style={{ color: "var(--google-blue)" }}
                      >
                        Mahasiswa Sistem Informasi • {university}
                      </div>
                    </div>

                    <div
                      className="pt-2.5 border-t border-[var(--border)] flex items-center"
                    >
                      <span
                        className="neo-badge text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 inline-flex items-center gap-1.5 max-w-full"
                        style={{
                          backgroundColor: "var(--google-blue-bg)",
                          color: "var(--google-blue-text)",
                          borderColor: "var(--google-blue)",
                        }}
                      >
                        <Icon name="map-pin" size={12} className="shrink-0 text-[var(--google-blue)]" />
                        <span className="truncate">{location}</span>
                      </span>
                    </div>
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
function About({
  info = PERSONAL_INFO,
  education = EDUCATION,
  projectCount = 8,
  certCount = 9,
}) {
  const university = info.university || PERSONAL_INFO.university;

  return (
    <Section id="about" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <SectionHeading
          kicker="PROFIL PENGEMBANG"
          title="Tentang"
          accent="Saya"
          subtitle="Latar belakang akademik, rekayasa perangkat lunak, dan pendekatan praktis dalam membangun sistem informasi bisnis."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-16">
          {/* Narrative description and engineering philosophy */}
          <div className="flex flex-col justify-between">
            <div
              className="space-y-4 text-base sm:text-lg leading-relaxed mb-6"
              style={{ color: "var(--ink-secondary)" }}
            >
              <p>
                {info.aboutP1 ? (
                  info.aboutP1
                ) : (
                  <>
                    Saya adalah mahasiswa{" "}
                    <strong className="font-bold text-blue-600 dark:text-blue-400">
                      Sistem Informasi di {university}
                    </strong>{" "}
                    dengan fokus rekayasa perangkat lunak web full-stack, solusi
                    mobile lintas platform, dan pemodelan basis data relasional.
                  </>
                )}
              </p>
              <p>
                {info.aboutP2 ||
                  "Perjalanan teknis saya berakar dari pendidikan kejuruan di SMK Negeri 2 Surabaya (Jurusan Rekayasa Perangkat Lunak). Di sana saya membangun fondasi pemrograman terstruktur, algoritma, serta arsitektur aplikasi berbasis web modern."}
              </p>
              <p>
                {info.aboutP3 ? (
                  info.aboutP3
                ) : (
                  <>
                    Dalam setiap proyek, saya mengutamakan{" "}
                    <strong className="font-bold" style={{ color: "var(--ink)" }}>
                      fungsionalitas dan efisiensi operasional
                    </strong>
                    : memetakan alur proses bisnis riil ke dalam antarmuka yang
                    intuitif dan sistem backend yang tangguh.
                  </>
                )}
              </p>
            </div>

            {/* Engineering principle quote card */}
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
                {info.principleTitle || "PRINSIP REKAYASA (KEY POINT)"}
              </div>
              <blockquote
                className="text-base sm:text-lg font-bold leading-snug"
                style={{ color: "var(--google-blue-text)" }}
              >
                &ldquo;
                {info.principleQuote ||
                  "Menghubungkan proses bisnis nyata dengan arsitektur perangkat lunak yang fungsional, terukur, dan efisien."}
                &rdquo;
              </blockquote>
            </div>
          </div>

          {/* Formal education cards */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                name="education"
                size={16}
                style={{ color: "var(--google-blue)" }}
              />
              <span
                className="text-xs font-extrabold font-mono uppercase tracking-wider"
                style={{ color: "var(--ink-muted)" }}
              >
                RIWAYAT PENDIDIKAN FORMAL
              </span>
            </div>

            <div className="flex flex-col justify-between gap-4 h-full">
              {education.map((edu, idx) => (
                <div
                  key={edu.school + edu.degree}
                  className="neo-card-flat p-5 sm:p-6 border-l-4 flex-1 flex flex-col justify-between"
                  style={{
                    borderLeftColor:
                      idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {edu.period}
                      </span>
                      {edu.active && <Chip variant="green">Aktif</Chip>}
                    </div>
                    <h4
                      className="font-extrabold text-lg sm:text-xl mb-1"
                      style={{
                        color: "var(--ink)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {edu.degree}
                    </h4>
                    <p
                      className="text-sm font-bold mb-2"
                      style={{
                        color:
                          idx === 0 ? "var(--google-blue)" : "var(--google-green)",
                      }}
                    >
                      {edu.school}
                    </p>
                  </div>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {edu.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real impact metrics (By The Numbers) */}
        <div
          className="pt-10 border-t-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mb-6">
            <div className="kicker mb-2 text-xs sm:text-sm font-extrabold">
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
                  [{projectCount}+]
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
                  [{certCount}+]
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
function Skills({ categories = SKILL_CATEGORIES }) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {categories.map((cat, idx) => (
            <Card key={cat.id || cat.name} className="flex flex-col justify-between h-full">
              <div className="flex flex-col h-full">
                {/* Fixed-height header ensures divider baseline alignment */}
                <div
                  className="flex items-center gap-2.5 mb-5 pb-3 border-b-2 h-[72px]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="shrink-0"
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
                    className="font-extrabold text-base sm:text-lg lg:text-xl leading-snug line-clamp-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {cat.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 content-start flex-1">
                  {cat.skills.map((skill) => (
                    <Chip key={skill} variant="default">
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// Projects preview
function ProjectsPreview({ projects = PROJECTS, onOpenCaseStudy }) {
  const featuredHero = projects.find((p) => p.featured) || projects[0];
  const secondaryFeatured = projects.filter(
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
            Lihat Semua Proyek ({projects.length})
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
function ExperiencePreview({ experience = EXPERIENCE }) {
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
          {experience.slice(0, 3).map((item, idx) => (
            <ExpCard key={item.role + item.org} item={item} index={idx} />
          ))}
        </Stack>
      </Container>
    </Section>
  );
}

// Certifications section
function CertificationsSection({ certifications = CERTIFICATIONS }) {
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
          {certifications.slice(0, 6).map((cert) => {
            const pColor =
              providerColors[cert.provider] || "var(--google-blue)";

            return (
              <Card
                key={cert.credentialId || cert.id}
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

// Contact section with dynamic contact form
function Contact({ info = PERSONAL_INFO }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setFeedback({
        type: "error",
        text: "Mohon lengkapi nama, email, dan pesan Anda.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      await submitContactMessage(formData);
      setFeedback({
        type: "success",
        text: "Pesan berhasil dikirim! Terima kasih telah menghubungi saya.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFeedback({
        type: "error",
        text: "Gagal mengirim pesan ke server. Silakan hubungi langsung via email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = info.email || PERSONAL_INFO.email;
  const linkedin = info.linkedin || PERSONAL_INFO.linkedin;
  const location = info.location || PERSONAL_INFO.location;
  const timezone = info.timezone || PERSONAL_INFO.timezone;
  const status = info.status || PERSONAL_INFO.status;

  return (
    <Section id="contact" style={{ backgroundColor: "var(--canvas)" }}>
      <Container>
        <Card variant="flat" className="p-0 overflow-hidden max-w-3xl mx-auto">
          <div className="google-bar" />

          <div className="p-8 sm:p-12 text-center">
            <div className="kicker mb-3 justify-center text-xs sm:text-sm font-extrabold">
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
                href={`mailto:${email}`}
                className="neo-btn-primary font-bold text-base"
                style={{
                  backgroundColor: "var(--google-red)",
                  borderColor: "var(--border)",
                }}
              >
                <Icon name="mail" size={20} />
                {email}
              </a>

              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary font-bold text-base"
              >
                Hubungi via LinkedIn
                <Icon name="external-link" size={16} />
              </a>
            </Cluster>

            {/* Interactive contact submission form */}
            <form
              onSubmit={handleSubmit}
              className="mb-8 text-left space-y-4 max-w-xl mx-auto pt-8 border-t-2"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-xs font-bold font-mono uppercase mb-1.5"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                      color: "var(--ink)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-bold font-mono uppercase mb-1.5"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                      color: "var(--ink)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-xs font-bold font-mono uppercase mb-1.5"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Subjek / Topik
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Peluang magang / diskusi proyek"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold font-mono uppercase mb-1.5"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Pesan
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tuliskan pesan atau detail kolaborasi di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all resize-y"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                  }}
                />
              </div>

              {feedback && (
                <div
                  className="p-3.5 rounded-xl border-2 text-sm font-bold flex items-center gap-2"
                  style={{
                    backgroundColor:
                      feedback.type === "success"
                        ? "var(--google-green-bg)"
                        : "var(--google-red-bg)",
                    borderColor:
                      feedback.type === "success"
                        ? "var(--google-green)"
                        : "var(--google-red)",
                    color:
                      feedback.type === "success"
                        ? "var(--google-green-text)"
                        : "var(--google-red-text)",
                  }}
                >
                  <Icon
                    name={feedback.type === "success" ? "check" : "alert"}
                    size={18}
                  />
                  <span>{feedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-btn-primary font-bold text-sm w-full sm:w-auto"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                <Icon name="arrow-right" size={16} />
              </button>
            </form>

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
                {location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={15} />
                {timezone}
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                {status}
              </span>
            </Cluster>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

// Home page view
function HomePage({
  info,
  education,
  categories,
  projects,
  experience,
  certifications,
  onOpenCaseStudy,
}) {
  return (
    <main>
      <Hero info={info} />
      <About
        info={info}
        education={education}
        projectCount={projects.length}
        certCount={certifications.length}
      />
      <Skills categories={categories} />
      <ProjectsPreview
        projects={projects}
        onOpenCaseStudy={onOpenCaseStudy}
      />
      <ExperiencePreview experience={experience} />
      <CertificationsSection certifications={certifications} />
      <Contact info={info} />
    </main>
  );
}

// Public pages layout wrapper
function PublicLayout({ dark, toggleDark, children }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
    >
      <Navbar />
      <ScrollTopFab dark={dark} toggleDark={toggleDark} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// App root component
export default function App() {
  const [dark, toggleDark] = useDarkMode();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Dynamic portfolio states with static fallbacks
  const [info, setInfo] = useState(PERSONAL_INFO);
  const [projects, setProjects] = useState(PROJECTS);
  const [experience, setExperience] = useState(EXPERIENCE);
  const [skills, setSkills] = useState(SKILL_CATEGORIES);
  const [education, setEducation] = useState(EDUCATION);
  const [certifications, setCertifications] = useState(CERTIFICATIONS);

  // Load published data on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadPortfolioData() {
      try {
        const [
          fetchedInfo,
          fetchedProjects,
          fetchedExp,
          fetchedSkills,
          fetchedEdu,
          fetchedCerts,
        ] = await Promise.all([
          getSiteSettings(),
          getProjects(),
          getExperience(),
          getSkillCategories(),
          getEducation(),
          getCertifications(),
        ]);

        if (isMounted) {
          if (fetchedInfo) setInfo(fetchedInfo);
          if (fetchedProjects?.length) setProjects(fetchedProjects);
          if (fetchedExp?.length) setExperience(fetchedExp);
          if (fetchedSkills?.length) setSkills(fetchedSkills);
          if (fetchedEdu?.length) setEducation(fetchedEdu);
          if (fetchedCerts?.length) setCertifications(fetchedCerts);
        }
      } catch {
        // Fallbacks already in place
      }
    }
    loadPortfolioData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public portfolio views */}
        <Route
          path="/"
          element={
            <PublicLayout dark={dark} toggleDark={toggleDark}>
              <HomePage
                info={info}
                education={education}
                categories={skills}
                projects={projects}
                experience={experience}
                certifications={certifications}
                onOpenCaseStudy={setSelectedCaseStudy}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <PublicLayout dark={dark} toggleDark={toggleDark}>
              <ProjectPage
                projects={projects}
                onOpenCaseStudy={setSelectedCaseStudy}
              />
            </PublicLayout>
          }
        />
        <Route
          path="/experience"
          element={
            <PublicLayout dark={dark} toggleDark={toggleDark}>
              <ExperiencePage
                experience={experience}
                education={education}
              />
            </PublicLayout>
          }
        />

        {/* Admin CMS portal routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>

      {selectedCaseStudy && (
        <CaseStudyModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}
    </BrowserRouter>
  );
}
