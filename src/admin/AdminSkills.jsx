import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import { upsertSkillCategory, deleteSkillCategory } from "../lib/supabase";

// Technical skills management tab
export default function AdminSkills({ skills = [], onRefresh }) {
  const [editingCat, setEditingCat] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setSkillsText((cat.skills || []).join(", "));
    setFeedback(null);
  };

  const handleCreate = () => {
    setEditingCat({ name: "", skills: [], order_index: skills.length });
    setSkillsText("");
    setFeedback(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus kategori keahlian ini?")) return;
    try {
      await deleteSkillCategory(id);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus kategori skill.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      ...editingCat,
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await upsertSkillCategory(payload);
      setFeedback({
        type: "success",
        text: "Kategori keahlian berhasil disimpan.",
      });
      await onRefresh();
      setEditingCat(null);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan kategori keahlian.",
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
            Keahlian & Teknologi ({skills.length})
          </h2>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            Kategorisasi teknologi, bahasa pemrograman, dan alat kerja.
          </p>
        </div>

        {!editingCat && (
          <button
            onClick={handleCreate}
            className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
          >
            <Icon name="plus" size={16} />
            Tambah Kategori
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

      {editingCat && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {editingCat.name
                ? `Edit: ${editingCat.name}`
                : "Tambah Kategori Baru"}
            </h3>
            <button
              onClick={() => setEditingCat(null)}
              className="neo-badge text-xs font-bold"
            >
              <Icon name="x" size={14} />
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Nama Kategori
              </label>
              <input
                type="text"
                required
                value={editingCat.name}
                onChange={(e) =>
                  setEditingCat({ ...editingCat, name: e.target.value })
                }
                placeholder="Frontend & Mobile Development"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Daftar Keahlian / Tools (Pisahkan Koma)
              </label>
              <input
                type="text"
                required
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Flutter, Tailwind CSS, TypeScript"
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
                onClick={() => setEditingCat(null)}
                className="neo-btn-secondary text-sm font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-btn-primary text-sm font-bold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                <Icon name="check" size={16} />
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {skills.map((cat, idx) => (
          <Card key={cat.id || cat.name + idx} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b-2">
                <h4
                  className="font-extrabold text-base sm:text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.name}
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="neo-btn-secondary text-xs font-bold py-1 px-2"
                  >
                    <Icon name="edit" size={12} />
                  </button>
                  {cat.id && (
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="neo-badge text-xs font-bold py-1 px-2"
                      style={{
                        backgroundColor: "var(--google-red-bg)",
                        color: "var(--google-red-text)",
                        borderColor: "var(--google-red)",
                      }}
                    >
                      <Icon name="trash" size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(cat.skills || []).map((skill) => (
                  <Chip key={skill} variant="default">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
