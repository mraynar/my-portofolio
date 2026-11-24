import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import { upsertSkillCategory, deleteSkillCategory } from "../lib/supabase";

// Technical skills management tab
export default function AdminSkills({ skills = [], onRefresh }) {
  const [editingCat, setEditingCat] = useState(null);
  const [editingSkillsList, setEditingSkillsList] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setEditingSkillsList([...(cat.skills || [])]);
    setNewSkillInput("");
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setEditingCat({ name: "", skills: [], order_index: skills.length });
    setEditingSkillsList([]);
    setNewSkillInput("");
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (!editingSkillsList.includes(trimmed)) {
      setEditingSkillsList([...editingSkillsList, trimmed]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditingSkillsList(
      editingSkillsList.filter((s) => s !== skillToRemove)
    );
  };

  const handleDelete = async (identifier) => {
    if (!window.confirm("Hapus kategori keahlian ini secara permanen?")) {
      return;
    }
    try {
      await deleteSkillCategory(identifier);
      setFeedback({
        type: "success",
        text: "Kategori keahlian berhasil dihapus.",
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus kategori skill.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Combine list with any pending text in input
    const finalSkills = [...editingSkillsList];
    const pending = newSkillInput.trim();
    if (pending && !finalSkills.includes(pending)) {
      finalSkills.push(pending);
    }

    const payload = {
      ...editingCat,
      skills: finalSkills,
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

    if (editingCat) {
    const isNew = !skills.some((s) => s.id === editingCat.id || s.name === editingCat.name);
    return (
      <div className="space-y-6 w-full">
        {/* Dedicated edit header with back button */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <button
              type="button"
              onClick={() => {
                setEditingCat(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2 mb-3 cursor-pointer"
            >
              <Icon name="arrow-left" size={16} />
              Kembali ke Daftar Keahlian
            </button>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew
                ? "Tambah Kategori Keahlian"
                : `Edit Kategori: ${editingCat.name || "Tanpa Nama"}`}
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola nama kategori dan daftar teknologi, tools, atau bahasa pemrograman.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCat(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="neo-badge text-xs font-bold self-start sm:self-center cursor-pointer"
          >
            <Icon name="x" size={14} />
            Batal
          </button>
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
              onClick={() => { setEditingCat(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="neo-badge text-xs font-bold"
            >
              <Icon name="x" size={14} />
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Interactive tag list */}
            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                Daftar Keahlian ({editingSkillsList.length})
              </label>

              <div
                className="p-4 rounded-xl border-2 min-h-[60px] flex flex-wrap gap-2 mb-3"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              >
                {editingSkillsList.length === 0 ? (
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    Belum ada keahlian ditambahkan. Ketik di bawah untuk menambah.
                  </span>
                ) : (
                  editingSkillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        color: "var(--ink)",
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:opacity-75 focus:outline-none"
                        aria-label={`Hapus ${skill}`}
                      >
                        <Icon name="x" size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add skill item input row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Ketik keahlian (contoh: Next.js) lalu tekan Enter"
                  className="flex-1 px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="neo-btn-secondary text-xs font-bold px-4"
                >
                  <Icon name="plus" size={14} />
                  Tambah
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2">
              <button
                type="button"
                onClick={() => { setEditingCat(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
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

        <button
            onClick={handleCreate}
            className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
          >
            <Icon name="plus" size={16} />
            Tambah Kategori
          </button>
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

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {skills.map((cat, idx) => (
          <Card
            key={cat.id || cat.name + idx}
            className="p-5 flex flex-col justify-between h-full"
          >
            <div>
              <div
                className="flex items-center justify-between mb-4 pb-3 border-b-2 min-h-[56px]"
                style={{ borderColor: "var(--border)" }}
              >
                <h4
                  className="font-extrabold text-base sm:text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.name}
                </h4>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(cat)}
                    className="neo-btn-secondary text-xs font-bold py-1 px-2.5"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Icon name="edit" size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id || cat.name)}
                    className="neo-badge text-xs font-bold py-1 px-2.5"
                    style={{
                      backgroundColor: "var(--google-red-bg)",
                      color: "var(--google-red-text)",
                      borderColor: "var(--google-red)",
                    }}
                    aria-label={`Hapus ${cat.name}`}
                  >
                    <Icon name="trash" size={12} />
                  </button>
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
