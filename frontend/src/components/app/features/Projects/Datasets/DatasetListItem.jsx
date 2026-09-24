import { Database } from "lucide-react";

const DatasetListItem = ({
  dataset,
  onView,
  onDelete,
}) => {
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
            <dt className="inline text-text-secondary/70">
              Rows{" "}
            </dt>
            <dd className="inline text-text">
              {dataset.rows}
            </dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">
              Columns{" "}
            </dt>
            <dd className="inline text-text">
              {dataset.columns}
            </dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">
              Type{" "}
            </dt>
            <dd className="inline text-text">
              {dataset.fileType}
            </dd>
          </div>

          <div>
            <dt className="inline text-text-secondary/70">
              Size{" "}
            </dt>
            <dd className="inline text-text">
              {dataset.fileSize}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:gap-4">
          <div className="flex items-center gap-3">
            <DatasetStatusPill status={dataset.status} />

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
};

export default DatasetListItem;