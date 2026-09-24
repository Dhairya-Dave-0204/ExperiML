import { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  RotateCcw,
  Trash2,
} from "lucide-react";

const DatasetRowActions = ({ dataset, onView, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 shrink-0">
      {dataset.status === "READY" && (
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text transition-colors duration-150 hover:bg-surface-soft"
        >
          <Eye size={13} strokeWidth={1.85} />
          View Analysis
        </button>
      )}

      {dataset.status === "PROCESSING" && (
        <span className="text-xs text-text-secondary">
          Analysis pending
        </span>
      )}

      {dataset.status === "FAILED" && (
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text transition-colors duration-150 hover:bg-surface-soft"
        >
          <RotateCcw size={13} strokeWidth={1.85} />
          Retry Upload
        </button>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={`More actions for ${dataset.name}`}
          aria-expanded={menuOpen}
          className="rounded-lg p-1.5 text-text-secondary transition-colors duration-150 hover:bg-surface-soft hover:text-text"
        >
          <MoreHorizontal size={16} strokeWidth={1.85} />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <div className="absolute right-0 z-20 py-1 mt-1 border rounded-lg shadow-md top-full w-36 border-border bg-surface">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex items-center w-full gap-2 px-3 py-2 text-xs font-medium text-left transition-colors duration-150 text-danger hover:bg-danger/10"
              >
                <Trash2 size={13} strokeWidth={1.85} />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DatasetRowActions;