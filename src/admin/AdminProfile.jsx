import { useState } from "react";
import { Card, Icon } from "../components";
import { saveSiteSettings, uploadStorageFile } from "../lib/supabase";

// Profile and site settings management
export default function AdminProfile({ initialInfo, onUpdateInfo }) {
  const [formData, setFormData] = useState({ ...initialInfo });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setFeedback(null);
    try {
      const fileName = `avatar-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const url = await uploadStorageFile("media", fileName, file);
      handleChange("avatar", url);
      setFeedback({
        type: "success",
        text: "Foto profil berhasil diunggah ke storage.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal mengunggah foto profil.",
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
      {feedback && (
        <div
          className="p-4 rounded-xl border-2 text-sm font-bold flex items-center gap-2"
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

      {/* Identity and narrative */}
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
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.avatar || ""}
                onChange={(e) => handleChange("avatar", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-1.5 px-3">
                <Icon name="upload" size={14} />
                {uploadingAvatar ? "Mengunggah..." : "Unggah Foto Baru"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
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
            <div className="mt-2 flex items-center gap-2">
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

      {/* About and engineering principles */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3
          className="text-lg sm:text-xl font-extrabold pb-3 border-b-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Narasi Tentang Saya & Prinsip Rekayasa
        </h3>

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

      {/* Real impact metrics customization */}
      <Card className="p-6 sm:p-8 space-y-6">
        <h3
          className="text-lg sm:text-xl font-extrabold pb-3 border-b-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kustomisasi Kartu Statistik (By The Numbers)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Total Proyek Digital
            </label>
            <input
              type="text"
              value={formData.customProjectCount || ""}
              onChange={(e) =>
                handleChange("customProjectCount", e.target.value)
              }
              placeholder="8+ (atau misal 15+)"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
            <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
              Kustomisasi jumlah riil proyek yang pernah dikerjakan.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Total Sertifikasi Resmi
            </label>
            <input
              type="text"
              value={formData.customCertCount || ""}
              onChange={(e) => handleChange("customCertCount", e.target.value)}
              placeholder="9+ (atau misal 12+)"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
            <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
              Kustomisasi jumlah sertifikasi pada kartu hijau.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Tahun Mulai Rekayasa
            </label>
            <input
              type="text"
              value={formData.startYear || ""}
              onChange={(e) => handleChange("startYear", e.target.value)}
              placeholder="2021"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
            <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
              Tahun fondasi rekayasa pada kartu kuning.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold font-mono uppercase mb-1.5">
              Nilai Integritas Solusi
            </label>
            <input
              type="text"
              value={formData.codeQuality || ""}
              onChange={(e) => handleChange("codeQuality", e.target.value)}
              placeholder="100%"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
              style={{
                backgroundColor: "var(--surface-alt)",
                borderColor: "var(--border)",
              }}
            />
            <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
              Nilai komitmen mutu pada kartu merah.
            </span>
          </div>
        </div>
      </Card>

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
    </form>
  );
}
