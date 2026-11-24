import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import { upsertExperience, deleteExperience } from "../lib/supabase";

const EMPTY_EXP = {
  role: "",
  org: "",
  org_url: "",
  period: "2024 - Sekarang",
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

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus catatan pengalaman ini?")) return;
    try {
      await deleteExperience(id);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus pengalaman.");
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
              {editingItem.role ? `Edit: ${editingItem.role}` : "Tambah Pengalaman"}
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
                  placeholder="Staf Hubungan Masyarakat"
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
                  placeholder="HIMASIFO UPN Veteran Jawa Timur"
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
                  placeholder="Januari 2025 - Sekarang"
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
                Poin Kontribusi / Capaian (Satu Per Baris)
              </label>
              <textarea
                rows={4}
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                placeholder="Menginisiasi dan mengoordinasikan jalinan kemitraan..."
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
                placeholder="Komunikasi Publik, Kemitraan, Manajemen Acara"
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
              <div>
                <span
                  className="text-xs font-mono font-bold block mb-1"
                  style={{ color: "var(--google-blue)" }}
                >
                  {item.period}
                </span>
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

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => handleEdit(item)}
                  className="neo-btn-secondary text-xs font-bold py-1.5 px-2.5"
                >
                  <Icon name="edit" size={13} />
                  Edit
                </button>
                {item.id && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="neo-badge text-xs font-bold py-1.5 px-2.5"
                    style={{
                      backgroundColor: "var(--google-red-bg)",
                      color: "var(--google-red-text)",
                      borderColor: "var(--google-red)",
                    }}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                )}
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
