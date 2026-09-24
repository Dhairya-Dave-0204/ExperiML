import { useMemo, useState } from "react";
import {
  Database,
  Upload,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Mock data — UI preview only                                        */
/* ------------------------------------------------------------------ */

const DATASETS = [
  {
    id: "ds_churn_v2",
    name: "customer_churn_v2",
    version: "v2",
    status: "READY",
    rows: "10,000",
    columns: 21,
    fileType: "CSV",
    fileSize: "2.8 MB",
    updated: "Updated 2 hours ago",
  },
  {
    id: "ds_churn_v1",
    name: "customer_churn_v1",
    version: "v1",
    status: "READY",
    rows: "8,500",
    columns: 19,
    fileType: "CSV",
    fileSize: "2.4 MB",
    updated: "Updated 5 days ago",
  },
  {
    id: "ds_churn_raw",
    name: "customer_churn_raw",
    version: "v1",
    status: "PROCESSING",
    rows: "12,300",
    columns: 24,
    fileType: "CSV",
    fileSize: "3.1 MB",
    updated: "Updated 6 days ago",
  },
  {
    id: "ds_sales_v3",
    name: "sales_forecast_v3",
    version: "v3",
    status: "READY",
    rows: "24,500",
    columns: 14,
    fileType: "XLSX",
    fileSize: "4.2 MB",
    updated: "Updated 1 week ago",
  },
  {
    id: "ds_sales_v2",
    name: "sales_forecast_v2",
    version: "v2",
    status: "FAILED",
    rows: "—",
    columns: "—",
    fileType: "XLSX",
    fileSize: "3.8 MB",
    updated: "Updated 2 weeks ago",
  },
];

const STATUS_FILTERS = ["All", "Ready", "Processing", "Failed"];

const STATUS_STYLES = {
  READY: "bg-success/10 text-success",
  PROCESSING: "bg-warning/10 text-warning",
  FAILED: "bg-danger/10 text-danger",
};

/* ------------------------------------------------------------------ */
/* Presentational helpers                                             */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status === "PROCESSING" && (
        <Loader2 size={11} className="animate-spin" strokeWidth={2.5} />
      )}

      {status === "READY" && (
        <CheckCircle2 size={11} strokeWidth={2.5} />
      )}

      {status === "FAILED" && (
        <AlertCircle size={11} strokeWidth={2.5} />
      )}

      {status}
    </span>
  );
}

function DatasetRowActions({ dataset, onView, onDelete }) {
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
}

function DatasetListItem({ dataset, onView, onDelete }) {
  return (
    <li className="px-5 py-4 transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-surface-soft sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center min-w-0 gap-3">
          <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-surface-soft">
            <Database
              size={15}
              strokeWidth={1.75}
              className="text-text-secondary"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold truncate text-text">
                {dataset.name}
              </span>

              <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                {dataset.version}
              </span>
            </div>

            <div className="mt-0.5 hidden items-center gap-2 text-xs text-text-secondary sm:flex">
              <span>{dataset.rows} rows</span>
              <span aria-hidden="true">·</span>
              <span>{dataset.columns} columns</span>
              <span aria-hidden="true">·</span>
              <span>{dataset.fileType}</span>
              <span aria-hidden="true">·</span>
              <span>{dataset.fileSize}</span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-text-secondary sm:hidden">
          <div>
            <dt className="inline text-text-secondary/70">Rows </dt>
            <dd className="inline text-text">{dataset.rows}</dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">Columns </dt>
            <dd className="inline text-text">{dataset.columns}</dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">Type </dt>
            <dd className="inline text-text">{dataset.fileType}</dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">Size </dt>
            <dd className="inline text-text">{dataset.fileSize}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:gap-4">
          <div className="flex items-center gap-3">
            <StatusPill status={dataset.status} />

            <span className="text-xs text-text-secondary">
              {dataset.updated}
            </span>
          </div>

          <DatasetRowActions
            dataset={dataset}
            onView={onView}
            onDelete={onDelete}
          />
        </div>
      </div>
    </li>
  );
}

function EmptyState({ onUpload }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex items-center justify-center mb-3 rounded-full h-11 w-11 bg-surface-soft">
        <Database
          size={19}
          strokeWidth={1.75}
          className="text-text-secondary"
        />
      </div>

      <h3 className="mb-1 text-sm font-bold text-text">
        No datasets yet
      </h3>

      <p className="max-w-xs mb-5 text-xs leading-relaxed text-text-secondary">
        Upload a dataset to begin working with data in this project.
      </p>

      <button
        type="button"
        onClick={onUpload}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
      >
        <Upload size={15} strokeWidth={2} />
        Upload Dataset
      </button>
    </div>
  );
}

