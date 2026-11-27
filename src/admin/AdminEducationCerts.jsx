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
import AdminSectionHeaderEditor from "./AdminSectionHeaderEditor";
import BulkActionBar, { SelectCheckbox } from "./BulkActionBar";
import {
  upsertEducation,
  deleteEducation,
  deleteEducationBulk,
  upsertCertification,
  deleteCertification,
  deleteCertificationsBulk,
  reorderCertifications,
  purgeLegacyStaticCertifications,
  LEGACY_STATIC_CERT_IDS,
  uploadStorageFile,
} from "../lib/supabase";

// Built-in provider presets for quick selection alongside custom input
const PROVIDER_PRESETS = ["Coursera", "Dicoding", "Udemy", "Karirnex", "AWS"];
const CUSTOM_PROVIDER_VALUE = "__custom__";

// Education and certifications management tab
export default function AdminEducationCerts({
  education = [],
  certifications = [],
  onRefresh,
  info,
  onUpdateInfo,
  onSaveComplete,
}) {
  const [activeSubTab, setActiveSubTab] = useState("education");
  const [editingEdu, setEditingEdu] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [isCustomProvider, setIsCustomProvider] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [uploadingCertImg, setUploadingCertImg] = useState(false);
  const [previewCertImg, setPreviewCertImg] = useState(null);
  const certFileInputRef = useRef(null);
  const [eduPage, setEduPage] = useState(1);
  const [certPage, setCertPage] = useState(1);
  const [selectedEduIds, setSelectedEduIds] = useState([]);
  const [selectedCertIds, setSelectedCertIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [draggedCertIdx, setDraggedCertIdx] = useState(null);
  const [dragOverCertIdx, setDragOverCertIdx] = useState(null);
  const [isReorderingCerts, setIsReorderingCerts] = useState(false);
  const [certTargetPosition, setCertTargetPosition] = useState(1);
  const eduPageSize = 4;
  const certPageSize = 6;

  const sortedCerts = useMemo(
    () =>
      [...certifications].sort(
        (a, b) =>
          (a.orderIndex ?? a.order_index ?? 0) -
          (b.orderIndex ?? b.order_index ?? 0)
      ),
    [certifications]
  );

  // Build position options for certification add/edit dropdown
  const certPositionOptions = useMemo(() => {
    if (!editingCert) return [];
    const isNew = !sortedCerts.some(
      (c) =>
        (editingCert.id && c.id === editingCert.id) ||
        (editingCert.credentialId &&
          c.credentialId === editingCert.credentialId)
    );
    const totalSlots = isNew
      ? sortedCerts.length + 1
      : Math.max(sortedCerts.length, 1);
    const currentIdx = sortedCerts.findIndex(
      (c) =>
        (editingCert.id && c.id === editingCert.id) ||
        (editingCert.credentialId &&
          c.credentialId === editingCert.credentialId)
    );

    const options = [];
    for (let pos = 1; pos <= totalSlots; pos++) {
      let label = `Posisi #${pos}`;
      const existing = sortedCerts[pos - 1];
      if (isNew) {
        if (pos === totalSlots) {
          label += " (Posisi Terakhir / Baru)";
        } else if (existing?.title) {
          label += ` (Sebelum: ${existing.title})`;
        }
      } else if (pos - 1 === currentIdx) {
        label += " (Posisi Saat Ini)";
      } else if (existing?.title) {
        label += ` (Tukar dengan: ${existing.title})`;
      }
      options.push({ value: String(pos), label });
    }
    return options;
  }, [editingCert, sortedCerts]);

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await upsertEducation(editingEdu);
      setFeedback({
        type: "success",
        text: "Data pendidikan berhasil disimpan.",
      });
      await onRefresh();
      setEditingEdu(null);
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data pendidikan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const cleanedProvider = String(editingCert.provider || "").trim();
      const targetPos = Math.max(1, parseInt(certTargetPosition, 10) || 1);
      const saved = await upsertCertification({
        ...editingCert,
        provider: cleanedProvider || "Lainnya",
        orderIndex: targetPos,
      });

      // Place saved certification at chosen position and persist full order
      const withoutSaved = sortedCerts.filter(
        (c) =>
          c.id !== saved.id &&
          !(editingCert.id && c.id === editingCert.id)
      );
      const insertIdx = Math.min(Math.max(0, targetPos - 1), withoutSaved.length);
      const reordered = [...withoutSaved];
      reordered.splice(insertIdx, 0, saved);
      await reorderCertifications(reordered);

      setFeedback({
        type: "success",
        text: `Data sertifikasi berhasil disimpan di posisi #${insertIdx + 1}.`,
      });
      await onRefresh();
      setEditingCert(null);
      setIsCustomProvider(false);
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data sertifikasi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reorder certification cards via drag and drop
  const handleMoveCert = async (fromIdx, toIdx) => {
    if (fromIdx === toIdx || isReorderingCerts) return;
    const itemA = sortedCerts[fromIdx];
    const itemB = sortedCerts[toIdx];
    if (!itemA || !itemB) return;

    const nextOrder = [...sortedCerts];
    const [moved] = nextOrder.splice(fromIdx, 1);
    nextOrder.splice(toIdx, 0, moved);

    setIsReorderingCerts(true);
    setFeedback(null);
    try {
      await reorderCertifications(nextOrder);
      setFeedback({
        type: "success",
        text: `Urutan disimpan: ${moved.title} kini di posisi #${toIdx + 1}.`,
      });
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal memperbarui urutan sertifikasi.",
      });
    } finally {
      setIsReorderingCerts(false);
      setDraggedCertIdx(null);
      setDragOverCertIdx(null);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm("Hapus data pendidikan ini?")) return;
    try {
      await deleteEducation(id);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus data pendidikan.");
    }
  };

  const handleDeleteCert = async (identifier) => {
    if (!window.confirm("Hapus sertifikasi ini?")) return;
    try {
      await deleteCertification(identifier);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus sertifikasi.");
    }
  };

  const legacyStaticCertCount = certifications.filter((c) =>
    LEGACY_STATIC_CERT_IDS.includes(c.credentialId)
  ).length;

  const getEduKey = (edu) => edu.id || edu.school;
  const getCertKey = (c) => c.id || c.credentialId || c.title;

  const validSelectedEdu = selectedEduIds.filter((id) =>
    education.some((e) => getEduKey(e) === id)
  );
  const validSelectedCert = selectedCertIds.filter((id) =>
    certifications.some((c) => getCertKey(c) === id)
  );

  const toggleSelectEdu = (key) => {
    setSelectedEduIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const toggleSelectCert = (key) => {
    setSelectedCertIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };

  const handleBulkDeleteEdu = async () => {
    if (validSelectedEdu.length === 0) return;
    if (
      !window.confirm(
        `Hapus ${validSelectedEdu.length} data pendidikan yang dipilih secara permanen?`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    setFeedback(null);
    try {
      const removed = await deleteEducationBulk(validSelectedEdu);
      setSelectedEduIds([]);
      await onRefresh();
      setEduPage(1);
      setFeedback({
        type: "success",
        text: `${removed} data pendidikan berhasil dihapus.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus data pendidikan terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkDeleteCerts = async () => {
    if (validSelectedCert.length === 0) return;
    if (
      !window.confirm(
        `Hapus ${validSelectedCert.length} sertifikasi yang dipilih secara permanen?`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    setFeedback(null);
    try {
      const removed = await deleteCertificationsBulk(validSelectedCert);
      setSelectedCertIds([]);
      await onRefresh();
      setCertPage(1);
      setFeedback({
        type: "success",
        text: `${removed} sertifikasi berhasil dihapus.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus sertifikasi terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handlePurgeLegacyCerts = async () => {
    if (
      !window.confirm(
        `Hapus ${legacyStaticCertCount} data sertifikasi statis/lama? Sertifikasi baru milik Anda tetap aman.`
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const removed = await purgeLegacyStaticCertifications();
      await onRefresh();
      setCertPage(1);
      setFeedback({
        type: "success",
        text: `${removed} data sertifikasi lama berhasil dihapus permanen.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus data sertifikasi lama.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCertImg(true);
    setFeedback(null);
    try {
      const cleanName = (file.name || "cert.jpg").replace(
        /[^a-zA-Z0-9._-]/g,
        ""
      );
      const path = `certificates/${Date.now()}-${cleanName}`;
      const url = await uploadStorageFile("media", path, file);
      if (url) {
        setEditingCert((prev) => ({ ...prev, image: url }));
        setFeedback({
          type: "success",
          text: "Gambar sertifikat berhasil diunggah.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal mengunggah gambar sertifikat.",
      });
    } finally {
      setUploadingCertImg(false);
      if (certFileInputRef.current) certFileInputRef.current.value = "";
    }
  };

    if (editingEdu) {
    const isNew = !education.some((e) => e.id === editingEdu.id);
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
                setEditingEdu(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2 mb-3 cursor-pointer"
            >
              <Icon name="arrow-left" size={16} />
              Kembali ke Riwayat Pendidikan
            </button>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew
                ? "Tambah Riwayat Pendidikan"
                : `Edit Pendidikan: ${editingEdu.school || "Tanpa Nama"}`}
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola institusi pendidikan, gelar akademik, periode, dan fokus konsentrasi studi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingEdu(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="neo-badge text-xs font-bold self-start sm:self-center cursor-pointer"
          >
            <Icon name="x" size={14} />
            Batal
          </button>
        </div>

        <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

        <Card className="p-6 space-y-4">
              <h4 className="font-extrabold text-base pb-3 border-b-2">
                {editingEdu.school ? `Edit: ${editingEdu.school}` : "Pendidikan Baru"}
              </h4>
              <form onSubmit={handleEduSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Institusi / Sekolah
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEdu.school}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, school: e.target.value })
                      }
                      placeholder="UPN Veteran Jawa Timur"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Gelar / Jurusan
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEdu.degree}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, degree: e.target.value })
                      }
                      placeholder="S1 Sistem Informasi"
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
                      Periode
                    </label>
                    <input
                      type="text"
                      required
                      value={editingEdu.period}
                      onChange={(e) =>
                        setEditingEdu({ ...editingEdu, period: e.target.value })
                      }
                      placeholder="2024 - Sekarang"
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
                        checked={editingEdu.active}
                        onChange={(e) =>
                          setEditingEdu({
                            ...editingEdu,
                            active: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-2"
                      />
                      <span>Status Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Label Nilai / IPK
                    </label>
                    <input
                      type="text"
                      value={editingEdu.scoreLabel || ""}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          scoreLabel: e.target.value,
                        })
                      }
                      placeholder="IPK atau Nilai Akhir"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
                      Contoh: IPK, Nilai Akhir, Rata-rata Ujian.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Nilai / Skor IPK
                    </label>
                    <input
                      type="text"
                      value={editingEdu.score || ""}
                      onChange={(e) =>
                        setEditingEdu({
                          ...editingEdu,
                          score: e.target.value,
                        })
                      }
                      placeholder="3.84 / 4.00 atau 91.2 / 100"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm font-mono"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                    <span className="text-[11px] text-[var(--ink-secondary)] block mt-1">
                      Contoh: 3.84 / 4.00 atau 91.2.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    Fokus Pembelajaran
                  </label>
                  <textarea
                    rows={2}
                    value={editingEdu.focus}
                    onChange={(e) =>
                      setEditingEdu({ ...editingEdu, focus: e.target.value })
                    }
                    placeholder="Fokus pada rekayasa perangkat lunak, arsitektur basis data..."
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm resize-y"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-3 border-t-2">
                  <button
                    type="button"
                    onClick={() => { setEditingEdu(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="neo-btn-secondary text-sm font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neo-btn-primary text-sm font-bold"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                  </button>
                </div>
              </form>
            </Card>
      </div>
    );
  }

  if (editingCert) {
    const isNew = !certifications.some((c) => c.id === editingCert.id);
    const showCustomProviderInput =
      isCustomProvider || !PROVIDER_PRESETS.includes(editingCert.provider || "");
    const selectProviderValue = showCustomProviderInput
      ? CUSTOM_PROVIDER_VALUE
      : editingCert.provider;
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
                setEditingCert(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2 mb-3 cursor-pointer"
            >
              <Icon name="arrow-left" size={16} />
              Kembali ke Daftar Sertifikasi
            </button>
            <h2
              className="text-xl sm:text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {isNew
                ? "Tambah Sertifikasi Baru"
                : `Edit Sertifikasi: ${editingCert.title || "Tanpa Judul"}`}
            </h2>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola sertifikasi profesional, lembaga penerbit, platform, dan tautan verifikasi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCert(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="neo-badge text-xs font-bold self-start sm:self-center cursor-pointer"
          >
            <Icon name="x" size={14} />
            Batal
          </button>
        </div>

        <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

        <Card className="p-6 space-y-4">
              <h4 className="font-extrabold text-base pb-3 border-b-2">
                {editingCert.title ? `Edit: ${editingCert.title}` : "Sertifikasi Baru"}
              </h4>
              <form onSubmit={handleCertSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Nama Sertifikasi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCert.title}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          title: e.target.value,
                        })
                      }
                      placeholder="IBM Full Stack Software Developer"
                      className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Penerbit Resmi
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCert.issuer}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          issuer: e.target.value,
                        })
                      }
                      placeholder="IBM / AWS / Dicoding"
                      className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
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
                      Platform Provider
                    </label>
                    <CustomSelect
                      value={selectProviderValue}
                      onChange={(e) => {
                        const picked = e.target.value;
                        if (picked === CUSTOM_PROVIDER_VALUE) {
                          setIsCustomProvider(true);
                          const currentVal = editingCert.provider || "";
                          const resetVal =
                            PROVIDER_PRESETS.includes(currentVal) ||
                            currentVal === "Lainnya"
                              ? ""
                              : currentVal;
                          setEditingCert({
                            ...editingCert,
                            provider: resetVal,
                          });
                        } else {
                          setIsCustomProvider(false);
                          setEditingCert({
                            ...editingCert,
                            provider: picked,
                          });
                        }
                      }}
                      options={[
                        ...PROVIDER_PRESETS.map((p) => ({
                          value: p,
                          label: p,
                        })),
                        {
                          value: CUSTOM_PROVIDER_VALUE,
                          label: "Lainnya (Ketik Sendiri)",
                        },
                      ]}
                    />
                    {showCustomProviderInput && (
                      <input
                        type="text"
                        required
                        value={
                          editingCert.provider === "Lainnya"
                            ? ""
                            : editingCert.provider || ""
                        }
                        onChange={(e) =>
                          setEditingCert({
                            ...editingCert,
                            provider: e.target.value,
                          })
                        }
                        placeholder="Ketik nama platform (mis. Hacktiv8, DQLab, IBM)..."
                        className="mt-2 w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                        style={{
                          backgroundColor: "var(--surface-alt)",
                          borderColor: "var(--google-blue)",
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      value={editingCert.credentialId}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          credentialId: e.target.value,
                        })
                      }
                      placeholder="ID Kredensial"
                      className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-mono text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                      Bulan & Tahun
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCert.date}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, date: e.target.value })
                      }
                      placeholder="Nov 2024"
                      className="w-full h-[46px] px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm shadow-[2px_2px_0_var(--shadow-color)]"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>
                </div>

                {/* Display position selector dropdown */}
                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    Urutan Posisi Tampilan
                  </label>
                  <CustomSelect
                    value={String(certTargetPosition)}
                    onChange={(e) =>
                      setCertTargetPosition(parseInt(e.target.value, 10) || 1)
                    }
                    options={certPositionOptions}
                    ariaLabel="Pilih urutan posisi tampilan sertifikasi"
                  />
                  <span
                    className="text-[11px] block mt-1"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    Tentukan nomor urut tampil sertifikat di halaman publik dan daftar admin.
                  </span>
                </div>

                {/* Certificate image upload & uncropped preview */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold font-mono uppercase">
                    Gambar Sertifikat (Tidak Ke-Crop / Rasio Asli)
                  </label>
                  {editingCert.image ? (
                    <div className="space-y-2">
                      <div
                        className="relative max-w-sm aspect-[4/3] rounded-xl border-2 border-[var(--border)] overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: "var(--surface-alt)" }}
                      >
                        <img
                          src={editingCert.image}
                          alt="Pratinjau Sertifikat"
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewCertImg(editingCert.image)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg border-2 border-[var(--border)] bg-[var(--surface)] shadow-[2px_2px_0_var(--shadow-color)] cursor-pointer"
                          title="Lihat Pratinjau Penuh"
                        >
                          <Icon name="zoom-in" size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-1.5 px-3 inline-flex items-center gap-1.5">
                          <Icon name="upload" size={14} />
                          {uploadingCertImg ? "Mengunggah..." : "Ganti Gambar"}
                          <input
                            ref={certFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCertImageSelect}
                            disabled={uploadingCertImg}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingCert((prev) => ({ ...prev, image: "" }))}
                          className="neo-badge text-xs font-bold py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: "var(--google-red-bg)",
                            color: "var(--google-red-text)",
                            borderColor: "var(--google-red)",
                          }}
                        >
                          <Icon name="trash" size={14} />
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="neo-btn-secondary text-xs font-bold cursor-pointer py-2 px-4 inline-flex items-center gap-1.5">
                          <Icon name="upload" size={14} />
                          {uploadingCertImg ? "Mengunggah..." : "Unggah Gambar Sertifikat"}
                          <input
                            ref={certFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCertImageSelect}
                            disabled={uploadingCertImg}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-xs" style={{ color: "var(--ink-secondary)" }}>
                        Format JPG, PNG, atau WEBP. Gambar ditampilkan utuh tanpa terpotong.
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold font-mono uppercase mb-1">
                      Atau Masukkan URL Gambar Langsung
                    </label>
                    <input
                      type="url"
                      value={editingCert.image || ""}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, image: e.target.value })
                      }
                      placeholder="https://example.com/certificate.jpg"
                      className="w-full px-3.5 py-2 rounded-xl border-2 font-medium text-xs"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase mb-1.5">
                    URL Verifikasi Kredensial
                  </label>
                  <input
                    type="url"
                    value={editingCert.credentialUrl || ""}
                    onChange={(e) =>
                      setEditingCert({
                        ...editingCert,
                        credentialUrl: e.target.value,
                      })
                    }
                    placeholder="https://coursera.org/verify/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                    style={{
                      backgroundColor: "var(--surface-alt)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-3 border-t-2">
                  <button
                    type="button"
                    onClick={() => { setEditingCert(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="neo-btn-secondary text-sm font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="neo-btn-primary text-sm font-bold"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Sertifikasi"}
                  </button>
                </div>
              </form>
            </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Sub-tab navigation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-4 border-b-2">
        <button
          onClick={() => {
            setActiveSubTab("education");
            setSelectedCertIds([]);
            setFeedback(null);
          }}
          className="neo-badge text-xs sm:text-sm font-bold cursor-pointer"
          style={{
            backgroundColor:
              activeSubTab === "education"
                ? "var(--google-blue)"
                : "var(--surface-alt)",
            color: activeSubTab === "education" ? "#ffffff" : "var(--ink)",
            borderColor: "var(--border)",
          }}
        >
          Pendidikan Formal ({education.length})
        </button>

        <button
          onClick={() => {
            setActiveSubTab("certifications");
            setSelectedEduIds([]);
            setFeedback(null);
          }}
          className="neo-badge text-xs sm:text-sm font-bold cursor-pointer"
          style={{
            backgroundColor:
              activeSubTab === "certifications"
                ? "var(--google-blue)"
                : "var(--surface-alt)",
            color: activeSubTab === "certifications" ? "#ffffff" : "var(--ink)",
            borderColor: "var(--border)",
          }}
        >
          Sertifikasi Resmi ({certifications.length})
        </button>
      </div>

      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Education tab view */}
      {activeSubTab === "education" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Riwayat Pendidikan Formal
            </h3>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setEditingEdu({
                  school: "",
                  degree: "",
                  period: "",
                  focus: "",
                  active: false,
                  score: "",
                  scoreLabel: "",
                  order_index: education.length,
                });
              }}
              className="neo-btn-primary font-bold text-xs sm:text-sm"
            >
                <Icon name="plus" size={15} />
                Tambah Pendidikan
              </button>
          </div>

          <BulkActionBar
            totalCount={education.length}
            selectedCount={validSelectedEdu.length}
            allSelected={
              education.length > 0 &&
              validSelectedEdu.length === education.length
            }
            onToggleSelectAll={() =>
              setSelectedEduIds(
                validSelectedEdu.length === education.length
                  ? []
                  : education.map(getEduKey)
              )
            }
            onClearSelection={() => setSelectedEduIds([])}
            onBulkDelete={handleBulkDeleteEdu}
            isDeleting={isBulkDeleting}
            itemLabel="pendidikan"
          />

          {education.length === 0 ? (
            <Card className="p-8 text-center space-y-2">
              <div
                className="w-12 h-12 rounded-xl border-2 mx-auto flex items-center justify-center"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                  color: "var(--google-blue)",
                }}
              >
                <Icon name="education" size={22} />
              </div>
              <p className="font-bold text-sm">
                Belum ada riwayat pendidikan yang tersimpan.
              </p>
              <p className="text-xs" style={{ color: "var(--ink-secondary)" }}>
                Klik Tambah Pendidikan untuk menambahkan riwayat akademik.
              </p>
            </Card>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {(() => {
              const maxEduPage = Math.max(1, Math.ceil(education.length / eduPageSize));
              const effectiveEduPage = Math.min(eduPage, maxEduPage);
              const paginatedEdu = education.slice(
                (effectiveEduPage - 1) * eduPageSize,
                effectiveEduPage * eduPageSize
              );

              return paginatedEdu.map((edu, idx) => {
                const eduKey = getEduKey(edu);
                const isSelected = validSelectedEdu.includes(eduKey);
                return (
                <Card
                  key={edu.id || edu.school + idx}
                  className={`p-4 sm:p-5 transition-all overflow-hidden ${
                    isSelected ? "ring-2 ring-[var(--google-blue)]" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b-2">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <SelectCheckbox
                        checked={isSelected}
                        onChange={() => toggleSelectEdu(eduKey)}
                        ariaLabel={`Pilih ${edu.school}`}
                      />
                      <span className="text-xs font-mono font-bold">
                        {edu.period}
                      </span>
                      {edu.active && <Chip variant="green">Aktif</Chip>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Edit pendidikan"
                        onClick={() => {
                          setEditingEdu(edu);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="neo-btn-secondary text-xs font-bold py-1 px-2.5"
                      >
                        <Icon name="edit" size={13} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Hapus ${edu.school}`}
                        onClick={() => handleDeleteEdu(eduKey)}
                        className="neo-badge text-xs font-bold py-1 px-2.5 cursor-pointer"
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
                  <h4
                    className="font-extrabold text-base sm:text-lg"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {edu.degree}
                  </h4>
                  <div
                    className="text-xs sm:text-sm font-bold mb-1"
                    style={{ color: "var(--google-blue)" }}
                  >
                    {edu.school}
                  </div>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {edu.focus}
                  </p>
                  {(edu.score || edu.ipk) && (
                    <div className="mt-2.5 pt-2 border-t flex items-center gap-1.5 text-xs font-mono font-bold">
                      <span className="text-[var(--ink-muted)]">
                        {edu.scoreLabel || "Nilai / IPK"}:
                      </span>
                      <span className="text-[var(--google-blue)] font-extrabold">
                        {edu.score || edu.ipk}
                      </span>
                    </div>
                  )}
                </Card>
                );
              });
            })()}
          </div>
          )}

          <Pagination
            currentPage={eduPage}
            totalItems={education.length}
            pageSize={eduPageSize}
            onPageChange={(page) => {
              setEduPage(page);
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            itemLabel="pendidikan"
          />
        </div>
      )}

      {/* Certifications tab view */}
      {activeSubTab === "certifications" && (
        <div className="space-y-6">
          <AdminSectionHeaderEditor
            sectionKey="certs"
            sectionName="Sertifikasi & Lisensi"
            fields={{
              kicker: "certsKicker",
              title: "certsTitle",
              titleAccent: "certsTitleAccent",
              subtitle: "certsSubtitle",
            }}
            defaultValues={{
              kicker: "KREDENSIAL PROFESIONAL",
              title: "Sertifikasi &",
              titleAccent: "Lisensi",
              subtitle:
                "Sertifikasi resmi kompetensi teknis dari platform pembelajaran dan industri global.",
            }}
            info={info}
            onUpdateInfo={onUpdateInfo}
            onSaveComplete={onSaveComplete}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sertifikasi & Kredensial Resmi
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {legacyStaticCertCount > 0 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePurgeLegacyCerts}
                  className="neo-badge text-xs sm:text-sm font-bold py-2 px-3 cursor-pointer inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--google-red-bg)",
                    color: "var(--google-red-text)",
                    borderColor: "var(--google-red)",
                  }}
                >
                  <Icon name="trash" size={14} />
                  Hapus Sertifikasi Lama ({legacyStaticCertCount})
                </button>
              )}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsCustomProvider(false);
                  setCertTargetPosition(sortedCerts.length + 1);
                  setEditingCert({
                    title: "",
                    issuer: "",
                    provider: "Coursera",
                    credentialId: "",
                    credentialUrl: "",
                    date: String(new Date().getFullYear()),
                    orderIndex: sortedCerts.length + 1,
                    image: "",
                  });
                }}
                className="neo-btn-primary font-bold text-xs sm:text-sm"
              >
                <Icon name="plus" size={15} />
                Tambah Sertifikasi
              </button>
            </div>
          </div>

          {sortedCerts.length > 1 && (
            <div
              className="text-xs font-mono font-medium flex items-center gap-1.5"
              style={{ color: "var(--ink-muted)" }}
            >
              <Icon name="info" size={14} />
              <span>Tarik kartu untuk mengatur urutan posisi tampilan sertifikasi.</span>
            </div>
          )}

          <BulkActionBar
            totalCount={sortedCerts.length}
            selectedCount={validSelectedCert.length}
            allSelected={
              sortedCerts.length > 0 &&
              validSelectedCert.length === sortedCerts.length
            }
            onToggleSelectAll={() =>
              setSelectedCertIds(
                validSelectedCert.length === sortedCerts.length
                  ? []
                  : sortedCerts.map(getCertKey)
              )
            }
            onClearSelection={() => setSelectedCertIds([])}
            onBulkDelete={handleBulkDeleteCerts}
            isDeleting={isBulkDeleting}
            itemLabel="sertifikasi"
          />

          {sortedCerts.length === 0 ? (
            <Card className="p-8 text-center space-y-2">
              <div
                className="w-12 h-12 rounded-xl border-2 mx-auto flex items-center justify-center"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                  color: "var(--google-blue)",
                }}
              >
                <Icon name="award" size={22} />
              </div>
              <p className="font-bold text-sm">
                Belum ada sertifikasi yang tersimpan.
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--ink-secondary)" }}
              >
                Klik Tambah Sertifikasi untuk menambahkan kredensial baru secara dinamis.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {(() => {
              const maxCertPage = Math.max(1, Math.ceil(sortedCerts.length / certPageSize));
              const effectiveCertPage = Math.min(certPage, maxCertPage);
              const paginatedCerts = sortedCerts.slice(
                (effectiveCertPage - 1) * certPageSize,
                effectiveCertPage * certPageSize
              );

              return paginatedCerts.map((c, localIdx) => {
                const absoluteIdx =
                  (effectiveCertPage - 1) * certPageSize + localIdx;
                const certKey = getCertKey(c);
                const isSelected = validSelectedCert.includes(certKey);
                const isDragging = draggedCertIdx === absoluteIdx;
                const isOver = dragOverCertIdx === absoluteIdx;
                return (
                <div
                  key={c.id || c.credentialId || absoluteIdx}
                  draggable={!isReorderingCerts}
                  onDragStart={(e) => {
                    setDraggedCertIdx(absoluteIdx);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(absoluteIdx));
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverCertIdx !== absoluteIdx) {
                      setDragOverCertIdx(absoluteIdx);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverCertIdx === absoluteIdx) {
                      setDragOverCertIdx(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (
                      draggedCertIdx !== null &&
                      draggedCertIdx !== absoluteIdx
                    ) {
                      handleMoveCert(draggedCertIdx, absoluteIdx);
                    }
                  }}
                  onDragEnd={() => {
                    setDraggedCertIdx(null);
                    setDragOverCertIdx(null);
                  }}
                  className={`transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                    isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"
                  }`}
                >
                <Card
                  className={`p-4 h-full flex flex-col justify-between transition-all overflow-hidden min-w-0 ${
                    isOver
                      ? "ring-4 ring-[var(--google-blue)] border-[var(--google-blue)] shadow-[0_0_15px_rgba(26,115,232,0.25)]"
                      : isSelected
                      ? "ring-2 ring-[var(--google-blue)]"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <SelectCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelectCert(certKey)}
                          ariaLabel={`Pilih ${c.title}`}
                        />
                        <span
                          className="neo-badge text-[11px] font-mono font-extrabold px-2 py-0.5 shrink-0"
                          style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                          }}
                        >
                          #{absoluteIdx + 1}
                        </span>
                        <Chip variant="blue" className="min-w-0">
                          <span className="truncate" title={c.issuer || c.provider}>
                            {c.issuer || c.provider}
                          </span>
                        </Chip>
                      </div>
                      <span className="text-xs font-mono font-bold shrink-0">
                        {c.date}
                      </span>
                    </div>

                    {c.image && (
                      <div
                        className="relative w-full aspect-[16/10] rounded-lg border-2 overflow-hidden mb-2.5 flex items-center justify-center cursor-pointer group"
                        style={{
                          backgroundColor: "var(--surface-alt)",
                          borderColor: "var(--border)",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => setPreviewCertImg(c.image)}
                      >
                        <img
                          src={c.image}
                          alt={c.title}
                          className="w-full h-full object-contain p-1"
                        />
                        <span className="absolute top-1.5 right-1.5 p-1 rounded bg-[var(--surface)]/90 border shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="zoom-in" size={12} />
                        </span>
                      </div>
                    )}
                    <h4
                      className="font-extrabold text-sm sm:text-base line-clamp-2 mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {c.title}
                    </h4>
                    <div
                      className="text-xs font-bold mb-2"
                      style={{ color: "var(--ink-secondary)" }}
                    >
                      Platform: {c.provider}
                    </div>
                  </div>

                  <div className="pt-2 border-t-2 flex items-center justify-between gap-2 min-w-0">
                    <span
                      className="text-xs font-mono truncate min-w-0 flex-1"
                      style={{ color: "var(--ink-muted)" }}
                      title={c.credentialId}
                    >
                      {c.credentialId}
                    </span>
                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        aria-label="Edit sertifikasi"
                        onClick={() => {
                          setIsCustomProvider(
                            !PROVIDER_PRESETS.includes(c.provider || "")
                          );
                          setCertTargetPosition(absoluteIdx + 1);
                          setEditingCert(c);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="neo-btn-secondary text-xs font-bold py-1 px-2 cursor-pointer"
                      >
                        <Icon name="edit" size={12} />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus sertifikasi"
                        onClick={() => handleDeleteCert(certKey)}
                        className="neo-badge text-xs font-bold py-1 px-2 cursor-pointer"
                        style={{
                          backgroundColor: "var(--google-red-bg)",
                          color: "var(--google-red-text)",
                          borderColor: "var(--google-red)",
                        }}
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </div>
                </Card>
                </div>
                );
              });
            })()}
          </div>
          )}

          <Pagination
            currentPage={certPage}
            totalItems={certifications.length}
            pageSize={certPageSize}
            onPageChange={(page) => {
              setCertPage(page);
              window.scrollTo({ top: 300, behavior: "smooth" });
            }}
            itemLabel="sertifikasi"
          />
        </div>
      )}

      {/* Lightbox preview for certificate images */}
      <ImageLightboxModal
        isOpen={Boolean(previewCertImg)}
        imageUrl={previewCertImg}
        title="Pratinjau Sertifikat"
        alt="Sertifikat"
        onClose={() => setPreviewCertImg(null)}
      />
    </div>
  );
}
