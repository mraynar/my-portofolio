import { useState } from "react";
import { Card, Icon, Pagination, FloatingAlert } from "../components";
import AdminSectionHeaderEditor from "./AdminSectionHeaderEditor";
import BulkActionBar, { SelectCheckbox } from "./BulkActionBar";
import { deleteContactMessagesBulk } from "../lib/supabase";

// Contact messages inbox tab
export default function AdminMessages({
  messages = [],
  onRefresh,
  info,
  onUpdateInfo,
  onSaveComplete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const pageSize = 5;

  const validSelectedIds = selectedIds.filter((id) =>
    messages.some((m) => m.id === id)
  );

  const toggleSelectMessage = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pesan ini dari database?")) return;
    try {
      await deleteContactMessagesBulk([id]);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus pesan.",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (validSelectedIds.length === 0) return;
    if (
      !window.confirm(
        `Hapus ${validSelectedIds.length} pesan yang dipilih secara permanen?`
      )
    ) {
      return;
    }
    setIsBulkDeleting(true);
    setFeedback(null);
    try {
      const removed = await deleteContactMessagesBulk(validSelectedIds);
      setSelectedIds([]);
      await onRefresh();
      setCurrentPage(1);
      setFeedback({
        type: "success",
        text: `${removed} pesan berhasil dihapus.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Gagal menghapus pesan terpilih.",
      });
    } finally {
      setIsBulkDeleting(false);
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

      <FloatingAlert feedback={feedback} onClose={() => setFeedback(null)} />

      {/* Section Heading Customization */}
      <AdminSectionHeaderEditor
        sectionKey="contact"
        sectionName="Formulir Kontak & Kolaborasi"
        fields={{
          kicker: "contactKicker",
          title: "contactTitle",
          titleAccent: "contactTitleAccent",
          subtitle: "contactSubtitle",
        }}
        defaultValues={{
          kicker: "HUBUNGI SAYA",
          title: "Mari",
          titleAccent: "Berkolaborasi",
          subtitle:
            "Terbuka untuk peluang magang, proyek kolaboratif, atau konsultasi teknis.",
        }}
        info={info}
        onUpdateInfo={onUpdateInfo}
        onSaveComplete={onSaveComplete}
      />

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
          <BulkActionBar
            totalCount={messages.length}
            selectedCount={validSelectedIds.length}
            allSelected={
              messages.length > 0 && validSelectedIds.length === messages.length
            }
            onToggleSelectAll={() =>
              setSelectedIds(
                validSelectedIds.length === messages.length
                  ? []
                  : messages.map((m) => m.id)
              )
            }
            onClearSelection={() => setSelectedIds([])}
            onBulkDelete={handleBulkDelete}
            isDeleting={isBulkDeleting}
            itemLabel="pesan"
          />

          {(() => {
            const maxPage = Math.max(1, Math.ceil(messages.length / pageSize));
            const effectivePage = Math.min(currentPage, maxPage);
            const paginated = messages.slice(
              (effectivePage - 1) * pageSize,
              effectivePage * pageSize
            );

            return (
              <>
                {paginated.map((msg) => {
                  const isSelected = validSelectedIds.includes(msg.id);
                  return (
                  <Card
                    key={msg.id}
                    className={`p-5 sm:p-6 space-y-4 transition-all ${
                      isSelected ? "ring-2 ring-[var(--google-blue)]" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2">
                      <div className="flex items-start gap-2.5">
                        <div className="pt-0.5">
                          <SelectCheckbox
                            checked={isSelected}
                            onChange={() => toggleSelectMessage(msg.id)}
                            ariaLabel={`Pilih pesan dari ${msg.name}`}
                          />
                        </div>
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
                            className="neo-badge text-xs font-bold py-1 px-2.5 cursor-pointer"
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
                  );
                })}

                <Pagination
                  currentPage={currentPage}
                  totalItems={messages.length}
                  pageSize={pageSize}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  itemLabel="pesan"
                />
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
