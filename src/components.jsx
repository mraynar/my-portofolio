import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PERSONAL_INFO } from "./data";
import { Icon } from "./components/icons/Icon";

export { Icon } from "./components/icons/Icon";
export { ICON_REGISTRY, ICON_KEYS } from "./components/icons/registry.js";

// Wide 1360px max-width container with responsive padding
export function Container({ children, className = "", style = {} }) {
  return (
    <div
      className={`w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// Section wrapper with sticky navbar clearance and balanced padding
export function Section({ id, children, className = "", style = {} }) {
  return (
    <section
      id={id}
      className={`py-10 sm:py-14 lg:py-16 border-b-2 ${className}`}
      style={{
        borderColor: "var(--border)",
        scrollMarginTop: "calc(var(--nav-h) + 12px)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// Vertical flex stack with token gaps
export function Stack({ children, gap = 16, className = "", style = {} }) {
  const gapClasses = {
    4: "gap-1",
    8: "gap-2",
    12: "gap-3",
    16: "gap-4",
    24: "gap-6",
    32: "gap-8",
    48: "gap-12",
    64: "gap-16",
  };

  return (
    <div
      className={`flex flex-col ${gapClasses[gap] || "gap-4"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// Horizontal wrapping cluster with token gaps
export function Cluster({ children, gap = 8, className = "", style = {} }) {
  const gapClasses = {
    4: "gap-1",
    8: "gap-2",
    12: "gap-3",
    16: "gap-4",
    24: "gap-6",
    32: "gap-8",
  };

  return (
    <div
      className={`flex flex-wrap items-center ${gapClasses[gap] || "gap-2"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// Chip tag component with guaranteed min height and padding
export function Chip({
  children,
  variant = "default",
  className = "",
  style = {},
}) {
  const variantStyles = {
    default: {
      backgroundColor: "var(--surface-alt)",
      color: "var(--ink)",
      borderColor: "var(--border)",
    },
    blue: {
      backgroundColor: "var(--google-blue-bg)",
      color: "var(--google-blue-text)",
      borderColor: "var(--google-blue)",
    },
    green: {
      backgroundColor: "var(--google-green-bg)",
      color: "var(--google-green-text)",
      borderColor: "var(--google-green)",
    },
    yellow: {
      backgroundColor: "var(--google-yellow-bg)",
      color: "var(--google-yellow-text)",
      borderColor: "var(--google-yellow)",
    },
    red: {
      backgroundColor: "var(--google-red-bg)",
      color: "var(--google-red-text)",
      borderColor: "var(--google-red)",
    },
  };

  return (
    <span
      className={`neo-badge text-xs sm:text-sm font-bold ${className}`}
      style={{ ...(variantStyles[variant] || variantStyles.default), ...style }}
    >
      {children}
    </span>
  );
}

// Neo-brutalist card with rigid responsive padding
export function Card({
  children,
  variant = "interactive",
  className = "",
  style = {},
}) {
  const baseClass = variant === "flat" ? "neo-card-flat" : "neo-card";

  return (
    <div className={`${baseClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

// Section title with uppercase blue eyebrow kicker
export function SectionHeading({
  kicker,
  title,
  accent,
  subtitle,
  center = false,
}) {
  return (
    <div
      className={`mb-10 sm:mb-14 ${center ? "text-center mx-auto" : ""}`}
      style={{ maxWidth: center ? "800px" : "100%" }}
    >
      {kicker && (
        <div
          className={`kicker mb-3 text-xs sm:text-sm ${center ? "justify-center" : ""}`}
        >
          {kicker}
        </div>
      )}
      <h2
        className="font-extrabold tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
          lineHeight: 1.15,
          color: "var(--ink)",
        }}
      >
        {title}{" "}
        {accent && <span style={{ color: "var(--google-blue)" }}>{accent}</span>}
      </h2>
      {subtitle && (
        <p
          className="mt-3.5 text-base sm:text-lg leading-relaxed font-normal"
          style={{
            color: "var(--ink-secondary)",
            maxWidth: "65ch",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Case study modal dialog
export function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!project) return null;
  const cs = project.caseStudy;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="neo-card-flat relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"
        style={{ backgroundColor: "var(--surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Google accent bar */}
        <div className="google-bar -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6" />

        {/* Modal header */}
        <div
          className="flex items-start justify-between gap-4 border-b-2 pb-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <Cluster gap={8} className="mb-2">
              <Chip variant="blue">{project.label}</Chip>
              {cs?.duration && (
                <span
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: "var(--ink-muted)" }}
                >
                  - {cs.duration}
                </span>
              )}
            </Cluster>
            <h3
              className="text-2xl sm:text-3xl font-extrabold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink)",
              }}
            >
              {project.title}
            </h3>
            {cs?.role && (
              <p
                className="text-sm sm:text-base font-semibold mt-1"
                style={{ color: "var(--google-blue)" }}
              >
                Peran: {cs.role} {cs.client ? `| Klien: ${cs.client}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="neo-badge cursor-pointer p-2 hover:opacity-80"
            style={{
              backgroundColor: "var(--surface-alt)",
              color: "var(--ink)",
            }}
            aria-label="Tutup dialog"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-6 pt-5">
          <div>
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--google-red)" }}
            >
              01. Latar Belakang & Masalah
            </h4>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ink-secondary)" }}
            >
              {cs?.background || project.problem}
            </p>
          </div>

          <div>
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--google-blue)" }}
            >
              02. Pendekatan Solusi
            </h4>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ink-secondary)" }}
            >
              {cs?.solution || project.solution}
            </p>
          </div>

          <div>
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--google-yellow)" }}
            >
              03. Arsitektur & Teknologi
            </h4>
            <p
              className="text-base leading-relaxed mb-3"
              style={{ color: "var(--ink-secondary)" }}
            >
              {cs?.architecture ||
                "Arsitektur modular memisahkan lapisan antarmuka pengguna, logika bisnis, dan basis data."}
            </p>
            <Cluster gap={8}>
              {project.badges.map((b) => (
                <Chip key={b} variant="default">
                  {b}
                </Chip>
              ))}
            </Cluster>
          </div>

          <div
            className="p-4 sm:p-5 rounded-xl border-2"
            style={{
              backgroundColor: "var(--google-green-bg)",
              borderColor: "var(--google-green)",
            }}
          >
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-1"
              style={{ color: "var(--google-green-text)" }}
            >
              04. Dampak Konkret
            </h4>
            <p
              className="text-base sm:text-lg font-bold"
              style={{ color: "var(--google-green-text)" }}
            >
              {cs?.impact || project.impact}
            </p>
          </div>

          <div
            className="p-4 rounded-xl border-2 text-xs sm:text-sm"
            style={{
              backgroundColor: "var(--canvas)",
              borderColor: "var(--border)",
            }}
          >
            <span className="font-bold">Status Repositori: </span>
            <span style={{ color: "var(--ink-secondary)" }}>
              {project.repoReason || project.repoNotice}
            </span>
          </div>

          <Cluster gap={12} className="justify-end pt-4 border-t-2" style={{ borderColor: "var(--border)" }}>
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-primary text-sm sm:text-base font-bold"
              >
                Kunjungi Live Demo
                <Icon name="external-link" size={16} />
              </a>
            )}
            <button
              onClick={onClose}
              className="neo-btn-secondary text-sm sm:text-base font-bold"
            >
              Tutup
            </button>
          </Cluster>
        </div>
      </div>
    </div>
  );
}

// Featured hero project card with balanced two-column layout
export function FeaturedHeroCard({ project, onOpenCaseStudy }) {
  return (
    <div
      className="neo-card-flat grid grid-cols-1 lg:grid-cols-12 mb-12 p-0 overflow-hidden"
      style={{
        borderWidth: "3px",
      }}
    >
      {/* Visual media frame (7 cols) */}
      <div
        className="lg:col-span-7 relative border-b-2 lg:border-b-0 lg:border-r-2 flex flex-col"
        style={{
          backgroundColor: "var(--canvas)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="h-11 px-4 flex items-center justify-between border-b-2 flex-shrink-0"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#ea4335]" />
            <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#fbbc04]" />
            <span className="w-3 h-3 rounded-full border border-[var(--border)] bg-[#34a853]" />
            <span
              className="text-xs font-mono ml-2 font-bold truncate max-w-[200px]"
              style={{ color: "var(--ink)" }}
            >
              {project.title}
            </span>
          </div>
          <Chip variant="blue">{project.label}</Chip>
        </div>

        <div className="relative w-full aspect-[16/10] overflow-hidden flex-1">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-base text-gray-500">
              Preview Proyek
            </div>
          )}
        </div>
      </div>

      {/* Narrative details (5 cols) with guaranteed padding */}
      <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="mb-3">
            <Chip variant="blue">
              <Icon name="star" size={14} className="mr-1.5" />
              PROYEK UNGGULAN
            </Chip>
          </div>

          <h3
            className="font-extrabold text-2xl sm:text-3xl mb-3 leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {project.title}
          </h3>

          <p
            className="text-base sm:text-lg leading-relaxed mb-5"
            style={{ color: "var(--ink-secondary)" }}
          >
            {project.problem}
          </p>

          <div
            className="p-4 rounded-xl border-2 mb-5"
            style={{
              backgroundColor: "var(--google-blue-bg)",
              borderColor: "var(--google-blue)",
            }}
          >
            <div
              className="text-xs font-bold font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5"
              style={{ color: "var(--google-blue-text)" }}
            >
              <Icon name="bolt" size={14} />
              DAMPAK BISNIS NYATA
            </div>
            <div
              className="text-base sm:text-lg font-bold"
              style={{ color: "var(--google-blue-text)" }}
            >
              {project.impact}
            </div>
          </div>

          <Cluster gap={8} className="mb-6">
            {project.badges.map((b) => (
              <Chip key={b} variant="default">
                {b}
              </Chip>
            ))}
          </Cluster>
        </div>

        <Stack
          gap={12}
          className="pt-4 border-t-2"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={() => onOpenCaseStudy(project)}
            className="w-full neo-btn-primary font-bold text-base"
          >
            Lihat Studi Kasus Lengkap
            <Icon name="arrow-right" size={18} />
          </button>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full neo-btn-secondary font-bold text-base text-center"
            >
              Buka Live Demo
              <Icon name="external-link" size={16} />
            </a>
          )}

          <span
            className="inline-flex items-center justify-center gap-1.5 text-xs text-center font-semibold"
            style={{ color: "var(--ink-muted)" }}
          >
            <Icon name="lock" size={13} />
            {project.repoNotice}
          </span>
        </Stack>
      </div>
    </div>
  );
}

// Landscape oriented project card with vertical deck layout
export function ProjectCard({ project, onOpenCaseStudy }) {
  const categoryConfig = {
    "Web App": {
      variant: "blue",
      topBorder: "#1a73e8",
      impactBg: "var(--google-blue-bg)",
      impactText: "var(--google-blue-text)",
      impactBorder: "var(--google-blue)",
    },
    "Mobile App": {
      variant: "yellow",
      topBorder: "#f29900",
      impactBg: "var(--google-yellow-bg)",
      impactText: "var(--google-yellow-text)",
      impactBorder: "var(--google-yellow)",
    },
    "UI/UX Design": {
      variant: "red",
      topBorder: "#ea4335",
      impactBg: "var(--google-red-bg)",
      impactText: "var(--google-red-text)",
      impactBorder: "var(--google-red)",
    },
    "Data Analyst": {
      variant: "green",
      topBorder: "#188038",
      impactBg: "var(--google-green-bg)",
      impactText: "var(--google-green-text)",
      impactBorder: "var(--google-green)",
    },
  };

  const cfg = categoryConfig[project.label] || categoryConfig["Web App"];

  return (
    <div className="neo-card p-0 flex flex-col h-full overflow-hidden">
      {/* Top category strip */}
      <div style={{ height: 6, backgroundColor: cfg.topBorder }} />

      {/* Browser titlebar */}
      <div
        className="h-10 px-3 flex items-center justify-between border-b-2 flex-shrink-0"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#ea4335]" />
          <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#fbbc04]" />
          <span className="w-2.5 h-2.5 rounded-full border border-[var(--border)] bg-[#34a853]" />
        </div>
        <Chip variant={cfg.variant}>{project.label}</Chip>
      </div>

      {/* Landscape media frame (16:10 aspect ratio) */}
      <div
        className="relative w-full aspect-[16/10] overflow-hidden border-b-2 flex-shrink-0"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--canvas)",
        }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-sm text-gray-500">
            Preview Proyek
          </div>
        )}
      </div>

      {/* Narrative details column */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-extrabold text-lg sm:text-xl mb-2 leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {project.title}
          </h3>

          <p
            className="text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2"
            style={{ color: "var(--ink-secondary)" }}
          >
            {project.problem}
          </p>

          <div
            className="p-2.5 rounded-xl border-2 mb-3 text-xs font-semibold"
            style={{
              backgroundColor: cfg.impactBg,
              borderColor: cfg.impactBorder,
              color: cfg.impactText,
            }}
          >
            <div className="font-mono text-[11px] uppercase tracking-wider font-extrabold mb-0.5 flex items-center gap-1">
              <Icon name="bolt" size={12} />
              DAMPAK UTAMA
            </div>
            <div className="line-clamp-2">{project.impact}</div>
          </div>

          <Cluster gap={6} className="mb-4">
            {project.badges.slice(0, 3).map((b) => (
              <Chip key={b} variant="default">
                {b}
              </Chip>
            ))}
            {project.badges.length > 3 && (
              <span
                className="text-xs px-2 py-0.5 font-bold font-mono"
                style={{ color: "var(--ink-muted)" }}
              >
                +{project.badges.length - 3}
              </span>
            )}
          </Cluster>
        </div>

        {/* Pinned action buttons */}
        <div
          className="pt-3 border-t-2 mt-auto space-y-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCaseStudy(project)}
              className="flex-1 neo-btn-primary font-bold text-xs sm:text-sm py-2 px-3 justify-center"
            >
              Lihat Studi Kasus
              <Icon name="arrow-right" size={14} />
            </button>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary text-xs font-bold py-2 px-3 text-center"
                aria-label="Buka Live Demo"
                title="Buka Live Demo"
              >
                <Icon name="external-link" size={14} />
              </a>
            )}
          </div>

          <span
            className="inline-flex items-center justify-center gap-1 text-[11px] text-center font-semibold block truncate"
            style={{ color: "var(--ink-muted)" }}
          >
            <Icon name="lock" size={11} />
            {project.repoNotice}
          </span>
        </div>
      </div>
    </div>
  );
}

// Progressive career journey milestone card with wide landscape media
export function ExpCard({ item, index = 0, isLast = false }) {
  const numberThemes = [
    { bg: "var(--google-blue)", text: "#ffffff" },
    { bg: "var(--google-green)", text: "#ffffff" },
    { bg: "var(--google-yellow)", text: "#1f1f1f" },
    { bg: "var(--google-red)", text: "#ffffff" },
  ];
  const numColor = numberThemes[index % 4];

  return (
    <div className="relative pl-10 sm:pl-14 lg:pl-16 mb-8 sm:mb-12 last:mb-0">
      {/* Connected vertical journey line linking milestones */}
      {!isLast && (
        <div
          className="absolute left-3.5 sm:left-5 lg:left-6 top-10 bottom-[-2rem] sm:bottom-[-3rem] w-1"
          style={{
            backgroundColor: "var(--border)",
          }}
        />
      )}

      {/* Embossed milestone step badge directly on the spine */}
      <div
        className="absolute left-0 sm:left-1 lg:left-2 top-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center font-extrabold font-mono text-xs sm:text-sm shadow-[2px_2px_0_var(--shadow-color)] z-10"
        style={{ backgroundColor: numColor.bg, color: numColor.text }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Card with wide landscape photo banner and contained width */}
      <div className="neo-card p-0 overflow-hidden relative">
        {item.photo && (
          <div
            className="w-full aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7] relative overflow-hidden border-b-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--canvas)",
            }}
          >
            <img
              src={item.photo}
              alt={item.photoAlt || item.role}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2">
              <span className="neo-badge text-xs font-bold px-2.5 py-1 bg-white/95 dark:bg-black/85 text-[var(--ink)] border-2 border-[var(--border)] backdrop-blur-sm">
                {item.type || item.category || "Organisasi"}
              </span>
              <span className="neo-badge text-xs font-mono font-bold px-2.5 py-1 bg-white/95 dark:bg-black/85 text-[var(--ink)] border-2 border-[var(--border)] backdrop-blur-sm">
                {item.period}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7">
          {!item.photo && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="text-xs font-bold font-mono uppercase tracking-wider"
                style={{ color: "var(--ink-muted)" }}
              >
                {item.type || item.category || "Organisasi"}
              </span>
              <span
                className="text-xs sm:text-sm font-bold font-mono tracking-wider"
                style={{ color: "var(--ink-muted)" }}
              >
                {item.period}
              </span>
            </div>
          )}

          <h3
            className="text-xl sm:text-2xl font-extrabold mb-1 leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {item.role}
          </h3>
          <p
            className="text-base sm:text-lg font-bold mb-4"
            style={{ color: "var(--google-blue)" }}
          >
            {item.org}
          </p>

          {item.bullets && item.bullets.length > 0 && (
            <ul
              className="space-y-2.5 mb-5 text-sm sm:text-base leading-relaxed"
              style={{ color: "var(--ink-secondary)" }}
            >
              {item.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="mt-1 flex-shrink-0"
                    style={{ color: "var(--google-blue)" }}
                  >
                    <Icon name="chevron-right" size={15} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {item.tags && item.tags.length > 0 && (
            <Cluster
              gap={8}
              className="pt-4 border-t-2"
              style={{ borderColor: "var(--border)" }}
            >
              {item.tags.map((t) => (
                <Chip key={t} variant="default">
                  {t}
                </Chip>
              ))}
            </Cluster>
          )}
        </div>
      </div>
    </div>
  );
}

// Sticky header navbar with 1px border and clean wordmark
export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Beranda", href: "/#home" },
    { label: "Tentang", href: "/#about" },
    { label: "Keahlian", href: "/#skills" },
    { label: "Proyek", href: "/projects" },
    { label: "Pengalaman", href: "/experience" },
    { label: "Kontak", href: "/#contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-h)] border-b"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <Container className="h-full flex items-center justify-between">
        {/* Clean brand wordmark */}
        <a
          href="/#home"
          className="font-extrabold text-2xl tracking-tight no-underline flex items-center gap-1.5"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          <span>mraynar</span>
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: "var(--google-blue)" }}
          />
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((item) => {
            const isInternal = item.href.startsWith("/#");
            const isActive = isInternal
              ? location.pathname === "/" &&
                location.hash === item.href.replace("/", "")
              : location.pathname === item.href;

            return (
              <a
                key={item.label}
                href={item.href}
                className="text-base font-bold no-underline transition-colors py-1 hover:text-[var(--google-blue)]"
                style={{
                  color: isActive
                    ? "var(--google-blue)"
                    : "var(--ink-secondary)",
                  borderBottom: isActive
                    ? "2px solid var(--google-blue)"
                    : "2px solid transparent",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <a
            href={PERSONAL_INFO.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex neo-btn-primary neo-btn-sm font-bold"
          >
            <Icon name="download" size={14} />
            Unduh CV
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-[2px_2px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-b-2 px-6 py-6 space-y-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-lg font-bold py-1 no-underline"
              style={{ color: "var(--ink)" }}
            >
              {item.label}
            </a>
          ))}
          <div
            className="pt-4 border-t-2"
            style={{ borderColor: "var(--border)" }}
          >
            <a
              href={PERSONAL_INFO.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full neo-btn-primary text-center font-bold block"
            >
              <Icon name="download" size={16} className="mr-1.5" />
              Unduh CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// Footer with contact links
export function Footer() {
  return (
    <footer
      className="border-t-2"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="google-bar" />

      <Container className="py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div
              className="font-extrabold text-xl tracking-tight mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {PERSONAL_INFO.name}
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--ink-muted)" }}
            >
              Mahasiswa Sistem Informasi - {PERSONAL_INFO.university}
            </p>
          </div>

          <Cluster gap={8} className="justify-center">
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

        <div
          className="mt-8 pt-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-semibold"
          style={{ borderColor: "var(--border)", color: "var(--ink-muted)" }}
        >
          <div>
            Copyright (c) {new Date().getFullYear()} Muhammad Raynar Hammam. All
            rights reserved.
          </div>
          <div>Bahasa Visual: Neo-Brutalism Google Event Surabaya</div>
        </div>
      </Container>
    </footer>
  );
}

// Floating controls for theme toggle and vertical scroll navigation
export function ScrollTopFab({ dark, toggleDark }) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setCanScrollUp(scrollY > 200);
      setCanScrollDown(scrollY + windowHeight < docHeight - 150);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Light and dark mode toggle button placed above scroll controls */}
      {toggleDark && (
        <button
          onClick={toggleDark}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer transition-all"
          aria-label={
            dark ? "Beralih ke mode terang" : "Beralih ke mode gelap"
          }
          title={dark ? "Mode Terang" : "Mode Gelap"}
        >
          <Icon name={dark ? "sun" : "moon"} size={20} />
        </button>
      )}

      {/* Smooth scroll to top button */}
      {canScrollUp && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer transition-all"
          aria-label="Gulir ke atas"
          title="Gulir ke atas"
        >
          <Icon name="chevron-up" size={22} />
        </button>
      )}

      {/* Smooth scroll to bottom button */}
      {canScrollDown && (
        <button
          onClick={scrollToBottom}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer transition-all"
          aria-label="Gulir ke bawah"
          title="Gulir ke bawah"
        >
          <Icon name="chevron-down" size={22} />
        </button>
      )}
    </div>
  );
}
