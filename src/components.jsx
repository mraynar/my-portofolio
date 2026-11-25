import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PERSONAL_INFO } from "./data";
import { Icon } from "./components/icons/Icon";
import { useLanguage } from "./context/LanguageContext";
import {
  translateProject,
  translateExperience,
  translateText,
} from "./lib/translations";

export { Icon } from "./components/icons/Icon";
export { ICON_REGISTRY, ICON_KEYS } from "./components/icons/registry.js";

// Neo-brutalist custom select dropdown
export function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  className = "",
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null ? opt : { value: opt, label: opt }
  );

  const selectedOpt = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const handleSelect = (optValue) => {
    if (onChange) {
      onChange({ target: { value: optValue } });
    }
    setOpen(false);
  };

  // Parse labels with parenthesized notes
  const parseLabel = (label) => {
    const match = String(label).match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
      return { main: match[1], badge: match[2] };
    }
    return { main: label, badge: null };
  };

  const selectedParsed = selectedOpt ? parseLabel(selectedOpt.label) : null;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className="w-full h-[46px] px-3.5 rounded-xl border-2 flex items-center justify-between text-sm font-semibold transition-all cursor-pointer text-left focus:outline-none hover:translate-x-[-1px] hover:translate-y-[-1px]"
        style={{
          backgroundColor: "var(--surface-alt)",
          borderColor: open ? "var(--google-blue)" : "var(--border)",
          color: "var(--ink)",
          boxShadow: open
            ? "3px 3px 0 var(--google-blue)"
            : "2px 2px 0 var(--shadow-color)",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <div className="truncate flex items-center gap-2 pr-2">
          {selectedParsed ? (
            <>
              <span className="truncate">{selectedParsed.main}</span>
              {selectedParsed.badge && (
                <span
                  className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--ink-secondary)",
                  }}
                >
                  {selectedParsed.badge}
                </span>
              )}
            </>
          ) : (
            <span className="text-[var(--ink-muted)]">{placeholder}</span>
          )}
        </div>

        <div
          className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ml-2 transition-colors"
          style={{
            backgroundColor: open ? "var(--google-blue)" : "var(--surface)",
            borderColor: open ? "var(--google-blue)" : "var(--border)",
            color: open ? "#ffffff" : "var(--ink-secondary)",
          }}
        >
          <Icon
            name="chevron-down"
            size={13}
            className={`transition-transform duration-200 ${
              open ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border-2 p-1.5 space-y-1 overflow-hidden"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "4px 4px 0 var(--shadow-color)",
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            const parsed = parseLabel(opt.label);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer"
                style={{
                  backgroundColor: isSelected
                    ? "var(--google-blue-bg)"
                    : "transparent",
                  color: isSelected ? "var(--google-blue-text)" : "var(--ink)",
                  borderLeft: isSelected
                    ? "3px solid var(--google-blue)"
                    : "3px solid transparent",
                }}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="truncate">{parsed.main}</span>
                  {parsed.badge && (
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0"
                      style={{
                        backgroundColor: isSelected
                          ? "var(--google-blue)"
                          : "var(--surface-alt)",
                        borderColor: isSelected
                          ? "var(--google-blue)"
                          : "var(--border)",
                        color: isSelected ? "#ffffff" : "var(--ink-secondary)",
                      }}
                    >
                      {parsed.badge}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Icon
                    name="check"
                    size={15}
                    style={{ color: "var(--google-blue)" }}
                    className="shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
export function Section({
  id,
  children,
  className = "",
  style = {},
  noPadding = false,
}) {
  return (
    <section
      id={id}
      className={`${noPadding ? "" : "py-10 sm:py-14 lg:py-16"} border-b-2 ${className}`}
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

// Neo-brutalist pagination with page numbers and item count summary
export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 6,
  onPageChange,
  className = "",
  itemLabel = "item",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  // Calculate visible page buttons with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-6 border-t-2 ${className}`}
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="text-xs font-mono font-medium"
        style={{ color: "var(--ink-secondary)" }}
      >
        Menampilkan{" "}
        <span className="font-bold font-mono" style={{ color: "var(--ink)" }}>
          {startIdx}-{endIdx}
        </span>{" "}
        dari{" "}
        <span className="font-bold font-mono" style={{ color: "var(--ink)" }}>
          {totalItems}
        </span>{" "}
        {itemLabel}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="h-9 px-3 rounded-xl border-2 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-[2px_2px_0_var(--shadow-color)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <Icon name="chevron-left" size={15} />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 inline-flex items-center justify-center font-mono text-xs font-bold"
                style={{ color: "var(--ink-muted)" }}
              >
                ...
              </span>
            );
          }
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Halaman ${p}`}
              aria-current={isActive ? "page" : undefined}
              className="w-9 h-9 rounded-xl border-2 font-mono font-extrabold text-xs inline-flex items-center justify-center transition-all cursor-pointer shadow-[2px_2px_0_var(--shadow-color)] active:translate-x-0.5 active:translate-y-0.5"
              style={{
                backgroundColor: isActive
                  ? "var(--google-blue)"
                  : "var(--surface)",
                borderColor: "var(--border)",
                color: isActive ? "#ffffff" : "var(--ink)",
              }}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className="h-9 px-3 rounded-xl border-2 font-bold text-xs inline-flex items-center gap-1 transition-all shadow-[2px_2px_0_var(--shadow-color)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <Icon name="chevron-right" size={15} />
        </button>
      </div>
    </div>
  );
}

// Floating toast notification descending from top with auto-dismiss
export function FloatingAlert({ feedback, onClose, duration = 3500 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!feedback) return;

    const animId = requestAnimationFrame(() => {
      setVisible(true);
    });

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [feedback, duration, onClose]);

  if (!feedback) return null;

  const isSuccess = feedback.type === "success";
  const isError = feedback.type === "error";

  const accentColor = isSuccess
    ? "var(--google-green)"
    : isError
    ? "var(--google-red)"
    : "var(--google-blue)";

  const accentBg = isSuccess
    ? "var(--google-green-bg)"
    : isError
    ? "var(--google-red-bg)"
    : "var(--google-blue-bg)";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[9999] max-w-lg w-[calc(100%-2rem)] sm:w-auto px-4 py-3 rounded-xl border-2 flex items-center gap-3 shadow-[4px_4px_0_var(--shadow-color)] transition-all duration-300 ease-out pointer-events-auto ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
      }`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: accentColor,
        color: "var(--ink)",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0"
        style={{
          backgroundColor: accentBg,
          borderColor: accentColor,
          color: accentColor,
        }}
      >
        <Icon
          name={isSuccess ? "check" : isError ? "alert" : "info"}
          size={16}
        />
      </div>

      <span className="text-xs sm:text-sm font-bold pr-2 leading-tight">
        {feedback.text}
      </span>

      {onClose && (
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setTimeout(() => onClose(), 200);
          }}
          aria-label="Tutup notifikasi"
          className="p-1 rounded-md text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-alt)] transition-colors ml-auto shrink-0 cursor-pointer"
        >
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}

