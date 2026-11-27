import { useState } from "react";
import { Card, Chip, Icon, FloatingAlert } from "../components";
import AdminSectionHeaderEditor from "./AdminSectionHeaderEditor";
import BulkActionBar, { SelectCheckbox } from "./BulkActionBar";
import {
  upsertSkillCategory,
  deleteSkillCategory,
  deleteSkillCategoriesBulk,
  reorderSkillCategories,
} from "../lib/supabase";

// Technical skills management tab
export default function AdminSkills({
  skills = [],
  onRefresh,
  info,
  onUpdateInfo,
}) {
  const [editingCat, setEditingCat] = useState(null);
  const [editingSkillsList, setEditingSkillsList] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [draggedSkillIdx, setDraggedSkillIdx] = useState(null);
  const [dragOverSkillIdx, setDragOverSkillIdx] = useState(null);
  const [editingSkillIdx, setEditingSkillIdx] = useState(null);
  const [editingSkillText, setEditingSkillText] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const getSkillKey = (cat) => cat.id || cat.name;
  const validSelectedIds = selectedIds.filter((id) =>
    skills.some((cat) => getSkillKey(cat) === id)
  );

  const toggleSelectSkill = (key) => {
    setSelectedIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleBulkDelete = async () => {
    if (validSelectedIds.length === 0) return;
    if (
      !window.confirm(
        `Hapus ${validSelectedIds.length} kategori keahlian yang dipilih secara permanen?`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    setFeedback(null);
    try {
      const removed = await deleteSkillCategoriesBulk(validSelectedIds);
      setSelectedIds([]);
      await onRefresh();
      setFeedback({
        type: "success",
        text: `${removed} kategori keahlian berhasil dihapus.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus kategori keahlian terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Start inline editing for a specific skill item
  const handleStartEditSkill = (idx, text) => {
    setEditingSkillIdx(idx);
    setEditingSkillText(text);
  };

  // Save edited skill text into current editing list
  const handleSaveSkillText = (idx) => {
    if (editingSkillIdx === null) return;
    const trimmed = editingSkillText.trim();
    if (trimmed && trimmed !== editingSkillsList[idx]) {
      const isDuplicate = editingSkillsList.some(
        (s, i) => i !== idx && s.toLowerCase() === trimmed.toLowerCase()
      );
      if (!isDuplicate) {
        setEditingSkillsList((prev) => {
          const next = [...prev];
          next[idx] = trimmed;
          return next;
        });
      }
    }
    setEditingSkillIdx(null);
    setEditingSkillText("");
  };

  // Cancel inline editing of skill item
  const handleCancelEditSkill = () => {
    setEditingSkillIdx(null);
    setEditingSkillText("");
  };

  // Reorder skill item within editing category
  const handleMoveSkill = (fromIdx, toIdx) => {
    if (fromIdx === toIdx || fromIdx === null || toIdx === null) return;
    setEditingSkillsList((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  // Reorder skill category item to a new position via drag and drop
  const handleMove = async (fromIdx, toIdx) => {
    if (fromIdx === toIdx || isReordering) return;
    const sorted = [...skills].sort(
      (a, b) =>
        (a.order_index ?? a.orderIndex ?? 0) -
        (b.order_index ?? b.orderIndex ?? 0)
    );
    const movedItem = sorted[fromIdx];
    if (!movedItem) return;

    const newOrder = [...sorted];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);

    setIsReordering(true);
    try {
      await reorderSkillCategories(newOrder);
      setFeedback({
        type: "success",
        text: `Urutan disimpan: "${moved.name}" kini di posisi #${toIdx + 1}.`,
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal memperbarui urutan kategori keahlian.",
      });
    } finally {
      setIsReordering(false);
      setDraggedIdx(null);
      setDragOverIdx(null);
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setEditingSkillsList([...(cat.skills || [])]);
    setNewSkillInput("");
    setFeedback(null);
    setDraggedSkillIdx(null);
    setDragOverSkillIdx(null);
    setEditingSkillIdx(null);
    setEditingSkillText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setEditingCat({ name: "", skills: [], order_index: skills.length });
    setEditingSkillsList([]);
    setNewSkillInput("");
    setFeedback(null);
    setDraggedSkillIdx(null);
    setDragOverSkillIdx(null);
    setEditingSkillIdx(null);
    setEditingSkillText("");
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

    // Commit active inline skill edit if any
    let currentSkills = [...editingSkillsList];
    if (editingSkillIdx !== null) {
      const trimmedEdit = editingSkillText.trim();
      if (trimmedEdit) {
        currentSkills[editingSkillIdx] = trimmedEdit;
      }
    }

    // Combine list with any pending text in input
    const finalSkills = [...currentSkills];
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

        <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

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

            {/* Interactive tag list with drag-and-drop and inline edit */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold font-mono uppercase">
                  Daftar Keahlian ({editingSkillsList.length})
                </label>
                {editingSkillsList.length > 0 && (
                  <span
                    className="text-[11px] font-mono inline-flex items-center gap-1"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    <Icon name="grip" size={12} />
                    Tarik urutan, klik 2x untuk edit teks
                  </span>
                )}
              </div>

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
                  editingSkillsList.map((skill, idx) => {
                    const isDragging = draggedSkillIdx === idx;
                    const isOver = dragOverSkillIdx === idx;
                    const isEditing = editingSkillIdx === idx;

                    if (isEditing) {
                      return (
                        <span
                          key={`edit-${idx}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 ring-2 ring-[var(--google-blue)] shadow-sm"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--google-blue)",
                            color: "var(--ink)",
                          }}
                        >
                          <Icon
                            name="edit"
                            size={12}
                            className="text-[var(--google-blue)] shrink-0"
                          />
                          <input
                            type="text"
                            value={editingSkillText}
                            onChange={(e) =>
                              setEditingSkillText(e.target.value)
                            }
                            onBlur={() => handleSaveSkillText(idx)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveSkillText(idx);
                              } else if (e.key === "Escape") {
                                e.preventDefault();
                                handleCancelEditSkill();
                              }
                            }}
                            autoFocus
                            className="bg-transparent border-none outline-none font-bold text-xs p-0 min-w-[70px] max-w-[160px]"
                            style={{ color: "var(--ink)" }}
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSaveSkillText(idx);
                            }}
                            className="hover:opacity-75 focus:outline-none cursor-pointer text-[var(--google-blue)] shrink-0"
                            aria-label="Simpan perubahan nama keahlian"
                            title="Simpan"
                          >
                            <Icon name="check" size={12} />
                          </button>
                        </span>
                      );
                    }

                    return (
                      <span
                        key={skill + idx}
                        draggable={editingSkillIdx === null}
                        onDoubleClick={() => handleStartEditSkill(idx, skill)}
                        onDragStart={(e) => {
                          setDraggedSkillIdx(idx);
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", String(idx));
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                          if (dragOverSkillIdx !== idx) {
                            setDragOverSkillIdx(idx);
                          }
                        }}
                        onDragLeave={() => {
                          if (dragOverSkillIdx === idx) {
                            setDragOverSkillIdx(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const from =
                            draggedSkillIdx ??
                            parseInt(e.dataTransfer.getData("text/plain"), 10);
                          if (from !== null && !isNaN(from) && from !== idx) {
                            handleMoveSkill(from, idx);
                          }
                          setDraggedSkillIdx(null);
                          setDragOverSkillIdx(null);
                        }}
                        onDragEnd={() => {
                          setDraggedSkillIdx(null);
                          setDragOverSkillIdx(null);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 cursor-grab active:cursor-grabbing select-none transition-all duration-150 ${
                          isDragging ? "opacity-40 scale-95" : ""
                        } ${
                          isOver && !isDragging
                            ? "ring-2 ring-[var(--google-blue)] border-[var(--google-blue)] scale-105"
                            : ""
                        }`}
                        style={{
                          backgroundColor: "var(--surface)",
                          borderColor:
                            isOver && !isDragging
                              ? "var(--google-blue)"
                              : "var(--border)",
                          color: "var(--ink)",
                        }}
                        title="Tarik urutan, klik 2x untuk edit teks"
                      >
                        <Icon
                          name="grip"
                          size={12}
                          className="opacity-40 shrink-0 pointer-events-none"
                        />
                        <span>{skill}</span>
                        <button
                          type="button"
                          draggable={false}
                          onMouseDown={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:opacity-75 focus:outline-none cursor-pointer shrink-0 ml-0.5"
                          aria-label={`Hapus ${skill}`}
                        >
                          <Icon name="x" size={12} />
                        </button>
                      </span>
                    );
                  })
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

      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Section Heading Customization */}
      <AdminSectionHeaderEditor
        sectionKey="skills"
        sectionName="Keahlian & Teknologi"
        fields={{
          kicker: "skillsKicker",
          title: "skillsTitle",
          titleAccent: "skillsTitleAccent",
          subtitle: "skillsSubtitle",
        }}
        defaultValues={{
          kicker: "KEAHLIAN TEKNIS",
          title: "Keahlian &",
          titleAccent: "Teknologi",
          subtitle:
            "Teknologi yang saya gunakan secara aktif dalam pengembangan perangkat lunak dan manajemen sistem informasi.",
        }}
        info={info}
        onUpdateInfo={onUpdateInfo}
      />

      <BulkActionBar
        totalCount={skills.length}
        selectedCount={validSelectedIds.length}
        allSelected={
          skills.length > 0 && validSelectedIds.length === skills.length
        }
        onToggleSelectAll={() =>
          setSelectedIds(
            validSelectedIds.length === skills.length
              ? []
              : skills.map(getSkillKey)
          )
        }
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        isDeleting={isBulkDeleting}
        itemLabel="kategori"
      />

      {/* Categories grid */}
      {skills.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <div
            className="w-12 h-12 rounded-xl border-2 mx-auto flex items-center justify-center"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
              color: "var(--google-blue)",
            }}
          >
            <Icon name="code" size={22} />
          </div>
          <p className="font-bold text-sm">
            Belum ada kategori keahlian yang tersimpan.
          </p>
          <p className="text-xs" style={{ color: "var(--ink-secondary)" }}>
            Klik Tambah Kategori untuk mulai menyusun daftar keahlian.
          </p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
        {(() => {
          const sortedSkills = [...skills].sort(
            (a, b) =>
              (a.order_index ?? a.orderIndex ?? 0) -
              (b.order_index ?? b.orderIndex ?? 0)
          );

          return sortedSkills.map((cat, idx) => {
            const isDragging = draggedIdx === idx;
            const isOver = dragOverIdx === idx;
            const skillKey = getSkillKey(cat);
            const isSelected = validSelectedIds.includes(skillKey);

            return (
              <div
                key={cat.id || cat.name + idx}
                draggable={!isReordering}
                onDragStart={(e) => {
                  setDraggedIdx(idx);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(idx));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIdx !== idx) setDragOverIdx(idx);
                }}
                onDragLeave={() => {
                  if (dragOverIdx === idx) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from =
                    draggedIdx ??
                    parseInt(e.dataTransfer.getData("text/plain"), 10);
                  if (from !== null && !isNaN(from) && from !== idx) {
                    handleMove(from, idx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`transition-all duration-200 cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-40 scale-95" : ""
                } ${
                  isOver && !isDragging
                    ? "ring-2 ring-[var(--google-blue)] ring-offset-2 scale-[1.02]"
                    : ""
                }`}
              >
                <Card
                  className={`p-5 flex flex-col justify-between h-full transition-all ${
                    isSelected ? "ring-2 ring-[var(--google-blue)]" : ""
                  }`}
                >
                  <div>
                    <div
                      className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 min-h-[56px]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <SelectCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelectSkill(skillKey)}
                          ariaLabel={`Pilih ${cat.name}`}
                        />
                        <h4
                          className="font-extrabold text-base sm:text-lg truncate"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {cat.name}
                        </h4>
                      </div>
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
              </div>
            );
          });
        })()}
      </div>
      )}
    </div>
  );
}
