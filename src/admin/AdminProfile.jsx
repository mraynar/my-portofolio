import { useState, useRef } from "react";
import { Card, Icon, FloatingAlert, ImageLightboxModal } from "../components";
import ImageCropModal from "./ImageCropModal";
import { saveSiteSettings, uploadStorageFile } from "../lib/supabase";

// Profile and site settings management
export default function AdminProfile({
  initialInfo,
  onUpdateInfo,
  onSaveComplete,
}) {
  const [formData, setFormData] = useState({ ...initialInfo });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [cropAvatarFile, setCropAvatarFile] = useState(null);
  const [previewAvatarOpen, setPreviewAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const avatarInputRef = useRef(null);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropAvatarFile(file);
    e.target.value = "";
  };

  const handleAvatarCropConfirm = async (croppedFile, previewUrl) => {
    setCropAvatarFile(null);
    setUploadingAvatar(true);
    setFeedback(null);
    try {
      const fileName = `avatar-${Date.now()}-${(croppedFile?.name || "avatar.jpg").replace(/\s+/g, "-")}`;
      const url = await uploadStorageFile("media", fileName, croppedFile);
      const effectiveUrl = url || previewUrl;
      setFormData((prev) => ({ ...prev, avatar: effectiveUrl }));

      // Auto-save site settings so the new avatar is immediately persisted
      const saved = await saveSiteSettings(
        formData.rawId || "default-site-settings",
        { ...formData, avatar: effectiveUrl }
      );
      if (onUpdateInfo) {
        onUpdateInfo(saved || { ...formData, avatar: effectiveUrl });
      }
      setFeedback({
        type: "success",
        text: "Foto profil berhasil disesuaikan dan otomatis disimpan.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Gagal menyimpan foto profil.",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    setFeedback(null);
    try {
      const fileName = `cv-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const url = await uploadStorageFile("documents", fileName, file);
      handleChange("cvUrl", url);
      setFeedback({
        type: "success",
        text: "File CV berhasil diunggah ke storage.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal mengunggah file CV.",
      });
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const saved = await saveSiteSettings(
        formData.rawId || "default-site-settings",
        formData
      );
      onUpdateInfo(saved || formData);
      setFeedback({
        type: "success",
        text: "Pengaturan profil dan tautan berhasil disimpan.",
      });
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan perubahan ke database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* 3 tabs for profile sections */}
      <div
        className="flex flex-wrap gap-2 pb-2 border-b-2"
        style={{ borderColor: "var(--border)" }}
      >
        {[
          { key: "hero", label: "Identitas & Hero", icon: "user" },
          { key: "narrative", label: "Narasi & Prinsip", icon: "file" },
          { key: "stats", label: "Kartu Statistik", icon: "sparkles" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-[2px_2px_0_var(--shadow-color)]"
            style={{
              backgroundColor:
                activeTab === tab.key ? "var(--ink)" : "var(--surface)",
              color:
                activeTab === tab.key ? "var(--canvas)" : "var(--ink)",
              borderColor: "var(--border)",
            }}
          >
            <Icon name={tab.icon} size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Hero Identity and Social links */}
      {activeTab === "hero" && (
        <div className="space-y-8">
          <Card className="p-6 sm:p-8 space-y-6">
        <h3
          className="text-lg sm:text-xl font-extrabold pb-3 border-b-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Identitas & Informasi Hero
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Peran / Profesi Singkat
            </label>
            <input
              type="text"
              value={formData.role || ""}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="Mahasiswa Sistem Informasi & Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Tagline Kicker
            </label>
            <input
              type="text"
              value={formData.kicker || ""}
              onChange={(e) => handleChange("kicker", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Badge Kampus
            </label>
            <input
              type="text"
              value={formData.statusBadge || ""}
              onChange={(e) => handleChange("statusBadge", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Headline Utama
            </label>
            <input
              type="text"
              value={formData.headline || ""}
              onChange={(e) => handleChange("headline", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Aksen Warna Headline
            </label>
            <input
              type="text"
              value={formData.headlineAccent || ""}
              onChange={(e) => handleChange("headlineAccent", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Judul Tab Kode (Card Kanan)
            </label>
            <input
              type="text"
              value={formData.codeCardTitle || ""}
              onChange={(e) => handleChange("codeCardTitle", e.target.value)}
              placeholder="raynar-dev.ts"
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
            Nilai Proposisi (Hero Description)
          </label>
          <textarea
            rows={2}
            value={formData.valueProp || ""}
            onChange={(e) => handleChange("valueProp", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Universitas
            </label>
            <input
              type="text"
              value={formData.university || ""}
              onChange={(e) => handleChange("university", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Lokasi
            </label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Zona Waktu
            </label>
            <input
              type="text"
              value={formData.timezone || ""}
              onChange={(e) => handleChange("timezone", e.target.value)}
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
            Status Ketersediaan (Contact Badge)
          </label>
          <input
            type="text"
            value={formData.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          />
        </div>
      </Card>

      {/* Social links and documents */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3
          className="text-lg sm:text-xl font-extrabold pb-3 border-b-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tautan Sosial & Dokumen
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Instagram URL
            </label>
            <input
              type="url"
              value={formData.instagram || ""}
              onChange={(e) => handleChange("instagram", e.target.value)}
              placeholder="https://instagram.com/mraynarr"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Email Utama
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        </div>

        {/* Media upload section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              URL Foto Profil
            </label>
            <div className="flex items-center gap-3">
              {formData.avatar ? (
                <button
                  type="button"
                  onClick={() => setPreviewAvatarOpen(true)}
                  title="Klik untuk memperbesar dan mengedit foto profil"
                  className="group relative w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                    boxShadow: "2px 2px 0 var(--shadow-color)",
                  }}
                >
                  <img
                    src={formData.avatar}
                    alt="Pratinjau Avatar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Icon name="zoom-in" size={18} />
                  </div>
                </button>
              ) : (
                <div
                  className="w-16 h-16 rounded-xl border-2 border-dashed shrink-0 flex items-center justify-center text-[var(--ink-secondary)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                >
                  <Icon name="user" size={20} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={formData.avatar || ""}
                  onChange={(e) => handleChange("avatar", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-1.5 px-3">
                <Icon name="upload" size={14} />
                {uploadingAvatar ? "Mengunggah..." : "Unggah Foto Baru"}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
              {formData.avatar && (
                <button
                  type="button"
                  onClick={() => setCropAvatarFile(formData.avatar)}
                  className="neo-btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Icon name="crop" size={14} />
                  <span>Sesuaikan Foto</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              URL Dokumen CV (PDF)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cvUrl || ""}
                onChange={(e) => handleChange("cvUrl", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-1.5 px-3">
                <Icon name="upload" size={14} />
                {uploadingCv ? "Mengunggah..." : "Unggah File PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCvUpload}
                  disabled={uploadingCv}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </Card>
        </div>
      )}

      {/* Tab 2: Narrative and Engineering Principles */}
      {activeTab === "narrative" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <h3
            className="text-lg sm:text-xl font-extrabold pb-3 border-b-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Narasi Tentang Saya & Prinsip Rekayasa
          </h3>

          {/* Section heading customizer for About section */}
          <div
            className="p-4 rounded-xl border-2 space-y-4"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <Icon
                name="sliders"
                size={16}
                style={{ color: "var(--google-blue)" }}
              />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                Header Section Tentang Saya
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Kicker / Tag Section
                </label>
                <input
                  type="text"
                  value={formData.aboutKicker ?? "TENTANG SAYA"}
                  onChange={(e) => handleChange("aboutKicker", e.target.value)}
                  placeholder="TENTANG SAYA"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface)",
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
                  value={formData.aboutTitle ?? "Tentang"}
                  onChange={(e) => handleChange("aboutTitle", e.target.value)}
                  placeholder="Tentang"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Aksen Judul (Biru)
                </label>
                <input
                  type="text"
                  value={formData.aboutTitleAccent ?? "Saya"}
                  onChange={(e) =>
                    handleChange("aboutTitleAccent", e.target.value)
                  }
                  placeholder="Saya"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Keterangan Tambahan / Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.aboutSubtitle ?? ""}
                onChange={(e) => handleChange("aboutSubtitle", e.target.value)}
                placeholder="Latar belakang akademik, rekayasa perangkat lunak..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

        <div>
          <label className="block text-xs font-bold font-mono uppercase mb-1.5">
            Paragraf 1 (Latar Belakang Akademik)
          </label>
          <textarea
            rows={3}
            value={formData.aboutP1 || ""}
            onChange={(e) => handleChange("aboutP1", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono uppercase mb-1.5">
            Paragraf 2 (Fondasi Kejuruan)
          </label>
          <textarea
            rows={3}
            value={formData.aboutP2 || ""}
            onChange={(e) => handleChange("aboutP2", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold font-mono uppercase mb-1.5">
            Paragraf 3 (Fokus Rekayasa Bisnis)
          </label>
          <textarea
            rows={3}
            value={formData.aboutP3 || ""}
            onChange={(e) => handleChange("aboutP3", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        <div className="pt-4 border-t-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Judul Prinsip Rekayasa
            </label>
            <input
              type="text"
              value={formData.principleTitle || ""}
              onChange={(e) => handleChange("principleTitle", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Kutipan Prinsip Rekayasa (Quote)
            </label>
            <input
              type="text"
              value={formData.principleQuote || ""}
              onChange={(e) => handleChange("principleQuote", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        </div>
      </Card>
      )}

      {/* Tab 3: Metrics & Numbers */}
      {activeTab === "stats" && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="pb-3 border-b-2">
            <h3
              className="text-lg sm:text-xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Kustomisasi Kartu Statistik (By The Numbers)
            </h3>
            <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
              Kelola judul section dan keseluruhan konten 4 kartu capaian.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b-2">
            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Kicker Section
              </label>
              <input
                type="text"
                value={formData.numbersKicker ?? "BY THE NUMBERS"}
                onChange={(e) => handleChange("numbersKicker", e.target.value)}
                placeholder="BY THE NUMBERS"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Judul Utama Section
              </label>
              <input
                type="text"
                value={formData.numbersTitle ?? "Dampak & Pencapaian Riil"}
                onChange={(e) => handleChange("numbersTitle", e.target.value)}
                placeholder="Dampak & Pencapaian Riil"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Blue */}
            <div
              className="p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4"
              style={{
                borderColor: "var(--google-blue)",
                backgroundColor: "var(--surface-alt)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b-2">
                <span
                  className="text-xs font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--google-blue)",
                    color: "#fff",
                  }}
                >
                  Kartu 1 • Biru (Proyek)
                </span>
                <span
                  className="text-base font-extrabold font-mono"
                  style={{ color: "var(--google-blue)" }}
                >
                  [{formData.stat1Value || formData.customProjectCount || "20+"}]
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Nilai Angka
                  </label>
                  <input
                    type="text"
                    value={formData.stat1Value ?? formData.customProjectCount ?? ""}
                    onChange={(e) => {
                      handleChange("stat1Value", e.target.value);
                      handleChange("customProjectCount", e.target.value);
                    }}
                    placeholder="20+"
                    className="w-full px-3 py-2 rounded-xl border-2 font-mono font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Label / Judul Kartu
                  </label>
                  <input
                    type="text"
                    value={formData.stat1Label ?? ""}
                    onChange={(e) => handleChange("stat1Label", e.target.value)}
                    placeholder="PROYEK DIGITAL"
                    className="w-full px-3 py-2 rounded-xl border-2 font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.stat1Desc ?? ""}
                    onChange={(e) => handleChange("stat1Desc", e.target.value)}
                    placeholder="Aplikasi web full-stack, mobile lintas platform, dan sistem informasi bisnis operasional."
                    className="w-full px-3 py-2 rounded-xl border-2 font-medium text-xs resize-y"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Green */}
            <div
              className="p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4"
              style={{
                borderColor: "var(--google-green)",
                backgroundColor: "var(--surface-alt)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b-2">
                <span
                  className="text-xs font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--google-green)",
                    color: "#fff",
                  }}
                >
                  Kartu 2 • Hijau (Sertifikasi)
                </span>
                <span
                  className="text-base font-extrabold font-mono"
                  style={{ color: "var(--google-green)" }}
                >
                  [{formData.stat2Value || formData.customCertCount || "15+"}]
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Nilai Angka
                  </label>
                  <input
                    type="text"
                    value={formData.stat2Value ?? formData.customCertCount ?? ""}
                    onChange={(e) => {
                      handleChange("stat2Value", e.target.value);
                      handleChange("customCertCount", e.target.value);
                    }}
                    placeholder="15+"
                    className="w-full px-3 py-2 rounded-xl border-2 font-mono font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Label / Judul Kartu
                  </label>
                  <input
                    type="text"
                    value={formData.stat2Label ?? ""}
                    onChange={(e) => handleChange("stat2Label", e.target.value)}
                    placeholder="SERTIFIKASI RESMI"
                    className="w-full px-3 py-2 rounded-xl border-2 font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.stat2Desc ?? ""}
                    onChange={(e) => handleChange("stat2Desc", e.target.value)}
                    placeholder="Kompetensi terverifikasi dari IBM, Dicoding, DQLab, Udemy & AWS."
                    className="w-full px-3 py-2 rounded-xl border-2 font-medium text-xs resize-y"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Yellow */}
            <div
              className="p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4"
              style={{
                borderColor: "var(--google-yellow-hover)",
                backgroundColor: "var(--surface-alt)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b-2">
                <span
                  className="text-xs font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--google-yellow-hover)",
                    color: "#fff",
                  }}
                >
                  Kartu 3 • Kuning (Tahun / Pengalaman)
                </span>
                <span
                  className="text-base font-extrabold font-mono"
                  style={{ color: "var(--google-yellow-hover)" }}
                >
                  [{formData.stat3Value || formData.startYear || "2021"}]
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Nilai Angka / Tahun
                  </label>
                  <input
                    type="text"
                    value={formData.stat3Value ?? formData.startYear ?? ""}
                    onChange={(e) => {
                      handleChange("stat3Value", e.target.value);
                      handleChange("startYear", e.target.value);
                    }}
                    placeholder="2021"
                    className="w-full px-3 py-2 rounded-xl border-2 font-mono font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Label / Judul Kartu
                  </label>
                  <input
                    type="text"
                    value={formData.stat3Label ?? ""}
                    onChange={(e) => handleChange("stat3Label", e.target.value)}
                    placeholder="REKAYASA SOFTWARE"
                    className="w-full px-3 py-2 rounded-xl border-2 font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.stat3Desc ?? ""}
                    onChange={(e) => handleChange("stat3Desc", e.target.value)}
                    placeholder="Fondasi pemrograman terstruktur dimulai dari bangku SMK RPL hingga S1 Sistem Informasi."
                    className="w-full px-3 py-2 rounded-xl border-2 font-medium text-xs resize-y"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Red */}
            <div
              className="p-5 rounded-2xl border-2 flex flex-col justify-between space-y-4"
              style={{
                borderColor: "var(--google-red)",
                backgroundColor: "var(--surface-alt)",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b-2">
                <span
                  className="text-xs font-black font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--google-red)",
                    color: "#fff",
                  }}
                >
                  Kartu 4 • Merah (Kualitas / Integritas)
                </span>
                <span
                  className="text-base font-extrabold font-mono"
                  style={{ color: "var(--google-red)" }}
                >
                  [{formData.stat4Value || formData.codeQuality || "100%"}]
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Nilai Angka / Persentase
                  </label>
                  <input
                    type="text"
                    value={formData.stat4Value ?? formData.codeQuality ?? ""}
                    onChange={(e) => {
                      handleChange("stat4Value", e.target.value);
                      handleChange("codeQuality", e.target.value);
                    }}
                    placeholder="100%"
                    className="w-full px-3 py-2 rounded-xl border-2 font-mono font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Label / Judul Kartu
                  </label>
                  <input
                    type="text"
                    value={formData.stat4Label ?? ""}
                    onChange={(e) => handleChange("stat4Label", e.target.value)}
                    placeholder="INTEGRITAS SOLUSI"
                    className="w-full px-3 py-2 rounded-xl border-2 font-bold text-sm"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.stat4Desc ?? ""}
                    onChange={(e) => handleChange("stat4Desc", e.target.value)}
                    placeholder="Komitmen arsitektur bersih, performa terukur, dan dokumentasi yang transparan."
                    className="w-full px-3 py-2 rounded-xl border-2 font-medium text-xs resize-y"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="neo-btn-primary font-bold text-base px-6 py-3"
        >
          {isSaving ? "Menyimpan Data..." : "Simpan Perubahan"}
          <Icon name="check" size={18} />
        </button>
      </div>

      <ImageLightboxModal
        isOpen={previewAvatarOpen}
        imageUrl={formData.avatar}
        title="Foto Profil Hero"
        subtitle="Rasio 4:5 • Frame Profil Hero Halaman Utama"
        alt="Foto Profil Muhammad Raynar"
        onClose={() => setPreviewAvatarOpen(false)}
        onEdit={() => {
          setPreviewAvatarOpen(false);
          setCropAvatarFile(formData.avatar);
        }}
        onUpload={() => {
          setPreviewAvatarOpen(false);
          avatarInputRef.current?.click();
        }}
      />

      {cropAvatarFile && (
        <ImageCropModal
          file={cropAvatarFile}
          aspectRatio={4 / 5}
          title="Sesuaikan Foto Profil Hero"
          description="Rasio 4:5 sesuai persis dengan frame kartu profil hero pada halaman utama."
          onConfirm={handleAvatarCropConfirm}
          onCancel={() => setCropAvatarFile(null)}
        />
      )}
    </form>
  );
}
