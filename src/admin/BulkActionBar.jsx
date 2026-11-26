import { Icon } from "../components";

// Neo-brutalist selection checkbox isolated from parent card drag handlers
export function SelectCheckbox({
  checked = false,
  onChange,
  ariaLabel = "Pilih item",
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      draggable={false}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (onChange) onChange(!checked);
      }}
      className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer"
      style={{
        backgroundColor: checked ? "var(--google-blue)" : "var(--surface)",
        borderColor: checked ? "var(--google-blue)" : "var(--border)",
        color: "#ffffff",
        boxShadow: checked ? "1.5px 1.5px 0 var(--shadow-color)" : "none",
      }}
    >
      {checked && <Icon name="check" size={13} strokeWidth={3} />}
    </button>
  );
}

// Reusable toolbar for multi-select and bulk deletion across admin lists
export default function BulkActionBar({
  totalCount = 0,
  selectedCount = 0,
  allSelected = false,
  onToggleSelectAll,
  onClearSelection,
  onBulkDelete,
  isDeleting = false,
  itemLabel = "item",
}) {
  if (totalCount === 0) return null;

  return (
    <div
      className="p-3 sm:p-3.5 rounded-xl border-2 flex flex-wrap items-center justify-between gap-2.5 transition-all"
      style={{
        backgroundColor:
          selectedCount > 0 ? "var(--google-blue-bg)" : "var(--surface)",
        borderColor:
          selectedCount > 0 ? "var(--google-blue)" : "var(--border)",
        boxShadow: "2px 2px 0 var(--shadow-color)",
      }}
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onToggleSelectAll}
          className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer select-none"
          style={{ color: "var(--ink)" }}
        >
          <span
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
            style={{
              backgroundColor: allSelected
                ? "var(--google-blue)"
                : "var(--surface)",
              borderColor: allSelected ? "var(--google-blue)" : "var(--border)",
              color: "#ffffff",
            }}
          >
            {allSelected && <Icon name="check" size={13} strokeWidth={3} />}
          </span>
          <span>
            {allSelected
              ? `Batal Pilih Semua (${totalCount})`
              : `Pilih Semua (${totalCount})`}
          </span>
        </button>

        {selectedCount > 0 && (
          <span
            className="neo-badge text-[11px] font-mono font-extrabold px-2.5 py-0.5"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--google-blue)",
              color: "var(--google-blue-text)",
            }}
          >
            {selectedCount} {itemLabel} dipilih
          </span>
        )}
      </div>

      {selectedCount > 0 ? (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClearSelection}
            className="neo-btn-secondary text-xs font-bold py-1.5 px-3 cursor-pointer"
          >
            <Icon name="x" size={13} />
            Batal
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onBulkDelete}
            className="neo-badge text-xs font-bold py-1.5 px-3 cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            style={{
              backgroundColor: "var(--google-red)",
              color: "#ffffff",
              borderColor: "var(--border)",
              boxShadow: "2px 2px 0 var(--shadow-color)",
            }}
          >
            <Icon name="trash" size={13} />
            {isDeleting
              ? "Menghapus..."
              : `Hapus Terpilih (${selectedCount})`}
          </button>
        </div>
      ) : (
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--ink-muted)" }}
        >
          Centang beberapa kartu untuk hapus massal
        </span>
      )}
    </div>
  );
}
