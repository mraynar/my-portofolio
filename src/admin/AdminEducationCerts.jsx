import { useState } from "react";
import { Card, Chip, Icon } from "../components";
import {
  upsertEducation,
  deleteEducation,
  upsertCertification,
  deleteCertification,
} from "../lib/supabase";

// Education and certifications management tab
export default function AdminEducationCerts({
  education = [],
  certifications = [],
  onRefresh,
}) {
  const [activeSubTab, setActiveSubTab] = useState("education");
  const [editingEdu, setEditingEdu] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
      await upsertCertification(editingCert);
      setFeedback({
        type: "success",
        text: "Data sertifikasi berhasil disimpan.",
      });
      await onRefresh();
      setEditingCert(null);
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menyimpan data sertifikasi.",
      });
    } finally {
      setIsSubmitting(false);
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

  const handleDeleteCert = async (id) => {
    if (!window.confirm("Hapus sertifikasi ini?")) return;
    try {
      await deleteCertification(id);
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus sertifikasi.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Sub-tab navigation */}
      <div className="flex items-center gap-3 pb-4 border-b-2">
        <button
          onClick={() => {
            setActiveSubTab("education");
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

      {/* Education tab view */}
      {activeSubTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Riwayat Pendidikan Formal
            </h3>
            {!editingEdu && (
              <button
                onClick={() =>
                  setEditingEdu({
                    school: "",
                    degree: "",
                    period: "",
                    focus: "",
                    active: false,
                    order_index: education.length,
                  })
                }
                className="neo-btn-primary font-bold text-xs sm:text-sm"
              >
                <Icon name="plus" size={15} />
                Tambah Pendidikan
              </button>
            )}
          </div>

          {editingEdu && (
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

                <div className="flex justify-end gap-3 pt-3 border-t-2">
                  <button
                    type="button"
                    onClick={() => setEditingEdu(null)}
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
          )}

          <div className="space-y-4">
            {education.map((edu, idx) => (
              <Card key={edu.id || edu.school + idx} className="p-5">
                <div className="flex items-center justify-between mb-2 pb-2 border-b-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold">
                      {edu.period}
                    </span>
                    {edu.active && <Chip variant="green">Aktif</Chip>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEdu(edu)}
                      className="neo-btn-secondary text-xs font-bold py-1 px-2.5"
                    >
                      <Icon name="edit" size={13} />
                    </button>
                    {edu.id && (
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        className="neo-badge text-xs font-bold py-1 px-2.5"
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
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Certifications tab view */}
      {activeSubTab === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sertifikasi & Kredensial Resmi
            </h3>
            {!editingCert && (
              <button
                onClick={() =>
                  setEditingCert({
                    title: "",
                    issuer: "",
                    provider: "Coursera",
                    credentialId: "",
                    credentialUrl: "",
                    date: "2024",
                    orderIndex: certifications.length,
                  })
                }
                className="neo-btn-primary font-bold text-xs sm:text-sm"
              >
                <Icon name="plus" size={15} />
                Tambah Sertifikasi
              </button>
            )}
          </div>

          {editingCert && (
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
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
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
                      Platform Provider
                    </label>
                    <select
                      value={editingCert.provider}
                      onChange={(e) =>
                        setEditingCert({
                          ...editingCert,
                          provider: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm"
                      style={{
                        backgroundColor: "var(--surface-alt)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <option value="Coursera">Coursera</option>
                      <option value="Dicoding">Dicoding</option>
                      <option value="Udemy">Udemy</option>
                      <option value="Karirnex">Karirnex</option>
                      <option value="AWS">AWS</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 font-mono text-sm"
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

                <div className="flex justify-end gap-3 pt-3 border-t-2">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
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
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications.map((c, idx) => (
              <Card key={c.id || c.credentialId || idx} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 pb-2 border-b-2">
                    <Chip variant="blue">{c.provider}</Chip>
                    <span className="text-xs font-mono font-bold">
                      {c.date}
                    </span>
                  </div>
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
                    {c.issuer}
                  </div>
                </div>

                <div className="pt-2 border-t-2 flex items-center justify-between">
                  <span
                    className="text-xs font-mono truncate max-w-[150px]"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {c.credentialId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingCert(c)}
                      className="neo-btn-secondary text-xs font-bold py-1 px-2"
                    >
                      <Icon name="edit" size={12} />
                    </button>
                    {c.id && (
                      <button
                        onClick={() => handleDeleteCert(c.id)}
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
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
