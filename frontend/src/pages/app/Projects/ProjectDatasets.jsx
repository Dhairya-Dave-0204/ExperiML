import { useMemo, useState } from "react";

import { Search, Upload } from "lucide-react";
import {
  DatasetEmptyState,
  DatasetListItem,
  UploadDatasetDialog,
} from "@/components/components.index";

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
        statusFilter === "All" || dataset.status === statusFilter.toUpperCase();

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
          <h2 className="mb-1 font-bold font-heading text-text">Datasets</h2>

          <p className="text-sm text-text-secondary">
            Upload, inspect, and manage the data used by your experiments.
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
          <DatasetEmptyState onUpload={() => setUploadOpen(true)} />
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
        <UploadDatasetDialog onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
};

export default ProjectDatasets;