// Image lightbox modal with zoom and optional edit action
export function ImageLightboxModal({
  isOpen,
  imageUrl,
  title = "Pratinjau Foto",
  subtitle,
  alt = "Pratinjau Foto",
  onClose,
  onEdit,
  onUpload,
}) {
  const { language } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(1);

  const displayTitle = language === "en" ? translateText(title, "en") : title;
  const displaySubtitle =
    language === "en" && subtitle ? translateText(subtitle, "en") : subtitle;

  const handleClose = () => {
    setZoomLevel(1);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setZoomLevel(1);
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev > 1 ? 1 : 1.75));
  };

  const zoomTooltip =
    zoomLevel > 1
      ? language === "en"
        ? "Zoom out (100%)"
        : "Perkecil (100%)"
      : language === "en"
        ? "Zoom in (175%)"
        : "Perbesar (175%)";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={displayTitle}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
      }}
      onClick={handleClose}
    >
      <div
        className="neo-card-flat relative w-full max-w-3xl max-h-[92vh] flex flex-col p-4 sm:p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "6px 6px 0 var(--shadow-color)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Google accent bar */}
        <div className="google-bar -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4" />

        {/* Modal Header */}
        <div
          className="flex items-center justify-between gap-3 pb-3 mb-3 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <h3
              className="text-base sm:text-lg font-extrabold truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {displayTitle}
            </h3>
            {displaySubtitle && (
              <p className="text-xs font-mono font-medium text-[var(--ink-secondary)]">
                {displaySubtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleZoom}
              title={zoomTooltip}
              className="p-1.5 rounded-lg border-2 hover:bg-[var(--surface-alt)] cursor-pointer text-[var(--ink)]"
              style={{ borderColor: "var(--border)" }}
            >
              <Icon name={zoomLevel > 1 ? "zoom-out" : "zoom-in"} size={16} />
            </button>
            <button
              type="button"
              onClick={handleClose}
              aria-label={
                language === "en"
                  ? "Close preview window"
                  : "Tutup jendela pratinjau"
              }
              className="p-1.5 rounded-lg border-2 hover:bg-[var(--surface-alt)] cursor-pointer text-[var(--ink)]"
              style={{ borderColor: "var(--border)" }}
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Image display area with auto zoom in view */}
        <div
          className="relative flex-1 min-h-[220px] max-h-[62vh] rounded-xl overflow-auto border-2 flex items-center justify-center p-2 select-none"
          style={{
            backgroundColor: "#080c12",
            borderColor: "var(--border)",
          }}
        >
          <img
            src={imageUrl}
            alt={alt}
            onClick={toggleZoom}
            className={`max-w-full max-h-[58vh] object-contain rounded-lg transition-transform duration-200 select-none ${
              zoomLevel > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Footer actions */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-[11px] font-mono text-[var(--ink-secondary)] hidden sm:block">
            {onEdit
              ? language === "en"
                ? "Click 'Adjust Photo' to crop or reframe."
                : "Klik 'Sesuaikan Foto' untuk memotong atau mengatur framing."
              : language === "en"
                ? "Click image to zoom in."
                : "Klik foto untuk memperbesar tampilan."}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onUpload && (
              <button
                type="button"
                onClick={onUpload}
                className="neo-btn-secondary text-xs sm:text-sm font-bold py-1.5 px-3 flex items-center gap-1.5"
              >
                <Icon name="upload" size={14} />
                <span>{language === "en" ? "Upload New" : "Unggah Baru"}</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="neo-btn-primary text-xs sm:text-sm font-bold py-1.5 px-3 flex items-center gap-1.5"
              >
                <Icon name="crop" size={14} />
                <span>
                  {language === "en"
                    ? "Adjust / Edit Photo"
                    : "Sesuaikan / Edit Foto"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="neo-btn-secondary text-xs sm:text-sm font-bold py-1.5 px-3"
            >
              {language === "en" ? "Close" : "Tutup"}
            </button>
          </div>
        </div>
      </div>
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

  const { t, language } = useLanguage();
  const targetProject = useMemo(
    () => (project ? translateProject(project, language) : null),
    [project, language]
  );
  if (!targetProject) return null;
  const cs = targetProject.caseStudy;

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
              <Chip variant="blue">{targetProject.label}</Chip>
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
              {targetProject.title}
            </h3>
            {cs?.role && (
              <p
                className="text-sm sm:text-base font-semibold mt-1"
                style={{ color: "var(--google-blue)" }}
              >
                {t("modal_role")} {cs.role} {cs.client ? `| ${t("modal_client")} ${cs.client}` : ""}
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
            aria-label={t("modal_close")}
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
              {t("modal_bg_problem")}
            </h4>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ink-secondary)" }}
            >
              {cs?.background || targetProject.problem}
            </p>
          </div>

          <div>
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--google-blue)" }}
            >
              {t("modal_solution")}
            </h4>
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ink-secondary)" }}
            >
              {cs?.solution || targetProject.solution}
            </p>
          </div>

          <div>
            <h4
              className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider mb-2"
              style={{ color: "var(--google-yellow)" }}
            >
              {t("modal_arch_tech")}
            </h4>
            {Array.isArray(cs?.architecture) ? (
              <ul
                className="space-y-1.5 mb-3 text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                {cs.architecture.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 shrink-0"
                      style={{ color: "var(--google-yellow)" }}
                    >
                      <Icon name="chevron-right" size={14} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--ink-secondary)" }}
              >
                {cs?.architecture || t("modal_arch_default")}
              </p>
            )}
            <Cluster gap={8}>
              {targetProject.badges.map((b) => (
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
              {t("modal_impact")}
            </h4>
            <p
              className="text-base sm:text-lg font-bold"
              style={{ color: "var(--google-green-text)" }}
            >
              {cs?.impact || targetProject.impact}
            </p>
          </div>

          <div
            className="p-4 rounded-xl border-2 text-xs sm:text-sm"
            style={{
              backgroundColor: "var(--canvas)",
              borderColor: "var(--border)",
            }}
          >
            <span className="font-bold">{t("modal_repo_status")} </span>
            <span style={{ color: "var(--ink-secondary)" }}>
              {targetProject.repoReason || targetProject.repoNotice}
            </span>
          </div>

          <Cluster gap={12} className="justify-end pt-4 border-t-2" style={{ borderColor: "var(--border)" }}>
            {targetProject.demoUrl && (
              <a
                href={targetProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-primary text-sm sm:text-base font-bold"
              >
                {t("modal_visit_demo")}
                <Icon name="external-link" size={16} />
              </a>
            )}
            <button
              onClick={onClose}
              className="neo-btn-secondary text-sm sm:text-base font-bold"
            >
              {t("modal_close")}
            </button>
          </Cluster>
        </div>
      </div>
    </div>
  );
}

// Featured hero project card with balanced two-column layout
export function FeaturedHeroCard({ project: rawProject, onOpenCaseStudy }) {
  const { t, language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const project = useMemo(
    () => (rawProject ? translateProject(rawProject, language) : null),
    [rawProject, language]
  );
  if (!project) return null;

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

        <div className="relative w-full aspect-[16/10] overflow-hidden flex-1 group/hero">
          {project.image ? (
            <>
              <img
                src={project.image}
                alt={project.title}
                onClick={() => setLightboxOpen(true)}
                className="absolute inset-0 w-full h-full object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover/hero:scale-105"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                title={
                  language === "en"
                    ? "Enlarge project preview"
                    : "Perbesar gambar proyek"
                }
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-xs cursor-pointer"
              >
                <Icon name="zoom-in" size={16} />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-bold text-base text-gray-500">
              {t("projects_preview")}
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
              {t("featured_badge")}
            </Chip>
          </div>

          <h3
            className="font-extrabold text-2xl sm:text-3xl mb-3 leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {project.title}
          </h3>

          <p
            className="text-base sm:text-lg leading-relaxed mb-6"
            style={{ color: "var(--ink-secondary)" }}
          >
            {project.problem}
          </p>

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
            {t("projects_case_study_full")}
            <Icon name="arrow-right" size={18} />
          </button>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full neo-btn-secondary font-bold text-base text-center"
            >
              {t("projects_live_demo")}
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

      <ImageLightboxModal
        isOpen={lightboxOpen}
        imageUrl={project.image}
        title={project.title}
        subtitle={
          language === "en"
            ? `${project.label} • 16:10 Aspect Ratio • Featured Project`
            : `${project.label} • Rasio 16:10 • Proyek Unggulan`
        }
        alt={project.title}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

// Landscape oriented project card with vertical deck layout
export function ProjectCard({ project, onOpenCaseStudy }) {
  const { t, language } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const targetProject = useMemo(
    () => (project ? translateProject(project, language) : null),
    [project, language]
  );
  if (!targetProject) return null;

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

  const cfg = categoryConfig[targetProject.label] || categoryConfig["Web App"];

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
        <Chip variant={cfg.variant}>{targetProject.label}</Chip>
      </div>

      {/* Landscape media frame (16:10 aspect ratio) */}
      <div
        className="relative w-full aspect-[16/10] overflow-hidden border-b-2 flex-shrink-0 group/cardimg"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--canvas)",
        }}
      >
        {targetProject.image ? (
          <>
            <img
              src={targetProject.image}
              alt={targetProject.title}
              onClick={() => setLightboxOpen(true)}
              className="w-full h-full object-cover object-top cursor-zoom-in transition-transform duration-300 group-hover/cardimg:scale-105"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              title={
                language === "en"
                  ? "Enlarge project preview"
                  : "Perbesar gambar proyek"
              }
              className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover/cardimg:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-xs cursor-pointer"
            >
              <Icon name="zoom-in" size={14} />
            </button>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none"
            style={{ backgroundColor: "var(--surface-alt)" }}
          >
            <div
              className="w-10 h-10 rounded-xl border-2 flex items-center justify-center mb-2 shadow-[2px_2px_0_var(--shadow-color)]"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: cfg.topBorder,
              }}
            >
              <Icon name="code" size={20} />
            </div>
            <span
              className="text-xs font-bold font-mono uppercase tracking-wider"
              style={{ color: "var(--ink)" }}
            >
              {t("projects_preview")}
            </span>
            <span
              className="text-[10px] font-mono mt-0.5"
              style={{ color: "var(--ink-muted)" }}
            >
              {t("projects_input_cms")}
            </span>
          </div>
        )}
      </div>

      {/* Narrative details column */}
      <div className="pt-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-extrabold text-lg sm:text-xl mb-2 leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {targetProject.title}
          </h3>

          <p
            className="text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3"
            style={{ color: "var(--ink-secondary)" }}
          >
            {targetProject.problem}
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-1 mb-4">
            {targetProject.badges.map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded-md border text-[var(--ink)] whitespace-nowrap"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Pinned action buttons */}
        <div
          className="pt-3 border-t-2 mt-auto space-y-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCaseStudy(targetProject)}
              className="flex-1 neo-btn-primary font-bold text-xs sm:text-sm py-2 px-3 justify-center"
            >
              {t("projects_view_case_study")}
              <Icon name="arrow-right" size={14} />
            </button>

            {targetProject.demoUrl && (
              <a
                href={targetProject.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="neo-btn-secondary text-xs font-bold py-2 px-3 text-center"
                aria-label={t("projects_live_demo")}
                title={t("projects_live_demo")}
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
            {targetProject.repoNotice}
          </span>
        </div>
      </div>

      <ImageLightboxModal
        isOpen={lightboxOpen}
        imageUrl={project.image}
        title={targetProject.title}
        subtitle={
          language === "en"
            ? `${targetProject.label} • 16:10 Aspect Ratio`
            : `${targetProject.label} • Rasio 16:10`
        }
        alt={targetProject.title}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

// Clean neo-brutalist continuous timeline spine
export function TimelineSpine() {
  return (
    <>
      {/* Desktop central continuous rail */}
      <div
        className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 z-0 pointer-events-none"
        style={{ backgroundColor: "var(--border)" }}
      />

      {/* Mobile left-aligned continuous rail */}
      <div
        className="md:hidden absolute left-5 sm:left-6 -translate-x-1/2 top-0 bottom-0 w-1 z-0 pointer-events-none"
        style={{ backgroundColor: "var(--border)" }}
      />
    </>
  );
}

// Backward-compatible alias for timeline spine
export const RoadTrack = TimelineSpine;

// Pathway bridge between internship and organization milestones
export function CareerPathwayBridge({
  kicker,
  title,
  description,
}) {
  const { t } = useLanguage();
  const bridgeKicker = kicker || t("exp_bridge_kicker");
  const bridgeTitle = title || t("exp_bridge_title");
  const bridgeDesc = description || t("exp_bridge_desc");

  return (
    <div className="relative my-8 sm:my-12 z-20">
      {/* Continuous spine running behind the bridge */}
      <div className="absolute inset-0 pointer-events-none">
        <TimelineSpine />
      </div>

      {/* Central milestone hub spanning across */}
      <div className="max-w-xl mx-auto px-2 sm:px-0 relative z-10">
        <div
          className="p-4 sm:p-5 rounded-2xl border-2 relative overflow-hidden text-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "3px 3px 0 var(--shadow-color)",
          }}
        >
          {/* Top route milestone pill */}
          <div
            className="inline-flex items-center gap-1.5 mb-2.5 px-3 py-1 rounded-full border-2 text-xs font-mono font-bold"
            style={{
              backgroundColor: "var(--google-blue-bg)",
              borderColor: "var(--google-blue)",
              color: "var(--google-blue-text)",
            }}
          >
            <Icon name="git-branch" size={13} />
            <span>{bridgeKicker}</span>
          </div>

          <h4
            className="text-base sm:text-lg font-extrabold mb-1.5"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {bridgeTitle}
          </h4>

          <p
            className="text-xs sm:text-sm leading-relaxed max-w-lg mx-auto mb-3.5"
            style={{ color: "var(--ink-secondary)" }}
          >
            {bridgeDesc}
          </p>

          {/* Stepper progression flow */}
          <div
            className="pt-3 border-t-2 flex items-center justify-center gap-2 sm:gap-3 text-xs font-mono font-bold flex-wrap"
            style={{ borderColor: "var(--border)" }}
          >
            <span
              className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
                color: "var(--ink-muted)",
              }}
            >
              <Icon name="users" size={13} />
              <span>{t("exp_bridge_campus")}</span>
            </span>

            <Icon
              name="arrow-right"
              size={14}
              style={{ color: "var(--google-blue)" }}
            />

            <span
              className="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--google-blue-bg)",
                borderColor: "var(--google-blue)",
                color: "var(--google-blue-text)",
              }}
            >
              <Icon name="briefcase" size={13} />
              <span>{t("exp_bridge_internship")}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact alternating road milestone card component
export function ExpCard({
  item: rawItem,
  index = 0,
  customIndex,
  isLeft = true,
}) {
  const { t, language } = useLanguage();
  const item = useMemo(
    () => (rawItem ? translateExperience(rawItem, language) : {}),
    [rawItem, language]
  );
  const [photoZoomOpen, setPhotoZoomOpen] = useState(false);
  const numberThemes = [
    { bg: "var(--google-blue)", text: "#ffffff" },
    { bg: "var(--google-green)", text: "#ffffff" },
    { bg: "var(--google-yellow)", text: "#1f1f1f" },
    { bg: "var(--google-red)", text: "#ffffff" },
  ];
  const numColor = numberThemes[index % 4];
  const displayNum =
    typeof customIndex === "number" ? customIndex : index + 1;
  const isMagang =
    item.type === "Magang" ||
    String(item.category || "").toLowerCase().includes("magang") ||
    String(item.role || "").toLowerCase().includes("intern");

  return (
    <div className="relative mb-7 sm:mb-10 last:mb-0">
      {/* Desktop center milestone marker on the spine */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 z-20 items-center justify-center">
        {/* Solid horizontal connector arm to left card */}
        {isLeft && (
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 w-5 lg:w-6 h-0.5"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: numColor.bg }}
            />
          </div>
        )}
        {/* Solid horizontal connector arm to right card */}
        {!isLeft && (
          <div
            className="absolute left-full top-1/2 -translate-y-1/2 w-5 lg:w-6 h-0.5"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: numColor.bg }}
            />
          </div>
        )}
        {/* Embossed milestone badge */}
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center font-extrabold font-mono text-xs sm:text-sm shadow-[2px_2px_0_var(--shadow-color)]"
          style={{ backgroundColor: numColor.bg, color: numColor.text }}
        >
          {String(displayNum).padStart(2, "0")}
        </div>
      </div>

      {/* Mobile left-aligned milestone marker */}
      <div className="md:hidden absolute left-5 sm:left-6 -translate-x-1/2 top-4 z-20 flex items-center justify-center">
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 w-3 sm:w-4 h-0.5"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="w-8 h-8 rounded-xl border-2 border-[var(--border)] flex items-center justify-center font-extrabold font-mono text-xs shadow-[2px_2px_0_var(--shadow-color)]"
          style={{ backgroundColor: numColor.bg, color: numColor.text }}
        >
          {String(displayNum).padStart(2, "0")}
        </div>
      </div>

      {/* Card placement: Alternating left/right on desktop */}
      <div
        className={`w-full md:w-[calc(50%-2.5rem)] ${isLeft ? "md:mr-auto" : "md:ml-auto"
          } pl-12 sm:pl-14 md:pl-0`}
      >
        <div
          className="rounded-2xl border-2 overflow-hidden relative transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            boxShadow: "3px 3px 0 var(--shadow-color)",
          }}
        >
          {/* Top route colored strip */}
          <div
            className="h-1.5 w-full"
            style={{
              backgroundColor: isMagang
                ? "var(--google-blue)"
                : "var(--google-green)",
            }}
          />

          {/* Compact landscape photo banner if present */}
          {item.photo && (
            <div
              className="group/exp w-full aspect-[16/9] max-h-40 sm:max-h-44 relative overflow-hidden border-b-2 cursor-zoom-in"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--canvas)",
              }}
              onClick={() => setPhotoZoomOpen(true)}
              title="Klik untuk memperbesar foto dokumentasi"
            >
              <img
                src={item.photo}
                alt={item.photoAlt || item.role}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover/exp:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover/exp:opacity-100 transition-opacity backdrop-blur-xs pointer-events-none">
                <Icon name="zoom-in" size={13} />
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 pointer-events-none">
                <span className="neo-badge text-[10px] sm:text-[11px] font-bold px-2 py-0.5 bg-white/95 dark:bg-black/85 text-[var(--ink)] border border-[var(--border)] backdrop-blur-sm">
                  {item.type || item.category || t("exp_milestones")}
                </span>
                <span className="neo-badge text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 bg-white/95 dark:bg-black/85 text-[var(--ink)] border border-[var(--border)] backdrop-blur-sm">
                  {item.period}
                </span>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-5">
            {/* Header info if no photo */}
            {!item.photo && (
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <span
                  className="neo-badge text-[10px] sm:text-[11px] font-bold px-2 py-0.5"
                  style={{
                    backgroundColor: isMagang
                      ? "var(--google-blue-bg)"
                      : "var(--google-green-bg)",
                    color: isMagang
                      ? "var(--google-blue-text)"
                      : "var(--google-green-text)",
                    borderColor: isMagang
                      ? "var(--google-blue)"
                      : "var(--google-green)",
                  }}
                >
                  {item.type || item.category || t("exp_milestones")}
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {item.period}
                </span>
              </div>
            )}

            <h3
              className="text-base sm:text-lg font-extrabold mb-1 leading-snug"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink)",
              }}
            >
              {item.role}
            </h3>
            <p
              className="text-xs sm:text-sm font-bold mb-3"
              style={{
                color: isMagang ? "var(--google-blue)" : "var(--google-green)",
              }}
            >
              {item.org}
            </p>

            {item.bullets && item.bullets.length > 0 && (
              <ul
                className="space-y-1.5 mb-3.5 text-xs sm:text-sm leading-relaxed"
                style={{ color: "var(--ink-secondary)" }}
              >
                {item.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 shrink-0"
                      style={{
                        color: isMagang
                          ? "var(--google-blue)"
                          : "var(--google-green)",
                      }}
                    >
                      <Icon name="chevron-right" size={14} />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {item.tags && item.tags.length > 0 && (
              <div
                className="pt-2.5 border-t-2 flex flex-wrap gap-1.5"
                style={{ borderColor: "var(--border)" }}
              >
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                      color: "var(--ink)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {item.photo && (
        <ImageLightboxModal
          isOpen={photoZoomOpen}
          imageUrl={item.photo}
          title={item.role}
          subtitle={`${item.org} • ${item.period} • Rasio 16:9`}
          alt={item.photoAlt || item.role}
          onClose={() => setPhotoZoomOpen(false)}
        />
      )}
    </div>
  );
}

// Sticky header navbar with 1px border and clean wordmark
export function Navbar({ info = {} }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const cvUrl = info?.cvUrl || PERSONAL_INFO.cvUrl;

  const navLinks = [
    { label: t("nav_home"), href: "/#home" },
    { label: t("nav_about"), href: "/#about" },
    { label: t("nav_skills"), href: "/#skills" },
    { label: t("nav_projects"), href: "/projects" },
    { label: t("nav_experience"), href: "/experience" },
    { label: t("nav_contact"), href: "/#contact" },
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
          className="font-extrabold text-xl sm:text-2xl tracking-tight no-underline flex items-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          <span>mraynar</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((item) => {
            const isInternal = item.href.startsWith("/#");
            const isHomeActive =
              item.href === "/#home" &&
              location.pathname === "/" &&
              (!location.hash || location.hash === "#home");
            const isActive = isInternal
              ? isHomeActive ||
                (location.pathname === "/" &&
                  location.hash === item.href.replace("/", ""))
              : location.pathname === item.href;

            return (
              <a
                key={item.href}
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
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language toggle switch (ID / EN) */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isRight = e.clientX - rect.left > rect.width / 2;
                setLanguage(isRight ? "en" : "id");
              }
            }}
            className="inline-flex items-stretch p-0.5 h-[32px] sm:h-[36px] rounded-full border-2 border-[var(--border)] shadow-[2px_2px_0_var(--shadow-color)] box-border shrink-0 cursor-pointer select-none"
            style={{ backgroundColor: "var(--surface-alt)" }}
            role="group"
            aria-label="Pilih Bahasa / Select Language"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage("id");
              }}
              className={`flex-1 min-w-[34px] sm:min-w-[40px] px-2 flex items-center justify-center rounded-full text-xs font-mono font-extrabold transition-all cursor-pointer ${
                language === "id"
                  ? "bg-[var(--google-blue)] text-white shadow-[1px_1px_0_var(--shadow-color)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              }`}
              title="Bahasa Indonesia"
              aria-pressed={language === "id"}
            >
              ID
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLanguage("en");
              }}
              className={`flex-1 min-w-[34px] sm:min-w-[40px] px-2 flex items-center justify-center rounded-full text-xs font-mono font-extrabold transition-all cursor-pointer ${
                language === "en"
                  ? "bg-[var(--google-blue)] text-white shadow-[1px_1px_0_var(--shadow-color)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
              }`}
              title="English"
              aria-pressed={language === "en"}
            >
              EN
            </button>
          </div>

          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center font-bold font-mono h-[30px] sm:h-[34px] px-2.5 sm:px-3 text-[11px] sm:text-xs gap-1 sm:gap-1.5 rounded-full border-2 border-[var(--border)] shadow-[2px_2px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer text-white shrink-0"
            style={{
              backgroundColor: "var(--google-blue)",
            }}
          >
            <Icon name="download" size={13} />
            <span>{t("download_cv")}</span>
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex items-center justify-center w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full border-2 border-[var(--border)] bg-[var(--surface)] shadow-[2px_2px_0_var(--shadow-color)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer shrink-0"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} size={16} />
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
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-lg font-bold py-1 no-underline"
              style={{ color: "var(--ink)" }}
            >
              {item.label}
            </a>
          ))}
          <div
            className="pt-4 border-t-2 space-y-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--ink-secondary)]">
                Bahasa / Language:
              </span>
              <div
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const isRight = e.clientX - rect.left > rect.width / 2;
                    setLanguage(isRight ? "en" : "id");
                  }
                }}
                className="inline-flex items-stretch p-0.5 h-[36px] rounded-full border-2 border-[var(--border)] shadow-[2px_2px_0_var(--shadow-color)] box-border cursor-pointer select-none"
                style={{ backgroundColor: "var(--surface-alt)" }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("id");
                  }}
                  className={`flex-1 min-w-[42px] px-3 flex items-center justify-center rounded-full text-xs font-mono font-extrabold transition-all cursor-pointer ${
                    language === "id"
                      ? "bg-[var(--google-blue)] text-white shadow-[1px_1px_0_var(--shadow-color)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
                  }`}
                  aria-pressed={language === "id"}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLanguage("en");
                  }}
                  className={`flex-1 min-w-[42px] px-3 flex items-center justify-center rounded-full text-xs font-mono font-extrabold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-[var(--google-blue)] text-white shadow-[1px_1px_0_var(--shadow-color)]"
                      : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface)]"
                  }`}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
              </div>
            </div>

            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full neo-btn-primary text-center font-bold block"
            >
              <Icon name="download" size={16} className="mr-1.5" />
              {t("download_cv")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// Footer with contact links
export function Footer({ info = {} }) {
  const { t } = useLanguage();
  const name = info?.name || PERSONAL_INFO.name;
  const github = info?.github || PERSONAL_INFO.github;
  const linkedin = info?.linkedin || PERSONAL_INFO.linkedin;
  const instagram =
    info?.instagram ||
    PERSONAL_INFO.instagram ||
    "https://instagram.com/mraynarr";
  const email = info?.email || PERSONAL_INFO.email;

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
              {name}
            </div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--ink-muted)" }}
            >
              {t("hero_terminal_role")}
            </p>
          </div>

          <Cluster gap={8} className="justify-center">
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

        <div
          className="mt-8 pt-6 border-t-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-semibold"
          style={{ borderColor: "var(--border)", color: "var(--ink-muted)" }}
        >
          <div>
            Copyright (c) {new Date().getFullYear()} Muhammad Raynar Hammam. {t("footer_rights")}
          </div>
          <div>{t("footer_system")}</div>
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
