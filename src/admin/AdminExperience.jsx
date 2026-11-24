import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import {
  upsertExperience,
  deleteExperience,
  uploadStorageFile,
} from "../lib/supabase";

const EMPTY_EXP = {
  role: "",
  org: "",
  org_url: "",
  period: "Maret 2026 - Sekarang",
  category: "Program Kepemimpinan",
  photo: "",
  photoAlt: "",
  active: true,
  bullets: [],
  tags: [],
  order_index: 0,
};

// Experience timeline management tab
export default function AdminExperience({ experience = [], onRefresh }) {
  const [editingItem, setEditingItem] = useState(null);
  const [bulletsText, setBulletsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
    setBulletsText((item.bullets || []).join("\n"));
    setTagsText((item.tags || []).join(", "));
    setFeedback(null);
  };

  const handleCreate = () => {
    setEditingItem({ ...EMPTY_EXP, order_index: experience.length });
    setBulletsText("");
    setTagsText("");
    setFeedback(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSubmitting(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "");
      const path = `experience/${Date.now()}-${cleanName}`;
      const url = await uploadStorageFile("media", path, file);
      setEditingItem((prev) => ({ ...prev, photo: url }));
      setFeedback({
        type: "success",
        text: "Foto dokumentasi berhasil diunggah.",
      });
    } catch {
      // Fallback preview for offline environments
      const localUrl = URL.createObjectURL(file);
      setEditingItem((prev) => ({ ...prev, photo: localUrl }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (identifier) => {
    if (!window.confirm("Hapus catatan pengalaman ini secara permanen?")) {
      return;
    }
    try {
      await deleteExperience(identifier);
      setFeedback({
        type: "success",
        text: "Catatan pengalaman berhasil dihapus.",
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus pengalaman.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      ...editingItem,
      bullets: bulletsText
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      await upsertExperience(payload);
      setFeedback({
        type: "success",
        text: "Data pengalaman berhasil disimpan.",
      });
      await onRefresh();
      setEditingItem(null);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data pengalaman.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Linimasa Pengalaman & Organisasi ({experience.length})
          </h2>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            Rekam jejak program magang, organisasi, dan kepanitiaan.
          </p>
        </div>

        {!editingItem && (
          <button
            onClick={handleCreate}
            className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
          >
            <Icon name="plus" size={16} />
            Tambah Pengalaman
          </button>
        )}
      </div>

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

      {editingItem && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {editingItem.role
                ? `Edit: ${editingItem.role}`
                : "Tambah Pengalaman"}
            </h3>
            <button
              onClick={() => setEditingItem(null)}
              className="neo-badge text-xs font-bold"
            >
              <Icon name="x" size={14} />
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Posisi / Peran
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.role}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, role: e.target.value })
                  }
                  placeholder="Peserta Novo Entrepreneurship"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Organisasi / Perusahaan
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.org}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, org: e.target.value })
                  }
                  placeholder="Novo Club by ParagonCorp"
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
                  Periode Waktu
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.period}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, period: e.target.value })
                  }
                  placeholder="Maret 2026 - Sekarang"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Kategori Program / Jenis
                </label>
                <input
                  type="text"
                  value={editingItem.category || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value,
                    })
                  }
                  placeholder="Program Kepemimpinan / Magang Industri"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Tautan Website Organisasi (Opsional)
                </label>
                <input
                  type="url"
                  value={editingItem.org_url || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, org_url: e.target.value })
                  }
                  placeholder="https://organisasi.id"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                  <input
                    type="checkbox"
                    checked={editingItem.active || false}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        active: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span>Masih Aktif / Sekarang</span>
                </label>
              </div>
            </div>

            {/* Photo upload and URL row */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold font-mono uppercase">
                Foto Dokumentasi Kegiatan
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {editingItem.photo && (
                  <div
                    className="w-32 h-24 rounded-xl overflow-hidden border-2 shrink-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <img
                      src={editingItem.photo}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="text"
                    value={editingItem.photo || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        photo: e.target.value,
                      })
                    }
                    placeholder="/images/experiences/novo/novo.jpg atau URL online"
                    className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <label className="neo-btn-secondary text-xs font-bold py-1.5 px-3 cursor-pointer">
                      <Icon name="upload" size={14} />
                      Unggah File Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span
                      className="text-xs"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      Mendukung format JPG, PNG, WebP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Alt Text Foto (Aksesibilitas)
              </label>
              <input
                type="text"
                value={editingItem.photoAlt || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, photoAlt: e.target.value })
                }
                placeholder="Dokumentasi Program Novo Entrepreneurship"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Poin Kontribusi / Capaian (Satu Per Baris)
              </label>
              <textarea
                rows={4}
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                placeholder="Mengikuti program intensif kepemimpinan...&#10;Menganalisis strategi model bisnis..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Tags / Keahlian Terkait (Pisahkan Koma)
              </label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Kepemimpinan, Validasi Bisnis, Strategi Produk, Kolaborasi"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="neo-btn-secondary text-sm font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-btn-primary text-sm font-bold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Pengalaman"}
                <Icon name="check" size={16} />
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Experience list */}
      <div className="space-y-4">
        {experience.map((item, idx) => (
          <Card key={item.id || item.role + idx} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b-2">
              <div className="flex items-center gap-3">
                {item.photo && (
                  <div
                    className="w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <img
                      src={item.photo}
                      alt={item.photoAlt || item.role}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: "var(--google-blue)" }}
                    >
                      {item.period}
                    </span>
                    {item.category && (
                      <Chip variant="default">{item.category}</Chip>
                    )}
                  </div>
                  <h4
                    className="text-base sm:text-lg font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.role}
                  </h4>
                  <div
                    className="text-xs sm:text-sm font-bold"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {item.org}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => handleEdit(item)}
                  className="neo-btn-secondary text-xs font-bold py-1.5 px-2.5"
                >
                  <Icon name="edit" size={13} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id || item.role)}
                  className="neo-badge text-xs font-bold py-1.5 px-2.5"
                  style={{
                    backgroundColor: "var(--google-red-bg)",
                    color: "var(--google-red-text)",
                    borderColor: "var(--google-red)",
                  }}
                  aria-label={`Hapus ${item.role}`}
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-1 mb-4 text-xs sm:text-sm">
              {(item.bullets || []).map((b, i) => (
                <li key={i} style={{ color: "var(--ink-secondary)" }}>
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {(item.tags || []).map((tag) => (
                <Chip key={tag} variant="default">
                  {tag}
                </Chip>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
