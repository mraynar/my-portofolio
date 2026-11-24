import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import {
  upsertProject,
  deleteProject,
  uploadStorageFile,
  saveSiteSettings,
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
  const [badgesInput, setBadgesInput] = useState("");
  const [customCountInput, setCustomCountInput] = useState(
    info?.customProjectCount || ""
  );
  const [isSavingCount, setIsSavingCount] = useState(false);
  const [countFeedback, setCountFeedback] = useState(null);

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
  };

  const handleCreate = () => {
    const newId = `project-${Date.now()}`;
    setEditingProject({ ...EMPTY_PROJECT, id: newId, orderIndex: projects.length });
    setBadgesInput("React, Tailwind CSS");
    setFeedback(null);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setFeedback(null);
    try {
      const fileName = `project-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const url = await uploadStorageFile("media", fileName, file);
      setEditingProject((prev) => ({ ...prev, image: url }));
      setFeedback({
        type: "success",
        text: "Gambar proyek berhasil diunggah.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal mengunggah gambar proyek.",
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

        {!editingProject && (
          <button
            onClick={handleCreate}
            className="neo-btn-primary font-bold text-xs sm:text-sm self-start sm:self-auto"
          >
            <Icon name="plus" size={16} />
            Tambah Proyek Baru
          </button>
        )}
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

      {/* Editing or creation form */}
      {editingProject && (
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
              onClick={() => setEditingProject(null)}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-mono text-sm"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
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
                <select
                  value={editingProject.label}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      label: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                >
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                  Status Publikasi
                </label>
                <select
                  value={editingProject.status || "published"}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                  }}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
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
              <div className="flex gap-2">
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
                  {uploadingImage ? "Mengunggah..." : "Unggah Gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
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
                onClick={() => setEditingProject(null)}
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
      )}

      {/* Projects list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2">
                <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="neo-btn-secondary text-xs font-bold py-1.5 px-2.5"
                >
                  <Icon name="edit" size={13} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="neo-badge text-xs font-bold py-1.5 px-2.5"
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
        ))}
      </div>
    </div>
  );
}
