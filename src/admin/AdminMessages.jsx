import { Card, Icon } from "../components";
import { supabase } from "../lib/supabase";

// Contact messages inbox tab
export default function AdminMessages({ messages = [], onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pesan ini dari database?")) return;
    try {
      if (supabase) {
        await supabase.from("contact_messages").delete().eq("id", id);
      }
      await onRefresh();
    } catch (err) {
      alert(err.message || "Gagal menghapus pesan.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2
          className="text-xl sm:text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kotak Masuk Pesan ({messages.length})
        </h2>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--ink-secondary)" }}
        >
          Pesan pertanyaan, tawaran magang, dan kolaborasi dari formulir kontak.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card className="p-12 text-center">
          <div
            className="w-12 h-12 rounded-full border-2 mx-auto mb-4 flex items-center justify-center"
            style={{
              backgroundColor: "var(--surface-alt)",
              borderColor: "var(--border)",
            }}
          >
            <Icon name="mail" size={20} />
          </div>
          <h3 className="font-extrabold text-base mb-1">
            Belum ada pesan yang masuk
          </h3>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            Setiap pesan yang dikirim oleh pengunjung di halaman beranda akan
            ditampilkan di sini.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2">
                <div>
                  <h4 className="font-extrabold text-base">{msg.name}</h4>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-mono font-bold hover:underline"
                    style={{ color: "var(--google-blue)" }}
                  >
                    {msg.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleString("id-ID")
                      : "-"}
                  </span>
                  {msg.id && (
                    <button
                      onClick={() => handleDelete(msg.id)}
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

              <div>
                <div
                  className="text-xs font-bold font-mono uppercase mb-1"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Topik: {msg.subject || "Tanpa Topik"}
                </div>
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--ink)" }}
                >
                  {msg.message}
                </p>
              </div>

              <div className="pt-3 border-t-2 flex justify-end">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                    msg.subject || "Kontak Portofolio"
                  )}`}
                  className="neo-btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                >
                  <Icon name="mail" size={15} />
                  Balas via Email
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