function UploadDatasetDialog({ onClose }) {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);

  function handleFilePicked(selectedFile) {
    if (!selectedFile) return;

    setFile(selectedFile);
    setStage("selected");
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        className="relative w-full max-w-md p-6 border shadow-lg rounded-2xl border-border bg-surface"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="upload-dialog-title"
            className="text-base font-bold font-heading text-text"
          >
            Upload Dataset
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 transition-colors duration-150 rounded-lg text-text-secondary hover:bg-surface-soft hover:text-text"
          >
            <X size={17} strokeWidth={1.85} />
          </button>
        </div>

        {stage === "uploading" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Loader2
              size={22}
              className="mb-3 animate-spin text-primary"
              strokeWidth={2}
            />

            <div className="mb-1 text-sm font-semibold text-text">
              Uploading dataset...
            </div>

            <p className="max-w-xs text-xs text-text-secondary">
              Once the upload finishes, processing continues in the
              background. You can safely close this dialog — the dataset
              will appear as{" "}
              <span className="font-semibold text-warning">
                PROCESSING
              </span>{" "}
              until it's ready.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-text-secondary">
              Supported formats: CSV, XLSX
            </p>

            {stage === "idle" && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  handleFilePicked(
                    event.dataTransfer.files?.[0] ?? null,
                  );
                }}
                className={`flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
                  isDragging
                    ? "border-primary bg-primary-light/30"
                    : "border-border"
                }`}
              >
                <Upload
                  size={20}
                  strokeWidth={1.75}
                  className="mb-3 text-text-secondary"
                />

                <p className="mb-1 text-sm font-medium text-text">
                  Drag and drop a file here
                </p>

                <p className="mb-4 text-xs text-text-secondary">
                  or
                </p>

                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg cursor-pointer border-border text-text hover:bg-surface-soft">
                  Choose File

                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="sr-only"
                    onChange={(event) =>
                      handleFilePicked(
                        event.target.files?.[0] ?? null,
                      )
                    }
                  />
                </label>
              </div>
            )}

            {stage === "selected" && file && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 border rounded-xl border-border bg-surface-soft">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileSpreadsheet
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0 text-text-secondary"
                  />

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate text-text">
                      {file.name}
                    </div>

                    <div className="text-xs text-text-secondary">
                      {formatSize(file.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setStage("idle");
                  }}
                  aria-label="Remove selected file"
                  className="shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors duration-150 hover:bg-surface hover:text-text"
                >
                  <X size={15} strokeWidth={1.85} />
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg border-border text-text hover:bg-surface-soft"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={stage !== "selected"}
                onClick={() => setStage("uploading")}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const ProjectDatasets = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);

  const datasets = DATASETS;

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch = dataset.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        dataset.status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [datasets, search, statusFilter]);

  const handleView = () => {
    // UI-only for now.
  };

  const handleDelete = (dataset) => {
    // UI-only for now.
    console.log("Delete requested:", dataset.id);
  };

  return (
    <div className="mx-auto space-y-5 max-w-7xl">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="mb-1 font-bold font-heading text-text">
            Datasets
          </h2>

          <p className="text-sm text-text-secondary">
            Upload, inspect, and manage the data used by your
            experiments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg shrink-0 bg-primary hover:bg-primary-dark"
        >
          <Upload size={16} strokeWidth={2.25} />
          Upload Dataset
        </button>
      </div>

      {/* Toolbar */}
      {datasets.length > 0 && (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={14}
              strokeWidth={1.85}
              className="absolute -translate-y-1/2 pointer-events-none left-3 top-1/2 text-text-secondary"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search datasets..."
              className="w-full rounded-lg border border-border bg-surface py-1.5 pl-8 pr-3 text-sm text-text placeholder:text-text-secondary/70 transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {STATUS_FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setStatusFilter(label)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  statusFilter === label
                    ? "bg-primary-light text-primary"
                    : "text-text-secondary hover:bg-surface-soft hover:text-text"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dataset list */}
      <div className="border rounded-2xl border-border bg-surface">
        {datasets.length === 0 ? (
          <EmptyState onUpload={() => setUploadOpen(true)} />
        ) : filteredDatasets.length === 0 ? (
          <div className="px-6 py-12 text-sm text-center text-text-secondary">
            No datasets match your search or filter.
          </div>
        ) : (
          <ul>
            {filteredDatasets.map((dataset) => (
              <DatasetListItem
                key={dataset.id}
                dataset={dataset}
                onView={handleView}
                onDelete={() => handleDelete(dataset)}
              />
            ))}
          </ul>
        )}
      </div>

      {uploadOpen && (
        <UploadDatasetDialog
          onClose={() => setUploadOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectDatasets;