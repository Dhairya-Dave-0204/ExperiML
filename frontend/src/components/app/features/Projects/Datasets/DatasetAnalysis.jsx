import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Database,
  FileSpreadsheet,
  FlaskConical,
} from "lucide-react";

import datasetService from "@/services/dataset/datasetService";
import ROUTES from "@/constants/routes";

const formatFileSize = (bytes) => {
  if (bytes === null || bytes === undefined) return "—";

  const size = Number(bytes);

  if (!Number.isFinite(size)) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return "—";

  const number = Number(value);

  if (!Number.isFinite(number)) return value;

  return number.toLocaleString();
};

function Section({ title, description, children }) {
  return (
    <div className="border rounded-2xl border-border bg-surface">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-heading text-[15px] font-bold text-text">
          {title}
        </h2>

        {description && (
          <p className="mt-0.5 text-xs text-text-secondary">{description}</p>
        )}
      </div>

      {children}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="text-xs border-b border-border text-text-secondary">
            {columns.map((column) => (
              <th key={column} className="px-6 py-2.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.name ?? index}
              className="border-b border-border last:border-b-0"
            >
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-6 py-2.5 ${
                    cellIndex === 0
                      ? "font-mono font-semibold text-text"
                      : "text-text-secondary"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DatasetAnalysis = () => {
  const { projectId, datasetId } = useParams();
  const navigate = useNavigate();

  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataset = async () => {
      if (!projectId || !datasetId) {
        setError("Dataset information is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await datasetService.getDatasetById(projectId, datasetId);

        setDataset(data);
      } catch (error) {
        console.error("Failed to fetch dataset:", error);

        setError(error?.response?.data?.message || "Failed to load dataset.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataset();
  }, [projectId, datasetId]);

  const metadata = dataset?.metadata ?? {};
  const columns = metadata.columns ?? [];

  const missingValues = useMemo(() => {
    return columns.reduce(
      (total, column) => total + (column.missing_count ?? 0),
      0,
    );
  }, [columns]);

  const typeBreakdown = useMemo(() => {
    const counts = columns.reduce((accumulator, column) => {
      const type = column.data_type ?? "unknown";

      accumulator[type] = (accumulator[type] ?? 0) + 1;

      return accumulator;
    }, {});

    return Object.entries(counts)
      .map(([type, count]) => `${count} ${type}`)
      .join(" · ");
  }, [columns]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-text-secondary">Loading dataset...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div className="px-5 py-4 text-sm border rounded-xl border-danger/20 bg-danger/5 text-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!dataset) {
    return null;
  }

  const datasetsPath = ROUTES.PROJECT_TAB(
    projectId,
    ROUTES.PROJECT_TABS.DATASETS,
  );

  return (
    <div className="max-w-5xl px-4 py-6 mx-auto space-y-6 sm:px-6 lg:px-8">
      {/* Back navigation */}
      <button
        type="button"
        onClick={() => navigate(datasetsPath)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-text"
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Back to Datasets
      </button>

      {/* Dataset identity */}
      <div className="p-6 border rounded-2xl border-border bg-surface sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-surface-soft">
                <Database
                  size={16}
                  strokeWidth={1.75}
                  className="text-text-secondary"
                />
              </div>

              <h1 className="font-mono text-lg font-bold truncate text-text sm:text-xl">
                {dataset.name}
              </h1>

              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
                v{dataset.datasetVersion}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-success">
                <CheckCircle2 size={11} strokeWidth={2.5} />
                {dataset.datasetStatus}
              </span>
            </div>

            <div className="flex flex-wrap items-center text-xs gap-x-4 gap-y-1 text-text-secondary">
              <span className="flex items-center gap-1.5">
                <FileSpreadsheet size={13} strokeWidth={1.85} />
                {dataset.datasetFormat} · {formatFileSize(dataset.fileSize)}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock size={13} strokeWidth={1.85} />
                Uploaded {formatDate(dataset.createdAt)}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg cursor-not-allowed shrink-0 bg-primary opacity-60"
          >
            <FlaskConical size={15} strokeWidth={2} />
            Create Experiment
          </button>
        </div>
      </div>

      {/* Dataset overview */}
      <div className="grid grid-cols-2 border divide-y divide-border rounded-xl border-border bg-surface sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {[
          {
            label: "Rows",
            value: formatNumber(dataset.rowCount),
          },
          {
            label: "Columns",
            value: formatNumber(dataset.columnCount),
          },
          {
            label: "Missing Values",
            value: formatNumber(missingValues),
          },
          {
            label: "Duplicate Rows",
            value: formatNumber(metadata.duplicateRowCount),
          },
        ].map((stat) => (
          <div key={stat.label} className="px-5 py-4">
            <div className="font-mono text-base font-bold text-text">
              {stat.value}
            </div>

            <div className="text-xs text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Column information */}
      <Section
        title="Column Information"
        description="Data type and completeness for every column."
      >
        <DataTable
          columns={["Column", "Data Type", "Missing", "Unique"]}
          rows={columns.map((column) => ({
            name: column.name,
            cells: [
              column.name,
              column.data_type ?? "—",
              formatNumber(column.missing_count),
              formatNumber(column.unique_count),
            ],
          }))}
        />
      </Section>

      {/* Data quality */}
      <Section title="Data Quality">
        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-3">
          <div>
            <div className="text-xs text-text-secondary">Missing Values</div>

            <div className="mt-1 font-mono text-sm font-semibold text-text">
              {formatNumber(missingValues)}
            </div>
          </div>

          <div>
            <div className="text-xs text-text-secondary">Duplicate Rows</div>

            <div className="mt-1 font-mono text-sm font-semibold text-text">
              {formatNumber(metadata.duplicateRowCount)}
            </div>
          </div>

          <div>
            <div className="text-xs text-text-secondary">Column Types</div>

            <div className="mt-1 text-sm font-medium text-text">
              {typeBreakdown || "—"}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default DatasetAnalysis;
