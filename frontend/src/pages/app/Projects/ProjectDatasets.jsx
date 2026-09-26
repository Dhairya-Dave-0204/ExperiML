import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import { Search, Upload } from "lucide-react";

import {
  DatasetEmptyState,
  DatasetListItem,
  UploadDatasetDialog,
} from "@/components/components.index";

import datasetService from "@/services/dataset/datasetService";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_FILTERS = ["All", "Ready", "Processing", "Failed"];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) {
    return "—";
  }

  const size = Number(bytes);

  if (!Number.isFinite(size)) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatUpdated = (date) => {
  if (!date) {
    return "Updated —";
  }

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `Updated ${formattedDate}`;
};

const mapDatasetToUI = (dataset) => ({
  id: dataset.id,
  name: dataset.name,
  version: `v${dataset.datasetVersion}`,
  status: dataset.datasetStatus,
  rows: dataset.rowCount?.toLocaleString() ?? "—",
  columns: dataset.columnCount ?? "—",
  fileType: dataset.datasetFormat ?? "—",
  fileSize: formatFileSize(dataset.fileSize),
  updated: formatUpdated(dataset.updatedAt),
});

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const ProjectDatasets = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteDataset, setDeleteDataset] = useState(null);

  const fetchDatasets = useCallback(async () => {
    if (!projectId) {
      setError("Project ID is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await datasetService.getProjectDatasets(projectId);
      const mappedDatasets = data.map(mapDatasetToUI);

      setDatasets(mappedDatasets);
    } catch (error) {
      console.error("Failed to fetch project datasets:", error);

      setError(
        error?.response?.data?.message || "Failed to load project datasets.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

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

  const handleView = (dataset) => {
    navigate(ROUTES.PROJECT_DATASET(projectId, dataset.id));
  };

  const handleDelete = (dataset) => {
    setDeleteDataset(dataset);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <p className="text-sm text-text-secondary">Loading datasets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full bg-surface">
        <div className="text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
        </div>
      </div>
    );
  }

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
                onView={() => handleView(dataset)}
                onDelete={() => handleDelete(dataset)}
              />
            ))}
          </ul>
        )}
      </div>

      {uploadOpen && (
        <UploadDatasetDialog
          onClose={() => setUploadOpen(false)}
          onUploadSuccess={fetchDatasets}
        />
      )}

      {deleteDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
          <div className="w-full max-w-md p-5 border shadow-xl rounded-xl border-border bg-surface">
            <div className="mb-2">
              <h3 className="text-base font-bold font-heading text-text">
                Delete Dataset?
              </h3>

              <p className="mt-1 text-sm leading-5 text-text-secondary">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-text">
                  {deleteDataset.name}
                </span>
                ? This action will remove the dataset from this project.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteDataset(null)}
                className="px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg border-border text-text hover:border-border-hover hover:bg-surface-soft"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  // API integration in the next part
                }}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-danger hover:bg-danger/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}  
    </div>
  );
};

export default ProjectDatasets;
