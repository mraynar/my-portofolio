import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import {
  Container,
  Section,
  Cluster,
  Card,
  Chip,
  SectionHeading,
  ProjectCard,
  ExpCard,
  CareerPathwayBridge,
  RoadTrack,
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
  isInternshipExperience,
  sortExperiencesLatestFirst,
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
  const { t, language } = useLanguage();
  const kicker = info.kicker || t("hero_tag");
  const statusBadge = info.statusBadge || "UPN Veteran Jawa Timur";
  const headline = info.headline || "Muhammad Raynar";
  const headlineAccent = info.headlineAccent || "Hammam";
  const valueProp =
    language === "en"
      ? info.valuePropEn || t("hero_bio")
      : info.valueProp || PERSONAL_INFO.valueProp;
  const university = info.university || PERSONAL_INFO.university;
  const cvUrl = info.cvUrl || PERSONAL_INFO.cvUrl;
  const github = info.github || PERSONAL_INFO.github;
  const linkedin = info.linkedin || PERSONAL_INFO.linkedin;
  const instagram =
    info.instagram ||
    PERSONAL_INFO.instagram ||
    "https://instagram.com/mraynarr";
  const email = info.email || PERSONAL_INFO.email;
  const avatar = info.avatar || PERSONAL_INFO.avatar;
  const location = info.location || PERSONAL_INFO.location;
  const displayName = info.name ? info.name.toUpperCase() : "M. RAYNAR HAMMAM";

  return (
    <Section
      id="home"
      className="relative min-h-[calc(100dvh-var(--nav-h,64px))] flex items-center justify-center pt-20 sm:pt-24 lg:pt-20 pb-8 sm:pb-12 lg:pb-14"
      style={{ backgroundColor: "transparent" }}
    >
      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-stretch">
          {/* Left column: narrative and actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
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
                  maxWidth: "64ch",
                }}
              >
                {valueProp}
              </p>

              {/* Primary actions */}
              <Cluster gap={16} className="mb-5">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="neo-btn-primary font-bold text-base"
                >
                  {t("hero_view_projects")}
                  <Icon name="arrow-right" size={18} />
                </button>

                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn-secondary font-bold text-base"
                >
                  <Icon name="download" size={18} />
                  {t("download_cv")}
                </a>
              </Cluster>
            </div>

            {/* Social link pills aligned with card baseline */}
            <Cluster gap={8} className="pt-2 lg:pt-0">
              <span
                className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono mr-1"
                style={{ color: "var(--ink-muted)" }}
              >
                {t("hero_links")}
              </span>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="neo-badge text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--ink)",
                }}
              >
                GitHub
                <Icon name="github" size={14} />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="neo-badge text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue-text)",
                  borderColor: "var(--google-blue)",
                }}
              >
                LinkedIn
                <Icon name="linkedin" size={14} />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="neo-badge text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: "var(--google-yellow-bg)",
                  color: "var(--google-yellow-text)",
                  borderColor: "var(--google-yellow)",
                }}
              >
                Instagram
                <Icon name="instagram" size={14} />
              </a>
              <a
                href={`mailto:${email}`}
                className="neo-badge text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: "var(--google-red-bg)",
                  color: "var(--google-red-text)",
                  borderColor: "var(--google-red)",
                }}
              >
                Email
                <Icon name="mail" size={14} />
              </a>
            </Cluster>
          </div>

          {/* Right column: profile photo card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] lg:max-w-[460px] xl:max-w-[480px] h-full">
              <Card variant="flat" className="p-0 overflow-hidden h-full flex flex-col">
                <div
                  className="h-9 sm:h-10 px-3.5 flex items-center justify-between border-b-2 flex-shrink-0"
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
                      {info.codeCardTitle || "raynar-dev.ts"}
                    </span>
                  </div>
                  <Chip variant="green" className="text-[11px] py-0.5 px-2">
                    {t("hero_online")}
                  </Chip>
                </div>

                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between min-h-0">
                  <div
                    className="w-full h-[190px] sm:h-[220px] lg:h-auto lg:flex-1 min-h-[160px] rounded-xl overflow-hidden border-2 relative"
                    style={{
                      backgroundColor: "var(--canvas)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={`Foto Profil ${info.name || "Muhammad Raynar Hammam"}`}
                        className="w-full h-full object-cover object-top"
                        loading="eager"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none"
                        style={{ backgroundColor: "var(--surface-alt)" }}
                      >
                        <div
                          className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center mb-2.5 shadow-[2px_2px_0_var(--shadow-color)]"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                            color: "var(--google-blue)",
                          }}
                        >
                          <Icon name="user" size={28} />
                        </div>
                        <span
                          className="text-xs font-bold font-mono uppercase tracking-wider"
                          style={{ color: "var(--ink)" }}
                        >
                          {t("projects_preview")}
                        </span>
                        <span
                          className="text-[11px] font-mono mt-0.5"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {t("projects_input_cms")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="mt-3 p-3 rounded-xl border-2 flex flex-col gap-2 flex-shrink-0"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div
                        className="font-extrabold text-sm font-mono tracking-tight"
                        style={{ color: "var(--ink)" }}
                      >
                        {displayName}
                      </div>
                      <div
                        className="text-xs font-semibold leading-relaxed"
                        style={{ color: "var(--google-blue)" }}
                      >
                        {info.role
                          ? `${info.role} • ${university}`
                          : language === "en"
                          ? `Information Systems Student • ${university}`
                          : `Mahasiswa Sistem Informasi • ${university}`}
                      </div>
                    </div>

                    <div
                      className="pt-2 border-t border-[var(--border)] flex items-center"
                    >
                      <span
                        className="neo-badge text-[11px] font-bold px-2.5 py-0.5 inline-flex items-center gap-1.5 max-w-full"
                        style={{
                          backgroundColor: "var(--google-blue-bg)",
                          color: "var(--google-blue-text)",
                          borderColor: "var(--google-blue)",
                        }}
                      >
                        <Icon name="map-pin" size={12} className="mr-0.5" />
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
  const { t, language } = useLanguage();
  const university = info.university || PERSONAL_INFO.university;

  return (
    <Section id="about" style={{ backgroundColor: "transparent" }}>
      <Container>
        <SectionHeading
          kicker={t("about_kicker")}
          title={language === "en" ? "About" : "Tentang"}
          accent={language === "en" ? "Me" : "Saya"}
          subtitle={
            language === "en"
              ? "Academic background, software engineering, and practical approaches in business information systems."
              : "Latar belakang akademik, rekayasa perangkat lunak, dan pendekatan praktis dalam membangun sistem informasi bisnis."
          }
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
  const { t, language } = useLanguage();
  const categoryBarColors = [
    "var(--google-blue)",
    "var(--google-green)",
    "var(--google-yellow)",
    "var(--google-red)",
  ];

  return (
    <Section id="skills" style={{ backgroundColor: "transparent" }}>
      <Container>
        <SectionHeading
          kicker={t("skills_kicker")}
          title={language === "en" ? "Skills &" : "Keahlian &"}
          accent={language === "en" ? "Technology" : "Teknologi"}
          subtitle={t("skills_desc")}
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
  const { t, language } = useLanguage();
  const featured = projects.filter((p) => p.featured);
  const displayProjects =
    featured.length >= 3 ? featured.slice(0, 3) : projects.slice(0, 3);

  return (
    <Section id="projects" style={{ backgroundColor: "transparent" }}>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            kicker={t("projects_kicker")}
            title={language === "en" ? "Featured" : "Proyek"}
            accent={language === "en" ? "Projects" : "Unggulan"}
            subtitle={t("projects_desc")}
          />
          <Link
            to="/projects"
            className="neo-btn-secondary text-base font-bold self-start sm:self-end"
          >
            {t("projects_view_all")} ({projects.length})
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProjects.map((project) => (
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

// Experience preview separating internships and organizations with pathway
function ExperiencePreview({ experience = EXPERIENCE }) {
  const { t, language } = useLanguage();
  const sortedAll = sortExperiencesLatestFirst(experience);
  const internships = sortedAll.filter(isInternshipExperience);
  const organizations = sortedAll.filter((item) => !isInternshipExperience(item));

  return (
    <Section id="experience" style={{ backgroundColor: "transparent" }}>
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeading
            kicker={t("exp_kicker")}
            title={language === "en" ? "Experience:" : "Pengalaman"}
            accent={language === "en" ? "Internship & Org" : "Magang & Organisasi"}
            subtitle={t("exp_desc")}
          />
          <Link
            to="/experience"
            className="neo-btn-secondary text-base font-bold self-start sm:self-end"
          >
            {t("exp_view_timeline")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>

        <div className="w-full">
          {/* Internship and professional experience placed first */}
          <div className="mb-6">
            <div
              className="p-4 sm:p-5 rounded-2xl border-2 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--google-blue-bg)",
                    color: "var(--google-blue)",
                  }}
                >
                  <Icon name="briefcase" size={20} />
                </div>
                <div>
                  <h3
                    className="font-extrabold text-base sm:text-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {t("exp_internship_title")}
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {t("exp_internship_desc")}
                  </p>
                </div>
              </div>
              <span
                className="neo-badge text-xs font-mono font-bold self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue-text)",
                  borderColor: "var(--google-blue)",
                }}
              >
                {internships.length} {t("exp_milestones")}
              </span>
            </div>

            <div className="relative">
              <RoadTrack />
              {internships.map((item, idx) => (
                <ExpCard
                  key={item.id || item.role + item.org}
                  item={item}
                  index={idx}
                  isLeft={idx % 2 === 0}
                  customIndex={idx + 1}
                />
              ))}
            </div>
          </div>

          {/* Continuous career progression connector between sections */}
          <CareerPathwayBridge
            kicker="KONEKSI JEJAK KARIR"
            title="Alur Perkembangan: Dari Ekosistem Kampus ke Industri"
            description="Landasan kepemimpinan, riset organisasi, dan kolaborasi tim di kampus menjadi akselerator dalam mengeksekusi proyek rekayasa perangkat lunak di dunia industri."
          />

          {/* Section 2: Campus and leadership organizations (Placed below) */}
          <div className="mt-6">
            <div
              className="p-4 sm:p-5 rounded-2xl border-2 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--google-green-bg)",
                    color: "var(--google-green)",
                  }}
                >
                  <Icon name="users" size={20} />
                </div>
                <div>
                  <h3
                    className="font-extrabold text-base sm:text-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    Pengalaman Organisasi & Komunitas
                  </h3>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    Kemitraan publik, riset penalaran, dan pembinaan komunitas.
                  </p>
                </div>
              </div>
              <span
                className="neo-badge text-xs font-mono font-bold self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--google-green-bg)",
                  color: "var(--google-green-text)",
                  borderColor: "var(--google-green)",
                }}
              >
                {organizations.length} Pengalaman
              </span>
            </div>

            <div className="relative">
              <RoadTrack />
              {organizations.map((item, idx) => (
                <ExpCard
                  key={item.id || item.role + item.org}
                  item={item}
                  index={idx}
                  isLeft={idx % 2 === 0}
                  customIndex={internships.length + idx + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Certifications section
function CertificationsSection({ certifications = CERTIFICATIONS }) {
  const { t, language } = useLanguage();
  const providerColors = {
    Coursera: "var(--google-blue)",
    Dicoding: "var(--google-green)",
    Udemy: "var(--google-yellow-hover)",
    Karirnex: "var(--google-red)",
  };

  return (
    <Section id="certifications" style={{ backgroundColor: "transparent" }}>
      <Container>
        <SectionHeading
          kicker={t("edu_kicker")}
          title={language === "en" ? "Certifications &" : "Sertifikasi &"}
          accent={language === "en" ? "Licenses" : "Lisensi"}
          subtitle={t("edu_desc")}
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
  const { t, language } = useLanguage();
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
        text:
          language === "en"
            ? "Please complete your name, email, and message."
            : "Mohon lengkapi nama, email, dan pesan Anda.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    try {
      await submitContactMessage(formData);
      setFeedback({
        type: "success",
        text:
          language === "en"
            ? "Message sent successfully! Thank you for reaching out."
            : "Pesan berhasil dikirim! Terima kasih telah menghubungi saya.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFeedback({
        type: "error",
        text:
          language === "en"
            ? "Failed to deliver message. Please reach out directly via email."
            : "Gagal mengirim pesan ke server. Silakan hubungi langsung via email.",
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
    <Section id="contact" style={{ backgroundColor: "transparent" }}>
      <Container>
        <Card variant="flat" className="p-0 overflow-hidden w-full">
          <div className="google-bar" />

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left column: narrative and direct channels (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="kicker mb-3 text-xs sm:text-sm font-extrabold">
                    {t("contact_kicker")}
                  </div>

                  <h2
                    className="font-extrabold tracking-tight mb-3.5 leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                      color: "var(--ink)",
                    }}
                  >
                    {t("contact_title_1")}{" "}
                    <span style={{ color: "var(--google-blue)" }}>
                      {t("contact_title_2")}
                    </span>
                  </h2>

                  <p
                    className="text-sm sm:text-base mb-6 leading-relaxed"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {t("contact_desc")}
                  </p>

                  <div className="space-y-3 mb-6">
                    <a
                      href={`mailto:${email}`}
                      className="neo-btn-primary font-bold text-sm w-full justify-center"
                      style={{
                        backgroundColor: "var(--google-red)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <Icon name="mail" size={18} />
                      {email}
                    </a>

                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="neo-btn-secondary font-bold text-sm w-full justify-center"
                    >
                      {t("contact_linkedin")}
                      <Icon name="external-link" size={15} />
                    </a>
                  </div>
                </div>

                {/* Status and location badges */}
                <div
                  className="pt-4 border-t-2 flex flex-wrap gap-2 text-xs font-semibold"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--ink-muted)",
                  }}
                >
                  <span className="neo-badge text-xs font-mono">
                    <Icon name="map-pin" size={12} className="mr-1" />
                    {location}
                  </span>
                  <span className="neo-badge text-xs font-mono">
                    {timezone}
                  </span>
                  <span
                    className="neo-badge text-xs font-mono max-w-full text-left"
                    style={{
                      backgroundColor: "var(--google-green-bg)",
                      color: "var(--google-green-text)",
                      borderColor: "var(--google-green)",
                      whiteSpace: "normal",
                    }}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Right column: interactive contact form (7 cols) */}
              <div
                className="lg:col-span-7 p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              >
                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        className="block text-xs font-bold font-mono uppercase mb-1"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        {t("contact_name_label")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={t("contact_name_placeholder")}
                        className="w-full px-3 py-2 rounded-xl border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-bold font-mono uppercase mb-1"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        {t("contact_email_label")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="email@domain.com"
                        className="w-full px-3 py-2 rounded-xl border-2 font-medium text-sm transition-all"
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold font-mono uppercase mb-1"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {t("contact_subject_label")}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder={t("contact_subject_placeholder")}
                      className="w-full px-3 py-2 rounded-xl border-2 font-medium text-sm transition-all"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold font-mono uppercase mb-1"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {t("contact_message_label")}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t("contact_message_placeholder")}
                      className="w-full px-3 py-2 rounded-xl border-2 font-medium text-sm transition-all resize-y"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>

                  {feedback && (
                    <div
                      className="p-3 rounded-xl border-2 text-xs font-bold flex items-center gap-2"
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
                        size={16}
                      />
                      <span>{feedback.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neo-btn-primary font-bold text-sm w-full sm:w-auto"
                  >
                    {isSubmitting ? t("contact_sending") : t("contact_submit")}
                    <Icon name="arrow-right" size={15} />
                  </button>
                </form>
              </div>
            </div>
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
function PublicLayout({ dark, toggleDark, info, children }) {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundColor: "var(--canvas)", color: "var(--ink)" }}
    >
      {/* DevFest code symbol watermark tile background */}
      <div className="bg-code-tile fixed inset-0 pointer-events-none z-0" />
      <Navbar info={info} />
      <ScrollTopFab dark={dark} toggleDark={toggleDark} />
      <div className="flex-1 relative z-10">{children}</div>
      <Footer info={info} />
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

  // Load published data on mount and react to updates
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
          if (fetchedProjects) setProjects(fetchedProjects);
          if (fetchedExp) setExperience(fetchedExp);
          if (fetchedSkills) setSkills(fetchedSkills);
          if (fetchedEdu) setEducation(fetchedEdu);
          if (fetchedCerts) setCertifications(fetchedCerts);
        }
      } catch {
        // Fallbacks already in place
      }
    }

    loadPortfolioData();

    // Listen for data update notifications from Admin CMS
    const handleUpdate = () => {
      loadPortfolioData();
    };
    window.addEventListener("portfolio_data_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("portfolio_data_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Public portfolio views */}
          <Route
            path="/"
            element={
              <PublicLayout dark={dark} toggleDark={toggleDark} info={info}>
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
              <PublicLayout dark={dark} toggleDark={toggleDark} info={info}>
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
              <PublicLayout dark={dark} toggleDark={toggleDark} info={info}>
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
    </LanguageProvider>
  );
}
