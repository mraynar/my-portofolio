import { useState, useEffect, useRef } from "react";
import { Card, Chip, Icon, FloatingAlert } from "../components";
import {
  isSupabaseConfigured,
  getPreCloudBackupInfo,
  exportCmsSnapshot,
  importCmsSnapshot,
  syncLocalDataToSupabase,
} from "../lib/supabase";

// Overview metrics, cloud sync controls, and quick actions tab
export default function AdminOverview({
  projectsCount = 0,
  realProjectsCount = 0,
  isCustomProjectsCount = false,
  experienceCount = 0,
  skillsCount = 0,
  educationCount = 0,
  certificationsCount = 0,
  messages = [],
  onNavigateTab,
  onRefresh,
}) {
  const [syncing, setSyncing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [preBackupInfo, setPreBackupInfo] = useState(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    getPreCloudBackupInfo()
      .then((info) => {
        if (active) setPreBackupInfo(info);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSyncToSupabase = async () => {
    if (syncing) return;
    setSyncing(true);
    setFeedback(null);
    setProgressMsg("Mempersiapkan sinkronisasi data lokal ke Supabase...");
    try {
      const result = await syncLocalDataToSupabase((stepText) => {
        setProgressMsg(stepText);
      });
      setPreBackupInfo(null);
      if (onRefresh) await onRefresh();
      setFeedback({
        type: "success",
        text: `Sinkronisasi berhasil: ${result.projects} proyek, ${result.experience} pengalaman, ${result.certifications} sertifikasi, ${result.uploadedImages} gambar terunggah ke Supabase dan live di mraynar.my.id.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Gagal menyinkronkan data ke Supabase.",
      });
    } finally {
      setSyncing(false);
      setProgressMsg("");
    }
  };

  const handleExportBackup = async () => {
    setFeedback(null);
    try {
      const snapshot = await exportCmsSnapshot();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `mraynar-cms-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setFeedback({
        type: "success",
        text: "File backup JSON berhasil diunduh (berisi profil, proyek, pengalaman, keahlian, pendidikan, dan sertifikasi).",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Gagal mengekspor backup data.",
      });
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSyncing(true);
    setFeedback(null);
    setProgressMsg("Membaca file backup JSON...");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = await importCmsSnapshot(parsed, (stepText) => {
        setProgressMsg(stepText);
      });
      setPreBackupInfo(null);
      if (onRefresh) await onRefresh();
      setFeedback({
        type: "success",
        text: isSupabaseConfigured
          ? `Backup berhasil diimpor & disinkronkan ke Supabase: ${result.projects} proyek, ${result.experience} pengalaman, ${result.certifications} sertifikasi.`
          : `Backup berhasil diimpor ke browser lokal: ${result.projects} proyek, ${result.experience} pengalaman, ${result.certifications} sertifikasi.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err?.message || "Gagal mengimpor file backup JSON.",
      });
    } finally {
      setSyncing(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="space-y-8">
      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="devfest-card-blue p-6 flex flex-col justify-between">
          <div>
            <div
              className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mb-1"
              style={{ color: "var(--google-blue)" }}
            >
              [{projectsCount}]
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-1">
              TOTAL PROYEK
            </div>
            {isCustomProjectsCount && (
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border inline-block"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                  color: "var(--ink-secondary)",
                }}
              >
                Kustom ({realProjectsCount} Riil)
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigateTab("projects")}
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4 cursor-pointer"
            style={{ color: "var(--google-blue)" }}
          >
            Kelola Proyek <Icon name="arrow-right" size={13} />
          </button>
        </Card>

        <Card className="devfest-card-green p-6 flex flex-col justify-between">
          <div>
            <div
              className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mb-1"
              style={{ color: "var(--google-green)" }}
            >
              [{experienceCount}]
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2">
              PENGALAMAN
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("experience")}
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4 cursor-pointer"
            style={{ color: "var(--google-green)" }}
          >
            Kelola Linimasa <Icon name="arrow-right" size={13} />
          </button>
        </Card>

        <Card className="devfest-card-yellow p-6 flex flex-col justify-between">
          <div>
            <div
              className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mb-1"
              style={{ color: "var(--google-yellow-hover)" }}
            >
              [{skillsCount}]
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2">
              KATEGORI SKILL
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("skills")}
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4 cursor-pointer"
            style={{ color: "var(--google-yellow-hover)" }}
          >
            Kelola Keahlian <Icon name="arrow-right" size={13} />
          </button>
        </Card>

        <Card className="devfest-card-red p-6 flex flex-col justify-between">
          <div>
            <div
              className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight mb-1"
              style={{ color: "var(--google-red)" }}
            >
              [{messages.length}]
            </div>
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2">
              PESAN KONTAK
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("messages")}
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4 cursor-pointer"
            style={{ color: "var(--google-red)" }}
          >
            Lihat Pesan <Icon name="arrow-right" size={13} />
          </button>
        </Card>
      </div>

      {/* Cloud sync and backup panel */}
      <Card className="p-6 space-y-5">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-start gap-3">
            <span
              className="w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isSupabaseConfigured
                  ? "var(--google-green-bg)"
                  : "var(--google-blue-bg)",
                borderColor: "var(--border)",
                color: isSupabaseConfigured
                  ? "var(--google-green)"
                  : "var(--google-blue)",
              }}
            >
              <Icon name="database" size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className="text-lg font-extrabold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Sinkronisasi Cloud Supabase & Backup
                </h3>
                <Chip variant={isSupabaseConfigured ? "green" : "yellow"}>
                  {isSupabaseConfigured
                    ? "Supabase Terhubung"
                    : "Mode Lokal (IndexedDB)"}
                </Chip>
              </div>
              <p
                className="text-xs sm:text-sm mt-0.5"
                style={{ color: "var(--ink-secondary)" }}
              >
                Unggah seluruh data lokal ({realProjectsCount} proyek,{" "}
                {experienceCount} pengalaman, {educationCount} pendidikan,{" "}
                {certificationsCount} sertifikasi, profil & foto) ke Supabase
                agar langsung tampil live di mraynar.my.id.
              </p>
            </div>
          </div>
        </div>

        {preBackupInfo && (
          <div
            className="p-4 rounded-xl border-2 text-xs sm:text-sm flex items-start gap-3"
            style={{
              backgroundColor: "var(--google-blue-bg)",
              borderColor: "var(--google-blue)",
              color: "var(--ink)",
            }}
          >
            <Icon
              name="info"
              size={18}
              style={{ color: "var(--google-blue)", flexShrink: 0 }}
            />
            <div>
              <div className="font-extrabold">
                Snapshot data lokal sebelum sinkronisasi terdeteksi
              </div>
              <p className="mt-0.5 text-xs" style={{ color: "var(--ink-secondary)" }}>
                Tersimpan {preBackupInfo.counts.projects} proyek,{" "}
                {preBackupInfo.counts.experience} pengalaman, dan{" "}
                {preBackupInfo.counts.certifications} sertifikasi dari browser
                lokal. Klik tombol Sinkronkan Data Lokal ke Supabase untuk
                memublikasikannya ke cloud.
              </p>
            </div>
          </div>
        )}

        {!isSupabaseConfigured && (
          <div
            className="p-4 rounded-xl border-2 text-xs sm:text-sm flex items-start gap-3"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          >
            <Icon
              name="alert"
              size={18}
              style={{ color: "var(--google-yellow-hover)", flexShrink: 0 }}
            />
            <div className="space-y-1">
              <div className="font-extrabold">
                Kredensial Supabase belum terpasang di environment ini
              </div>
              <p className="text-xs" style={{ color: "var(--ink-secondary)" }}>
                1. Unduh Backup JSON di bawah terlebih dahulu agar seluruh data
                lokal Anda aman. 2. Isi <code>VITE_SUPABASE_URL</code> dan{" "}
                <code>VITE_SUPABASE_ANON_KEY</code> di file <code>.env</code>{" "}
                lokal serta di Vercel Environment Variables, lalu restart
                server/redeploy. 3. Buka kembali halaman ini atau{" "}
                <code>mraynar.my.id/admin</code> lalu klik Sinkronkan atau Impor
                Backup JSON.
              </p>
            </div>
          </div>
        )}

        {progressMsg && (
          <div
            className="px-4 py-3 rounded-xl border-2 text-xs font-mono font-bold flex items-center gap-2"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--google-blue)",
              color: "var(--google-blue)",
            }}
          >
            <Icon name="refresh" size={14} className="animate-spin" />
            <span>{progressMsg}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSyncToSupabase}
            disabled={syncing || !isSupabaseConfigured}
            className="neo-btn-primary text-xs sm:text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            <Icon name="upload" size={15} />
            {syncing
              ? "Menyinkronkan..."
              : "Sinkronkan Data Lokal ke Supabase"}
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            disabled={syncing}
            className="neo-btn-secondary text-xs sm:text-sm font-bold cursor-pointer"
          >
            <Icon name="download" size={15} />
            Unduh Backup Lokal (JSON)
          </button>

          <label className="neo-btn-secondary text-xs sm:text-sm font-bold cursor-pointer">
            <Icon name="file" size={15} />
            Impor Backup (JSON)
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportBackup}
              disabled={syncing}
              className="hidden"
            />
          </label>
        </div>
      </Card>

      {/* Recent contact messages preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2">
          <div>
            <h3
              className="text-lg sm:text-xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pesan Masuk Terbaru
            </h3>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              Pesan yang dikirimkan oleh pengunjung melalui formulir kontak.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("messages")}
            className="neo-btn-secondary text-xs sm:text-sm font-bold cursor-pointer"
          >
            Buka Kotak Masuk
            <Icon name="arrow-right" size={14} />
          </button>
        </div>

        {messages.length === 0 ? (
          <div
            className="text-center py-12 text-sm font-medium"
            style={{ color: "var(--ink-secondary)" }}
          >
            Belum ada pesan kontak dari pengunjung.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: "var(--surface-alt)",
                  borderColor: "var(--border)",
                }}
              >
                <div>
                  <div className="font-extrabold text-sm mb-0.5">
                    {msg.name}{" "}
                    <span
                      className="text-xs font-normal font-mono"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      ({msg.email})
                    </span>
                  </div>
                  <div
                    className="text-xs font-bold"
                    style={{ color: "var(--google-blue)" }}
                  >
                    {msg.subject || "Tanpa Subjek"}
                  </div>
                  <p
                    className="text-xs line-clamp-1 mt-1"
                    style={{ color: "var(--ink-secondary)" }}
                  >
                    {msg.message}
                  </p>
                </div>
                <div
                  className="text-xs font-mono font-bold shrink-0 text-right"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleDateString("id-ID")
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
