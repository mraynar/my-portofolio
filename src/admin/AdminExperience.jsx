import { useState, useRef, useMemo } from "react";
import {
  Card,
  Chip,
  Icon,
  CustomSelect,
  Pagination,
  FloatingAlert,
  ImageLightboxModal,
} from "../components";
import ImageCropModal from "./ImageCropModal";
import AdminSectionHeaderEditor from "./AdminSectionHeaderEditor";
import BulkActionBar, { SelectCheckbox } from "./BulkActionBar";
import {
  getExperience,
  upsertExperience,
  deleteExperience,
  deleteExperiencesBulk,
  uploadStorageFile,
  reorderExperience,
  generateRecordId,
} from "../lib/supabase";
import {
  isInternshipExperience,
  sortExperiencesLatestFirst,
} from "../data";

const EMPTY_EXP = {
  role: "",
  org: "",
  org_url: "",
  period: "Maret 2026 - Sekarang",
  type: "Magang",
  category: "Magang Industri",
  photo: "",
  photoAlt: "",
  active: true,
  bullets: [],
  tags: [],
  order_index: 0,
};

// Experience timeline management tab
export default function AdminExperience({
  experience = [],
  onRefresh,
  info,
  onUpdateInfo,
  onSaveComplete,
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [bulletsText, setBulletsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [previewExpPhoto, setPreviewExpPhoto] = useState(null);
  const [previewExpTitle, setPreviewExpTitle] = useState("");
  const [targetExpForCrop, setTargetExpForCrop] = useState(null);
  const expFileInputRef = useRef(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPosition, setTargetPosition] = useState(1);
  const [originalPosition, setOriginalPosition] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const pageSize = 4;

  const getExpKey = (item) => item.id || item.role;

  const filteredExperience = useMemo(
    () =>
      sortExperiencesLatestFirst(experience).filter((item) => {
        if (filterType === "magang") return isInternshipExperience(item);
        if (filterType === "organisasi") return !isInternshipExperience(item);
        return true;
      }),
    [experience, filterType]
  );

  const validSelectedIds = selectedIds.filter((id) =>
    filteredExperience.some((item) => getExpKey(item) === id)
  );

  const toggleSelectExp = (key) => {
    setSelectedIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleBulkDelete = async () => {
    if (validSelectedIds.length === 0) return;
    if (
      !window.confirm(
        `Hapus ${validSelectedIds.length} pengalaman yang dipilih secara permanen?`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    setFeedback(null);
    try {
      const removed = await deleteExperiencesBulk(validSelectedIds);
      setSelectedIds([]);
      await onRefresh();
      setCurrentPage(1);
      setFeedback({
        type: "success",
        text: `${removed} pengalaman berhasil dihapus.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus pengalaman terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setTargetExpForCrop(null);
    setEditingItem({ ...item });
    setBulletsText((item.bullets || []).join("\n"));
    setTagsText((item.tags || []).join(", "));
    setFeedback(null);

    // Compute current 1-based position in active view
    const isMagangItem =
      item.type === "Magang" || isInternshipExperience(item);

    const currentList = sortExperiencesLatestFirst(experience).filter((it) => {
      if (filterType === "all") return true;
      return isMagangItem
        ? isInternshipExperience(it)
        : !isInternshipExperience(it);
    });
    const idx = currentList.findIndex(
      (it) =>
        (item.id && it.id === item.id) ||
        (item.role && it.role === item.role && it.org === item.org)
    );
    const pos = idx >= 0 ? idx + 1 : 1;
    setTargetPosition(pos);
    setOriginalPosition(pos);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    setTargetExpForCrop(null);
    const isOrgTab = filterType === "organisasi";
    const defaultType = isOrgTab ? "Organisasi" : "Magang";
    const defaultCategory = isOrgTab ? "Organisasi Kampus" : "Magang Industri";

    const currentList = sortExperiencesLatestFirst(experience).filter((it) => {
      if (isOrgTab) return !isInternshipExperience(it);
      if (filterType === "magang") return isInternshipExperience(it);
      return true;
    });
    const defaultPos = currentList.length + 1;

    setEditingItem({
      ...EMPTY_EXP,
      id: "",
      type: defaultType,
      category: defaultCategory,
      order_index: experience.length + 1,
    });
    setBulletsText("");
    setTagsText("");
    setFeedback(null);
    setTargetPosition(defaultPos);
    setOriginalPosition(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    e.target.value = "";
  };

  const handleCropConfirm = async (croppedFile, previewUrl) => {
    setCropFile(null);
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const cleanName = (croppedFile?.name || "experience.jpg").replace(
        /[^a-zA-Z0-9._-]/g,
        ""
      );
      const path = `experience/${Date.now()}-${cleanName}`;
      const url = await uploadStorageFile("media", path, croppedFile);
      const effectiveUrl = url || previewUrl;

      if (!effectiveUrl) {
        throw new Error("Gagal memproses hasil potongan foto.");
      }

      if (editingItem) {
        const isExisting = Boolean(
          editingItem.id && experience.some((e) => e.id === editingItem.id)
        );
        setEditingItem((prev) =>
          prev ? { ...prev, photo: effectiveUrl } : prev
        );

        if (isExisting) {
          const isMagang =
            editingItem.type === "Magang" ||
            isInternshipExperience(editingItem);
          const merged = {
            ...editingItem,
            type: isMagang ? "Magang" : "Organisasi",
            category:
              editingItem.category ||
              (isMagang ? "Magang Industri" : "Organisasi Kampus"),
            active: Boolean(editingItem.active),
            current: Boolean(editingItem.active),
            bullets: bulletsText
              .split("\n")
              .map((b) => b.trim())
              .filter(Boolean),
            tags: tagsText
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            photo: effectiveUrl,
          };
          await upsertExperience(merged);
          if (onRefresh) await onRefresh();
          setFeedback({
            type: "success",
            text: "Foto dokumentasi berhasil disesuaikan dan disimpan.",
          });
        } else {
          setFeedback({
            type: "success",
            text: "Foto siap digunakan. Klik Simpan Pengalaman untuk menyimpan.",
          });
        }
      } else if (targetExpForCrop) {
        const updated = { ...targetExpForCrop, photo: effectiveUrl };
        await upsertExperience(updated);
        if (onRefresh) await onRefresh();
        setTargetExpForCrop(null);
        setFeedback({
          type: "success",
          text: "Foto dokumentasi berhasil disesuaikan dan disimpan.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Gagal menyimpan foto dokumentasi.",
      });
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

  // Reorder experience item to a new position
  const handleMove = async (fromIdx, toIdx) => {
    if (fromIdx === toIdx || isReordering || filterType === "all") return;
    const currentList = sortExperiencesLatestFirst(experience);
    const isMagangTab = filterType === "magang";
    const categoryItems = currentList.filter((item) =>
      isMagangTab ? isInternshipExperience(item) : !isInternshipExperience(item)
    );
    const otherItems = currentList.filter((item) =>
      isMagangTab ? !isInternshipExperience(item) : isInternshipExperience(item)
    );

    const itemA = categoryItems[fromIdx];
    const itemB = categoryItems[toIdx];
    if (!itemA || !itemB) return;

    const newCategoryList = [...categoryItems];
    const [moved] = newCategoryList.splice(fromIdx, 1);
    newCategoryList.splice(toIdx, 0, moved);

    const newMaster = isMagangTab
      ? [...newCategoryList, ...otherItems]
      : [...otherItems, ...newCategoryList];

    setIsReordering(true);
    try {
      await reorderExperience(newMaster);
      setFeedback({
        type: "success",
        text: `Urutan disimpan: ${moved.role} kini di posisi #${toIdx + 1}.`,
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal memperbarui urutan pengalaman.",
      });
    } finally {
      setIsReordering(false);
      setDraggedIdx(null);
      setDragOverIdx(null);
    }
  };

  // Generate options for position selector dropdown
  const positionOptions = useMemo(() => {
    if (!editingItem) return [];
    const isNew = !experience.some(
      (e) =>
        (editingItem.id && e.id === editingItem.id) ||
        (editingItem.role &&
          e.role === editingItem.role &&
          e.org === editingItem.org)
    );

    const isMagangItem =
      editingItem.type === "Magang" || isInternshipExperience(editingItem);

    const currentList = sortExperiencesLatestFirst(experience).filter((it) => {
      if (filterType === "all") return true;
      return isMagangItem
        ? isInternshipExperience(it)
        : !isInternshipExperience(it);
    });

    const totalSlots = isNew
      ? currentList.length + 1
      : Math.max(currentList.length, 1);
    const options = [];

    for (let pos = 1; pos <= totalSlots; pos++) {
      let label = `Posisi #${pos}`;
      const existingItem = currentList[pos - 1];

      if (isNew) {
        if (pos === totalSlots) {
          label += " (Posisi Terakhir / Baru)";
        } else if (existingItem) {
          const shortName = existingItem.role || existingItem.org || "Item";
          label += ` (Geser: ${shortName})`;
        }
      } else {
        if (pos === originalPosition) {
          label += " (Posisi Saat Ini)";
        } else if (existingItem) {
          const shortName = existingItem.role || existingItem.org || "Item";
          label += ` (Saat Ini: ${shortName})`;
        }
      }

      options.push({ value: String(pos), label });
    }

    return options;
  }, [editingItem, experience, filterType, originalPosition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const isMagang =
      editingItem.type === "Magang" || isInternshipExperience(editingItem);
    const resolvedType = isMagang ? "Magang" : "Organisasi";
    const assignedId = editingItem.id || generateRecordId();
    const payload = {
      ...editingItem,
      id: assignedId,
      type: resolvedType,
      category:
        editingItem.category ||
        (isMagang ? "Magang Industri" : "Organisasi Kampus"),
      active: Boolean(editingItem.active),
      current: Boolean(editingItem.active),
      photo: editingItem.photo || "",
      photoAlt: editingItem.photoAlt || "",
      photo_alt: editingItem.photoAlt || "",
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
      // Always read latest persisted records to prevent stale prop overwrites
      const latestRecords = await getExperience();
      const masterList = sortExperiencesLatestFirst(latestRecords);

      let newMaster;
      let finalPos = targetPosition;

      if (filterType === "all") {
        const currentIdx = masterList.findIndex(
          (it) =>
            (payload.id && it.id === payload.id) ||
            (!editingItem.id &&
              payload.role &&
              it.role === payload.role &&
              it.org === payload.org)
        );

        const updatedMaster = [...masterList];
        if (currentIdx >= 0) {
          updatedMaster.splice(currentIdx, 1);
        }
        finalPos = Math.max(
          1,
          Math.min(targetPosition, updatedMaster.length + 1)
        );
        updatedMaster.splice(finalPos - 1, 0, payload);
        newMaster = updatedMaster;
      } else {
        const categoryItems = masterList.filter((item) =>
          isMagang ? isInternshipExperience(item) : !isInternshipExperience(item)
        );
        const otherItems = masterList.filter((item) =>
          isMagang ? !isInternshipExperience(item) : isInternshipExperience(item)
        );

        const currentIdx = categoryItems.findIndex(
          (it) =>
            (payload.id && it.id === payload.id) ||
            (!editingItem.id &&
              payload.role &&
              it.role === payload.role &&
              it.org === payload.org)
        );

        const updatedCategory = [...categoryItems];
        if (currentIdx >= 0) {
          updatedCategory.splice(currentIdx, 1);
        }
        finalPos = Math.max(
          1,
          Math.min(targetPosition, updatedCategory.length + 1)
        );
        updatedCategory.splice(finalPos - 1, 0, payload);

        newMaster = isMagang
          ? [...updatedCategory, ...otherItems]
          : [...otherItems, ...updatedCategory];
      }

      const indexedMaster = newMaster.map((item, idx) => ({
        ...item,
        order_index: idx + 1,
      }));

      // Single atomic write avoids race conditions and duplicate cloud inserts
      await reorderExperience(indexedMaster);

      const targetCategoryTab = isMagang ? "magang" : "organisasi";
      if (filterType !== "all" && filterType !== targetCategoryTab) {
        setFilterType(targetCategoryTab);
      }

      const safeTargetPage = Math.max(1, Math.ceil(finalPos / pageSize));
      setCurrentPage(safeTargetPage);

      await onRefresh();
      setEditingItem(null);
      setTargetExpForCrop(null);
      setFeedback({
        type: "success",
        text: `Data pengalaman berhasil disimpan di Posisi #${finalPos}.`,
      });
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data pengalaman.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (editingItem) {
    const isNew = !experience.some((e) => e.id === editingItem.id);
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
                setEditingItem(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2 mb-3 cursor-pointer"
            >
              <Icon name="arrow-left" size={16} />
              Kembali ke Linimasa Pengalaman
            </button>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew
                ? "Tambah Pengalaman Baru"
                : `Edit Pengalaman: ${editingItem.role || "Tanpa Judul"}`}
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola peran, organisasi, periode, foto dokumentasi, dan poin kontribusi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
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
              {editingItem.role
                ? `Edit: ${editingItem.role}`
                : "Tambah Pengalaman"}
            </h3>
            <button
              onClick={() => { setEditingItem(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                  Bagian / Tipe Pengalaman
                </label>
                <CustomSelect
                  value={
                    editingItem.type ||
                    (isInternshipExperience(editingItem) ? "Magang" : "Organisasi")
                  }
                  onChange={(e) => {
                    const nextType = e.target.value;
                    const prevDefault =
                      nextType === "Magang"
                        ? "Organisasi Kampus"
                        : "Magang Industri";
                    const shouldReplaceCategory =
                      !editingItem.category ||
                      editingItem.category === prevDefault;
                    setEditingItem({
                      ...editingItem,
                      type: nextType,
                      category: shouldReplaceCategory
                        ? nextType === "Magang"
                          ? "Magang Industri"
                          : "Organisasi Kampus"
                        : editingItem.category,
                    });
                  }}
                  options={[
                    {
                      value: "Magang",
                      label: "Pengalaman Magang & Profesional (Bagian Atas)",
                    },
                    {
                      value: "Organisasi",
                      label: "Pengalaman Organisasi & Komunitas (Bagian Bawah)",
                    },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Label Kategori / Sub-judul
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
                  placeholder="Magang Industri / Program Kepemimpinan"
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
                <div className="mt-2.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
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

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Urutan Posisi Tampilan
                </label>
                <CustomSelect
                  value={String(targetPosition)}
                  onChange={(e) =>
                    setTargetPosition(parseInt(e.target.value, 10) || 1)
                  }
                  options={positionOptions}
                />
                <span
                  className="text-[11px] block mt-1.5"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Item di posisi terpilih otomatis bergeser ke nomor berikutnya.
                </span>
              </div>
            </div>

            <div>
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
                className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            {/* Photo upload and URL row */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold font-mono uppercase">
                Foto Dokumentasi Kegiatan
              </label>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {editingItem.photo && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewExpPhoto(editingItem.photo);
                      setPreviewExpTitle(
                        editingItem.role || "Foto Dokumentasi"
                      );
                      setTargetExpForCrop(editingItem);
                    }}
                    title="Klik untuk memperbesar dan mengedit foto"
                    className="group relative w-32 h-24 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-transform hover:scale-105"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <img
                      src={editingItem.photo}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Icon name="zoom-in" size={18} />
                    </div>
                  </button>
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
                    placeholder="URL gambar (https://...)"
                    className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                        ref={expFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    {editingItem.photo && (
                      <button
                        type="button"
                        onClick={() => {
                          setTargetExpForCrop(editingItem);
                          setCropFile(editingItem.photo);
                        }}
                        className="neo-btn-secondary text-xs font-bold py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <Icon name="crop" size={14} />
                        <span>Sesuaikan Foto</span>
                      </button>
                    )}
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
                className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t-2">
              <button
                type="button"
                onClick={() => { setEditingItem(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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

        <ImageLightboxModal
          isOpen={Boolean(previewExpPhoto)}
          imageUrl={previewExpPhoto}
          title={previewExpTitle || "Foto Dokumentasi Kegiatan"}
          subtitle="Rasio 16:9 • Frame Dokumentasi Linimasa"
          alt={previewExpTitle || "Dokumentasi Pengalaman"}
          onClose={() => setPreviewExpPhoto(null)}
          onEdit={() => {
            const p = previewExpPhoto;
            setPreviewExpPhoto(null);
            setCropFile(p);
          }}
          onUpload={() => {
            setPreviewExpPhoto(null);
            expFileInputRef.current?.click();
          }}
        />

        {cropFile && (
          <ImageCropModal
            file={cropFile}
            aspectRatio={16 / 9}
            title="Sesuaikan Foto Dokumentasi Kegiatan"
            description="Rasio 16:9 sesuai persis dengan frame banner dokumentasi linimasa."
            onConfirm={handleCropConfirm}
            onCancel={() => setCropFile(null)}
          />
        )}
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
            Linimasa Pengalaman & Organisasi ({experience.length})
          </h2>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            Rekam jejak program magang, organisasi, dan kepanitiaan.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
        >
          <Icon name="plus" size={16} />
          Tambah Pengalaman
        </button>
      </div>

      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Section Heading Customization */}
      <AdminSectionHeaderEditor
        sectionKey="exp"
        sectionName="Pengalaman"
        fields={{
          kicker: "expKicker",
          title: "expTitle",
          titleAccent: "expTitleAccent",
          subtitle: "expSubtitle",
        }}
        defaultValues={{
          kicker: "REKAM JEJAK PROFESIONAL",
          title: "Pengalaman",
          titleAccent: "Magang & Organisasi",
          subtitle:
            "Riwayat magang industri dan kepengurusan organisasi dalam kepemimpinan dan rekayasa perangkat lunak.",
        }}
        info={info}
        onUpdateInfo={onUpdateInfo}
        onSaveComplete={onSaveComplete}
      />

      {/* Filter tabs and reorder instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Semua Pengalaman" },
            { key: "magang", label: "Magang & Profesional" },
            { key: "organisasi", label: "Organisasi & Kepemimpinan" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setFilterType(tab.key);
                setSelectedIds([]);
                setCurrentPage(1);
              }}
              className="px-3.5 py-1.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor:
                  filterType === tab.key ? "var(--ink)" : "var(--surface)",
                color:
                  filterType === tab.key ? "var(--canvas)" : "var(--ink)",
                borderColor: "var(--border)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="text-xs font-mono font-medium flex items-center gap-1.5"
          style={{ color: "var(--ink-muted)" }}
        >
          <Icon name="info" size={14} />
          <span>
            {filterType === "all"
              ? "Pilih tab kategori untuk mengatur urutan posisi tampilan."
              : "Tarik kartu untuk mengatur urutan posisi tampilan."}
          </span>
        </div>
      </div>

      <BulkActionBar
        totalCount={filteredExperience.length}
        selectedCount={validSelectedIds.length}
        allSelected={
          filteredExperience.length > 0 &&
          validSelectedIds.length === filteredExperience.length
        }
        onToggleSelectAll={() =>
          setSelectedIds(
            validSelectedIds.length === filteredExperience.length
              ? []
              : filteredExperience.map(getExpKey)
          )
        }
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleBulkDelete}
        isDeleting={isBulkDeleting}
        itemLabel="pengalaman"
      />

      {/* Experience list with drag-and-drop reordering */}
      {filteredExperience.length === 0 ? (
        <Card className="p-8 text-center space-y-2">
          <div
            className="w-12 h-12 rounded-xl border-2 mx-auto flex items-center justify-center"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
              color: "var(--google-blue)",
            }}
          >
            <Icon name="briefcase" size={22} />
          </div>
          <p className="font-bold text-sm">
            Belum ada pengalaman pada kategori ini.
          </p>
          <p className="text-xs" style={{ color: "var(--ink-secondary)" }}>
            Klik Tambah Pengalaman untuk menambahkan riwayat baru.
          </p>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {(() => {
          const displayedList = filteredExperience;
          const maxPage = Math.max(1, Math.ceil(displayedList.length / pageSize));
          const effectivePage = Math.min(currentPage, maxPage);
          const paginatedList = displayedList.slice(
            (effectivePage - 1) * pageSize,
            effectivePage * pageSize
          );

          return paginatedList.map((item, localIdx) => {
            const absoluteIdx = (effectivePage - 1) * pageSize + localIdx;
            const isMagang = isInternshipExperience(item);
            const canDrag = filterType !== "all" && !isReordering;
            const isDragging = canDrag && draggedIdx === absoluteIdx;
            const isOver = canDrag && dragOverIdx === absoluteIdx;
            const expKey = getExpKey(item);
            const isSelected = validSelectedIds.includes(expKey);

            return (
              <div
                key={item.id || item.role + absoluteIdx}
                draggable={canDrag}
                onDragStart={(e) => {
                  if (!canDrag) return;
                  setDraggedIdx(absoluteIdx);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(absoluteIdx));
                }}
                onDragOver={(e) => {
                  if (!canDrag) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIdx !== absoluteIdx) setDragOverIdx(absoluteIdx);
                }}
                onDragLeave={() => {
                  if (dragOverIdx === absoluteIdx) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  if (!canDrag) return;
                  e.preventDefault();
                  if (draggedIdx !== null && draggedIdx !== absoluteIdx) {
                    handleMove(draggedIdx, absoluteIdx);
                  }
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`transition-all duration-200 select-none ${canDrag
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-default"
                  } ${isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"}`}
              >
                <Card
                  className={`p-4 sm:p-5 h-full flex flex-col justify-between transition-all relative overflow-hidden min-w-0 ${isOver
                    ? "ring-4 ring-[var(--google-blue)] border-[var(--google-blue)] shadow-[0_0_15px_rgba(26,115,232,0.25)]"
                    : isSelected
                    ? "ring-2 ring-[var(--google-blue)]"
                    : ""
                    }`}
                >
                  <div>
                    {/* Top toolbar: position indicator and actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b-2">
                      <div className="flex items-center gap-2">
                        <SelectCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelectExp(expKey)}
                          ariaLabel={`Pilih ${item.role}`}
                        />
                        <span
                          className="neo-badge text-xs font-mono font-extrabold px-2.5 py-1"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                          }}
                        >
                          Posisi #{absoluteIdx + 1}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="neo-btn-secondary text-xs font-bold py-1.5 px-2.5 cursor-pointer"
                        >
                          <Icon name="edit" size={13} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id || item.role)}
                          className="neo-badge text-xs font-bold py-1.5 px-2.5 cursor-pointer"
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

                    {/* Experience item details */}
                    <div className="flex items-start gap-3 mb-3">
                      {item.photo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewExpPhoto(item.photo);
                            setPreviewExpTitle(item.role || "Foto Kegiatan");
                            setTargetExpForCrop(item);
                          }}
                          title="Klik untuk memperbesar foto dokumentasi"
                          className="group relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-transform hover:scale-105"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <img
                            src={item.photo}
                            alt={item.photoAlt || item.role}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Icon name="zoom-in" size={14} />
                          </div>
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="neo-badge text-[11px] font-bold px-2 py-0.5"
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
                            {isMagang
                              ? "Magang & Profesional"
                              : "Organisasi & Kampus"}
                          </span>
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: "var(--ink-muted)" }}
                          >
                            {item.period}
                          </span>
                          {item.category && (
                            <Chip variant="default">{item.category}</Chip>
                          )}
                          {(item.active || item.current) && (
                            <Chip variant="green">Aktif</Chip>
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

                    <ul className="list-disc pl-5 space-y-1 mb-4 text-xs sm:text-sm">
                      {(item.bullets || []).map((b, i) => (
                        <li key={i} style={{ color: "var(--ink-secondary)" }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                    {(item.tags || []).map((tag) => (
                      <Chip key={tag} variant="default">
                        {tag}
                      </Chip>
                    ))}
                  </div>
                </Card>
              </div>
            );
          });
        })()}
      </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={
          sortExperiencesLatestFirst(experience).filter((item) => {
            if (filterType === "magang") return isInternshipExperience(item);
            if (filterType === "organisasi")
              return !isInternshipExperience(item);
            return true;
          }).length
        }
        pageSize={pageSize}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
        itemLabel="pengalaman"
      />

      <ImageLightboxModal
        isOpen={Boolean(previewExpPhoto)}
        imageUrl={previewExpPhoto}
        title={previewExpTitle || "Foto Dokumentasi Kegiatan"}
        subtitle="Rasio 16:9 • Frame Dokumentasi Linimasa"
        alt={previewExpTitle || "Dokumentasi Pengalaman"}
        onClose={() => setPreviewExpPhoto(null)}
        onEdit={() => {
          const p = previewExpPhoto;
          setPreviewExpPhoto(null);
          setCropFile(p);
        }}
      />

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspectRatio={16 / 9}
          title="Sesuaikan Foto Dokumentasi Kegiatan"
          description="Rasio 16:9 sesuai persis dengan frame banner dokumentasi linimasa."
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
}
