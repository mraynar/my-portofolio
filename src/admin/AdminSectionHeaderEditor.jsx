import { useState } from "react";
import { Card, Chip, Icon, FloatingAlert } from "../components";
import { saveSiteSettings } from "../lib/supabase";

// Reusable section heading customizer for admin panels
export default function AdminSectionHeaderEditor({
  sectionKey,
  sectionName,
  fields,
  defaultValues,
  info,
  onUpdateInfo,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentKicker = info?.[fields.kicker] ?? defaultValues.kicker ?? "";
  const currentTitle = info?.[fields.title] ?? defaultValues.title ?? "";
  const currentTitleAccent =
    info?.[fields.titleAccent] ?? defaultValues.titleAccent ?? "";
  const currentSubtitle =
    info?.[fields.subtitle] ?? defaultValues.subtitle ?? "";

  const [draft, setDraft] = useState(null);

  const kicker = draft?.kicker ?? currentKicker;
  const title = draft?.title ?? currentTitle;
  const titleAccent = draft?.titleAccent ?? currentTitleAccent;
  const subtitle = draft?.subtitle ?? currentSubtitle;

  const handleChange = (key, value) => {
    setDraft((prev) => ({
      kicker: prev?.kicker ?? currentKicker,
      title: prev?.title ?? currentTitle,
      titleAccent: prev?.titleAccent ?? currentTitleAccent,
      subtitle: prev?.subtitle ?? currentSubtitle,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const payload = {
        [fields.kicker]: kicker.trim(),
        [fields.title]: title.trim(),
        [fields.titleAccent]: titleAccent.trim(),
        [fields.subtitle]: subtitle.trim(),
      };
      const updated = await saveSiteSettings(info?.rawId, payload);
      setDraft(null);
      if (onUpdateInfo) {
        onUpdateInfo(updated);
      }
      setFeedback({
        type: "success",
        text: `Header section "${sectionName}" berhasil diperbarui.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan perubahan header section.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDraft({
      kicker: defaultValues.kicker || "",
      title: defaultValues.title || "",
      titleAccent: defaultValues.titleAccent || "",
      subtitle: defaultValues.subtitle || "",
    });
  };

  return (
    <Card
      id={`header-editor-${sectionKey}`}
      className="p-4 sm:p-6 mb-6 border-2 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "var(--google-blue-bg)",
              borderColor: "var(--google-blue)",
              color: "var(--google-blue)",
            }}
          >
            <Icon name="sliders" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-base sm:text-lg font-extrabold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Header & Keterangan Section
              </h3>
              <Chip variant="blue" className="text-[10px] py-0.5 px-2">
                {sectionName}
              </Chip>
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--ink-secondary)" }}
            >
              Atur judul, aksen teks, tag kicker, dan keterangan tambahan.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="neo-btn-secondary text-xs font-bold py-1.5 px-3 self-start sm:self-auto inline-flex items-center gap-1.5"
        >
          <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={14} />
          <span>{isOpen ? "Tutup Editor" : "Kustomisasi Header"}</span>
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSave} className="mt-5 pt-5 border-t-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Kicker / Tag Kategori
              </label>
              <input
                type="text"
                value={kicker}
                onChange={(e) => handleChange("kicker", e.target.value)}
                placeholder={defaultValues.kicker}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Judul Utama
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder={defaultValues.title}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Aksen Judul (Warna Biru)
              </label>
              <input
                type="text"
                value={titleAccent}
                onChange={(e) => handleChange("titleAccent", e.target.value)}
                placeholder={defaultValues.titleAccent}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Keterangan Tambahan / Deskripsi Subtitle
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder={defaultValues.subtitle}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          {/* Real-time visual preview matching public typography */}
          <div
            className="p-4 rounded-xl border-2"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          >
            <div className="text-[11px] font-mono font-bold uppercase mb-2 text-[var(--ink-muted)]">
              Pratinjau Tampilan Web Langsung:
            </div>
            <div className="mb-2">
              <span className="neo-badge text-[11px] font-bold px-2.5 py-0.5">
                {kicker || defaultValues.kicker}
              </span>
            </div>
            <h4
              className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title || defaultValues.title}{" "}
              <span style={{ color: "var(--google-blue)" }}>
                {titleAccent || defaultValues.titleAccent}
              </span>
            </h4>
            <p
              className="text-xs sm:text-sm font-medium leading-relaxed max-w-2xl"
              style={{ color: "var(--ink-secondary)" }}
            >
              {subtitle || defaultValues.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-mono font-bold text-[var(--ink-muted)] hover:text-[var(--ink)] underline"
            >
              Reset ke Teks Bawaan
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="neo-btn-primary text-xs font-bold py-2.5 px-5 inline-flex items-center gap-2"
            >
              <Icon name="check" size={14} />
              <span>
                {isSaving ? "Menyimpan Header..." : "Simpan Header Section"}
              </span>
            </button>
          </div>
        </form>
      )}

      {feedback && (
        <FloatingAlert
          type={feedback.type}
          message={feedback.text}
          onClose={() => setFeedback(null)}
        />
      )}
    </Card>
  );
}
