import { useState } from "react";
import {
  Card,
  Chip,
  Icon,
  CustomSelect,
  Pagination,
  FloatingAlert,
} from "../components";
import ImageCropModal from "./ImageCropModal";
import {
  upsertProject,
  deleteProject,
  uploadStorageFile,
  saveSiteSettings,
  reorderProjects,
} from "../lib/supabase";

const EMPTY_PROJECT = {
  id: "",
  title: "",
  label: "Web App",
  featured: false,
  image: "",
  problem: "",
  solution: "",
  impact: "",
  badges: [],
  demoUrl: "",
  repoNotice: "Repositori Privat (Proyek Komersial Klien)",
  repoReason: "Kode sumber dilindungi perjanjian kerahasiaan klien.",
  status: "published",
  orderIndex: 0,
  caseStudy: {
    role: "Full-Stack Developer",
    client: "",
    duration: "2024",
    background: "",
    solution: "",
    architecture: "",
    impact: "",
  },
};

// Project portfolio management tab
export default function AdminProjects({
  projects = [],
  onRefresh,
  info = {},
  onUpdateInfo,
}) {
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [badgesInput, setBadgesInput] = useState("");
  const [customCountInput, setCustomCountInput] = useState(
    info?.customProjectCount || ""
  );
  const [isSavingCount, setIsSavingCount] = useState(false);
  const [countFeedback, setCountFeedback] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reorder project item to a new position via drag and drop
  const handleMove = async (fromIdx, toIdx) => {
    if (fromIdx === toIdx || isReordering) return;
    const sorted = [...projects].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );
    const movedItem = sorted[fromIdx];
    if (!movedItem) return;

    const newOrder = [...sorted];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);

    setIsReordering(true);
    try {
      await reorderProjects(newOrder);
      setFeedback({
        type: "success",
        text: `Urutan disimpan: "${moved.title}" kini di posisi #${toIdx + 1}.`,
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal memperbarui urutan proyek.",
      });
    } finally {
      setIsReordering(false);
      setDraggedIdx(null);
      setDragOverIdx(null);
    }
  };

  const handleSaveCustomCount = async (e) => {
    e.preventDefault();
    setIsSavingCount(true);
    setCountFeedback(null);
    try {
      const updated = await saveSiteSettings(
        info?.rawId || "default-site-settings",
        {
          customProjectCount: customCountInput.trim(),
        }
      );
      if (onUpdateInfo) onUpdateInfo(updated);
      setCountFeedback({
        type: "success",
        text: "Jumlah statistik proyek digital berhasil disimpan.",
      });
    } catch (err) {
      setCountFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan jumlah proyek.",
      });
    } finally {
      setIsSavingCount(false);
    }
  };

  const handleEdit = (p) => {
    setEditingProject({
      ...p,
      caseStudy: p.caseStudy || { ...EMPTY_PROJECT.caseStudy },
    });
    setBadgesInput((p.badges || []).join(", "));
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreate = () => {
    const newId = `project-${Date.now()}`;
    setEditingProject({ ...EMPTY_PROJECT, id: newId, orderIndex: projects.length });
    setBadgesInput("React, Tailwind CSS");
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    try {
      await deleteProject(id);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus proyek.");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    e.target.value = "";
  };

  const handleCropConfirm = async (croppedFile, previewUrl) => {
    setCropFile(null);
    setUploadingImage(true);
    setFeedback(null);
    try {
      const fileName = `project-${Date.now()}-${(croppedFile?.name || "project.jpg").replace(/\s+/g, "-")}`;
      const url = await uploadStorageFile("media", fileName, croppedFile);
      const effectiveUrl = url || previewUrl;
      setEditingProject((prev) => ({ ...prev, image: effectiveUrl }));
      setFeedback({
        type: "success",
        text: "Gambar proyek berhasil disesuaikan dan diunggah.",
      });
    } catch {
      // Fallback preview for offline environments
      setEditingProject((prev) => ({ ...prev, image: previewUrl }));
      setFeedback({
        type: "success",
        text: "Gambar proyek berhasil disesuaikan dan dipratinjau.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      ...editingProject,
      badges: badgesInput
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    };

    try {
      await upsertProject(payload);
      setFeedback({
        type: "success",
        text: "Data proyek berhasil disimpan ke database.",
      });
      await onRefresh();
      setEditingProject(null);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data proyek.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    if (editingProject) {
    const isNew = !projects.some((p) => p.id === editingProject.id);
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
                setEditingProject(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2 mb-3 cursor-pointer"
            >
              <Icon name="arrow-left" size={16} />
              Kembali ke Daftar Proyek
            </button>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew
                ? "Tambah Proyek Baru"
                : `Edit Proyek: ${editingProject.title || "Tanpa Judul"}`}
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola detail karya, arsitektur solusi, teknologi, dan dokumentasi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProject(null);
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
              {editingProject.title
                ? `Edit: ${editingProject.title}`
                : "Tambah Proyek Baru"}
            </h3>
            <button
              onClick={() => { setEditingProject(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="neo-badge text-xs font-bold"
            >
              <Icon name="x" size={14} />
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  ID Proyek (Slug Unik)
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.id}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-mono text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      title: e.target.value,
                    })
                  }
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Kategori
                </label>
                <CustomSelect
                  value={editingProject.label}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      label: e.target.value,
                    })
                  }
                  options={[
                    { value: "Web App", label: "Web App" },
                    { value: "Mobile App", label: "Mobile App" },
                    { value: "UI/UX Design", label: "UI/UX Design" },
                    { value: "Data Analyst", label: "Data Analyst" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Status Publikasi
                </label>
                <CustomSelect
                  value={editingProject.status || "published"}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      status: e.target.value,
                    })
                  }
                  options={[
                    { value: "published", label: "Published" },
                    { value: "draft", label: "Draft" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={editingProject.orderIndex ?? 0}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      orderIndex: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        featured: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-2"
                  />
                  <span>Proyek Unggulan</span>
                </label>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                URL Gambar Mockup / Thumbnail
              </label>
              <div className="flex items-center gap-3">
                {editingProject.image ? (
                  <div
                    className="w-16 h-12 rounded-xl border-2 overflow-hidden shrink-0 flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                      boxShadow: "2px 2px 0 var(--shadow-color)",
                    }}
                  >
                    <img
                      src={editingProject.image}
                      alt="Pratinjau Mockup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-16 h-12 rounded-xl border-2 border-dashed shrink-0 flex items-center justify-center text-[var(--ink-secondary)]"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Icon name="briefcase" size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    required
                    value={editingProject.image}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-sm"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-1.5 px-3">
                  <Icon name="upload" size={14} />
                  {uploadingImage ? "Mengunggah..." : "Unggah Gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Problem solution impact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Masalah (Problem)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.problem}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      problem: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Solusi (Solution)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.solution}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      solution: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Dampak Terukur (Impact)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.impact}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      impact: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            {/* Tech badges and links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Badges Teknologi (Pisahkan Koma)
                </label>
                <input
                  type="text"
                  value={badgesInput}
                  onChange={(e) => setBadgesInput(e.target.value)}
                  placeholder="React, Tailwind CSS, Supabase, Midtrans"
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Tautan Demo / Live App (Opsional)
                </label>
                <input
                  type="url"
                  value={editingProject.demoUrl || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      demoUrl: e.target.value,
                    })
                  }
                  placeholder="https://app.domain.com"
                  className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            {/* Case study deep dive */}
            <div className="pt-4 border-t-2 space-y-4">
              <h4 className="text-sm font-extrabold font-mono uppercase">
                Detail Studi Kasus (Modal Interaktif)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    Peran Rekayasa
                  </label>
                  <input
                    type="text"
                    value={editingProject.caseStudy?.role || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...editingProject.caseStudy,
                          role: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    Klien / Mitra
                  </label>
                  <input
                    type="text"
                    value={editingProject.caseStudy?.client || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...editingProject.caseStudy,
                          client: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    Durasi Pengerjaan
                  </label>
                  <input
                    type="text"
                    value={editingProject.caseStudy?.duration || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        caseStudy: {
                          ...editingProject.caseStudy,
                          duration: e.target.value,
                        },
                      })
                    }
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
                  Arsitektur Solusi & Rekayasa Teknis
                </label>
                <textarea
                  rows={3}
                  value={editingProject.caseStudy?.architecture || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      caseStudy: {
                        ...editingProject.caseStudy,
                        architecture: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2">
              <button
                type="button"
                onClick={() => { setEditingProject(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="neo-btn-secondary text-sm font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-btn-primary text-sm font-bold"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Proyek"}
                <Icon name="check" size={16} />
              </button>
            </div>
          </form>
        </Card>

        {cropFile && (
          <ImageCropModal
            file={cropFile}
            aspectRatio={16 / 10}
            title="Sesuaikan Gambar Portofolio Proyek"
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
            Portofolio Proyek ({projects.length})
          </h2>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            Kelola karya, arsitektur solusi, dan dokumentasi studi kasus.
          </p>
        </div>

        <button
            onClick={handleCreate}
            className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
          >
            <Icon name="plus" size={16} />
            Tambah Proyek Baru
          </button>
      </div>

      {!editingProject && (
        <Card className="p-4 sm:p-5">
          <form
            onSubmit={handleSaveCustomCount}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border-2 border-[var(--border)] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--google-blue-bg)",
                  color: "var(--google-blue)",
                }}
              >
                <Icon name="folder" size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">
                  Kustomisasi Total Proyek Digital (By The Numbers)
                </h3>
                <p className="text-xs text-[var(--ink-secondary)]">
                  Atur angka total proyek pada kartu statistik web (misal &ldquo;15+&rdquo;) jika pernah mengerjakan lebih banyak dari daftar.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={customCountInput}
                onChange={(e) => setCustomCountInput(e.target.value)}
                placeholder={`${projects.length}+`}
                className="w-24 px-3 py-1.5 rounded-xl border-2 font-mono font-bold text-sm text-center"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              />
              <button
                type="submit"
                disabled={isSavingCount}
                className="neo-btn-primary text-xs font-bold py-2 px-3.5 cursor-pointer"
              >
                <Icon name="check" size={14} />
                {isSavingCount ? "Menyimpan..." : "Simpan Angka"}
              </button>
            </div>
          </form>

          {countFeedback && (
            <div
              className="mt-3 p-2.5 rounded-xl border-2 text-xs font-bold flex items-center gap-2"
              style={{
                backgroundColor:
                  countFeedback.type === "success"
                    ? "var(--google-green-bg)"
                    : "var(--google-red-bg)",
                borderColor:
                  countFeedback.type === "success"
                    ? "var(--google-green)"
                    : "var(--google-red)",
                color:
                  countFeedback.type === "success"
                    ? "var(--google-green-text)"
                    : "var(--google-red-text)",
              }}
            >
              <Icon
                name={countFeedback.type === "success" ? "check" : "alert"}
                size={14}
              />
              <span>{countFeedback.text}</span>
            </div>
          )}
        </Card>
      )}

      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Reorder hint and projects list */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <div
          className="text-xs font-mono font-medium flex items-center gap-1.5"
          style={{ color: "var(--ink-muted)" }}
        >
          <Icon name="info" size={14} />
          <span>Tarik kartu untuk mengatur urutan posisi tampilan proyek.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {(() => {
          const sortedProjects = [...projects].sort(
            (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
          );
          const maxPage = Math.max(1, Math.ceil(sortedProjects.length / pageSize));
          const effectivePage = Math.min(currentPage, maxPage);
          const paginatedProjects = sortedProjects.slice(
            (effectivePage - 1) * pageSize,
            effectivePage * pageSize
          );

          return paginatedProjects.map((p, localIdx) => {
            const absoluteIdx = (effectivePage - 1) * pageSize + localIdx;
            const isDragging = draggedIdx === absoluteIdx;
            const isOver = dragOverIdx === absoluteIdx;

            return (
              <div
                key={p.id}
                draggable={!isReordering}
                onDragStart={(e) => {
                  setDraggedIdx(absoluteIdx);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(absoluteIdx));
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverIdx !== absoluteIdx) setDragOverIdx(absoluteIdx);
                }}
                onDragLeave={() => {
                  if (dragOverIdx === absoluteIdx) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && draggedIdx !== absoluteIdx) {
                    handleMove(draggedIdx, absoluteIdx);
                  }
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                  isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"
                }`}
              >
                <Card
                  className={`p-5 h-full flex flex-col justify-between transition-all relative ${
                    isOver
                      ? "ring-4 ring-[var(--google-blue)] border-[var(--google-blue)] shadow-[0_0_15px_rgba(26,115,232,0.25)]"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="neo-badge text-[11px] font-mono font-extrabold px-2 py-0.5"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                          }}
                        >
                          #{absoluteIdx + 1}
                        </span>
                        <Chip
                          variant={
                            p.label === "Web App"
                              ? "blue"
                              : p.label === "Mobile App"
                              ? "yellow"
                              : p.label === "UI/UX Design"
                              ? "red"
                              : "green"
                          }
                        >
                          {p.label}
                        </Chip>
                        {p.featured && <Chip variant="blue">Unggulan</Chip>}
                      </div>
                      <span
                        className="text-xs font-mono font-bold"
                        style={{
                          color:
                            p.status === "draft"
                              ? "var(--google-red)"
                              : "var(--google-green)",
                        }}
                      >
                        {p.status || "published"}
                      </span>
                    </div>

                    <h4
                      className="font-extrabold text-base sm:text-lg mb-2"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </h4>

                    <p
                      className="text-xs sm:text-sm line-clamp-2 mb-4"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      {p.solution}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 flex items-center justify-between">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      ID: {p.id}
                    </span>
                    <div
                      className="flex items-center gap-2"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="neo-btn-secondary text-xs font-bold py-1.5 px-2.5 cursor-pointer"
                      >
                        <Icon name="edit" size={13} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="neo-badge text-xs font-bold py-1.5 px-2.5 cursor-pointer"
                        style={{
                          backgroundColor: "var(--google-red-bg)",
                          color: "var(--google-red-text)",
                          borderColor: "var(--google-red)",
                        }}
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          });
        })()}
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={projects.length}
        pageSize={pageSize}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 300, behavior: "smooth" });
        }}
        itemLabel="proyek"
      />

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspectRatio={16 / 10}
          title="Sesuaikan Gambar Portofolio Proyek"
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
    </div>
  );
}
