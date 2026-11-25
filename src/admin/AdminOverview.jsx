import { Card, Icon } from "../components";

// Overview metrics and quick actions tab
export default function AdminOverview({
  projectsCount = 0,
  realProjectsCount = 0,
  isCustomProjectsCount = false,
  experienceCount = 0,
  skillsCount = 0,
  messages = [],
  onNavigateTab,
}) {
  return (
    <div className="space-y-8">
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
                Kustom • {realProjectsCount} Riil
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigateTab("projects")}
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4"
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
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4"
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
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4"
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
            className="text-xs font-bold font-mono hover:underline inline-flex items-center gap-1 mt-4"
            style={{ color: "var(--google-red)" }}
          >
            Lihat Pesan <Icon name="arrow-right" size={13} />
          </button>
        </Card>
      </div>

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
            className="neo-btn-secondary text-xs sm:text-sm font-bold"
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
