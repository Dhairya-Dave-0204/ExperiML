import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Beaker,
  ChevronDown,
  Clock3,
  Cpu,
  Database,
  Ellipsis,
  FlaskConical,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

const MOCK_EXPERIMENTS = [
  {
    id: "exp-001",
    name: "Customer Churn Baseline",
    description:
      "Baseline classification experiment for customer churn prediction.",
    status: "Completed",
    dataset: "Customer Churn Dataset",
    algorithm: "Random Forest",
    createdAt: "26/09/2026",
    updatedAt: "26/09/2026",
  },
  {
    id: "exp-002",
    name: "Loan Default Prediction",
    description:
      "Classification experiment for identifying potential loan defaults.",
    status: "Running",
    dataset: "Loan Applications",
    algorithm: "XGBoost",
    createdAt: "25/09/2026",
    updatedAt: "26/09/2026",
  },
  {
    id: "exp-003",
    name: "House Price Regression",
    description:
      "Regression experiment using housing attributes to predict prices.",
    status: "Queued",
    dataset: "House Prices",
    algorithm: "Linear Regression",
    createdAt: "24/09/2026",
    updatedAt: "24/09/2026",
  },
  {
    id: "exp-004",
    name: "Customer Segmentation",
    description: "Unsupervised experiment for discovering customer segments.",
    status: "Draft",
    dataset: "Customer Behaviour",
    algorithm: "K-Means",
    createdAt: "22/09/2026",
    updatedAt: "22/09/2026",
  },
  {
    id: "exp-005",
    name: "Sales Forecasting",
    description: "Time-series experiment for forecasting future sales trends.",
    status: "Failed",
    dataset: "Sales History",
    algorithm: "Random Forest",
    createdAt: "20/09/2026",
    updatedAt: "21/09/2026",
  },
];

const STATUS_OPTIONS = [
  "All",
  "Running",
  "Queued",
  "Completed",
  "Draft",
  "Failed",
];

const STATUS_STYLES = {
  Completed: {
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  Running: {
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  Queued: {
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  Draft: {
    dot: "bg-slate-400",
    text: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-500/10",
  },
  Failed: {
    dot: "bg-red-500",
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
};

const ExperimentStatus = ({ status }) => {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Draft;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
};

const ProjectExperiments = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredExperiments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return MOCK_EXPERIMENTS.filter((experiment) => {
      const matchesSearch =
        !normalizedSearch ||
        experiment.name.toLowerCase().includes(normalizedSearch) ||
        experiment.dataset.toLowerCase().includes(normalizedSearch) ||
        experiment.algorithm.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || experiment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleCreateExperiment = () => {
    setIsCreateOpen(true);
  };

  return (
    <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center border rounded-lg h-9 w-9 shrink-0 border-border bg-muted/40">
                <FlaskConical className="h-4.5 w-4.5 text-foreground" />
              </div>

              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Experiments
              </h1>
            </div>

            <p className="max-w-2xl mt-2 text-sm leading-6 text-muted-foreground">
              Run and manage machine learning experiments for this project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateExperiment}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:h-10"
          >
            <Plus className="w-4 h-4" />
            Create Experiment
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4">
          <div className="px-4 py-3 border rounded-lg border-border bg-card">
            <p className="text-xs font-medium text-muted-foreground">
              Total Experiments
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {MOCK_EXPERIMENTS.length}
            </p>
          </div>

          <div className="px-4 py-3 border rounded-lg border-border bg-card">
            <p className="text-xs font-medium text-muted-foreground">Running</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {
                MOCK_EXPERIMENTS.filter(
                  (experiment) => experiment.status === "Running",
                ).length
              }
            </p>
          </div>

          <div className="px-4 py-3 border rounded-lg border-border bg-card">
            <p className="text-xs font-medium text-muted-foreground">
              Completed
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {
                MOCK_EXPERIMENTS.filter(
                  (experiment) => experiment.status === "Completed",
                ).length
              }
            </p>
          </div>

          <div className="px-4 py-3 border rounded-lg border-border bg-card">
            <p className="text-xs font-medium text-muted-foreground">Drafts</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {
                MOCK_EXPERIMENTS.filter(
                  (experiment) => experiment.status === "Draft",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 mt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none left-3 top-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search experiments..."
              className="w-full h-10 text-sm transition-colors border rounded-md outline-none border-input bg-background pl-9 pr-9 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute flex items-center justify-center w-6 h-6 transition-colors -translate-y-1/2 rounded right-2 top-1/2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-col w-full gap-2 sm:flex-row sm:items-center lg:w-auto">
            <div className="flex items-center h-10 gap-2 px-3 text-sm border rounded-md border-input bg-background text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Status</span>
            </div>

            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <h2 className="text-sm font-medium text-foreground">Experiments</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {filteredExperiments.length}{" "}
              {filteredExperiments.length === 1 ? "experiment" : "experiments"}
            </p>
          </div>
        </div>

        {/* Desktop / Tablet Experiment List */}
        <div className="hidden mt-3 overflow-hidden border rounded-lg border-border bg-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Experiment
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Dataset
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Algorithm
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Updated
                  </th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredExperiments.map((experiment) => (
                  <tr
                    key={experiment.id}
                    className="transition-colors group hover:bg-muted/30"
                  >
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        className="text-left"
                        onClick={() =>
                          navigate(
                            `/app/projects/${projectId}/experiments/${experiment.id}`,
                          )
                        }
                      >
                        <p className="max-w-[230px] truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                          {experiment.name}
                        </p>
                        <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted-foreground">
                          {experiment.description}
                        </p>
                      </button>
                    </td>

                    <td className="px-4 py-3.5">
                      <ExperimentStatus status={experiment.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center min-w-0 gap-2">
                        <Database className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="max-w-[150px] truncate text-sm text-foreground">
                          {experiment.dataset}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center min-w-0 gap-2">
                        <Cpu className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="max-w-[130px] truncate text-sm text-foreground">
                          {experiment.algorithm}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />
                        {experiment.updatedAt}
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 transition-all rounded-md opacity-0 text-muted-foreground hover:bg-muted hover:text-foreground group-hover:opacity-100 focus:opacity-100"
                        aria-label={`More actions for ${experiment.name}`}
                      >
                        <Ellipsis className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Experiment List */}
        <div className="mt-3 space-y-3 md:hidden">
          {filteredExperiments.map((experiment) => (
            <button
              key={experiment.id}
              type="button"
              onClick={() =>
                navigate(
                  `/app/projects/${projectId}/experiments/${experiment.id}`,
                )
              }
              className="w-full p-4 text-left transition-colors border rounded-lg group border-border bg-card hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-foreground group-hover:text-primary">
                    {experiment.name}
                  </p>

                  <p className="mt-1 text-xs leading-5 line-clamp-2 text-muted-foreground">
                    {experiment.description}
                  </p>
                </div>

                <ExperimentStatus status={experiment.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-border pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Database className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{experiment.dataset}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{experiment.algorithm}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 shrink-0" />
                  <span>Updated {experiment.updatedAt}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* No Results */}
        {filteredExperiments.length === 0 && (
          <div className="mt-3 flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center">
            <div className="flex items-center justify-center rounded-full h-11 w-11 bg-muted">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-sm font-medium text-foreground">
              No experiments found
            </h3>

            <p className="max-w-sm mt-1 text-xs leading-5 text-muted-foreground">
              No experiments match your current search or status filter.
            </p>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Initial Empty-State Design Reference */}
        {/*
          When backend integration is added, this section can replace the
          experiment list when there are genuinely no experiments.

          The UI is intentionally kept here as a design reference rather
          than showing alongside the mock data.
        */}
      </div>

      {/* Create Experiment Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-lg overflow-hidden border shadow-xl rounded-xl border-border bg-background"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-experiment-title"
          >
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border sm:px-6">
              <div className="flex items-start min-w-0 gap-3">
                <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-muted">
                  <Beaker className="h-4.5 w-4.5 text-foreground" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="create-experiment-title"
                    className="text-sm font-semibold text-foreground"
                  >
                    Create Experiment
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Configure a new machine learning experiment for this
                    project.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="flex items-center justify-center w-8 h-8 transition-colors rounded-md shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close create experiment dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 sm:px-6">
              <div>
                <label
                  htmlFor="experiment-name"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Experiment Name
                </label>

                <input
                  id="experiment-name"
                  type="text"
                  placeholder="e.g. Customer Churn Baseline"
                  className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label
                  htmlFor="experiment-dataset"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Dataset
                </label>

                <div className="relative">
                  <select
                    id="experiment-dataset"
                    defaultValue=""
                    className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  >
                    <option value="" disabled>
                      Select a dataset
                    </option>
                    <option value="dataset-1">
                      Select from project datasets
                    </option>
                  </select>

                  <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="experiment-algorithm"
                  className="mb-1.5 block text-xs font-medium text-foreground"
                >
                  Algorithm
                </label>

                <div className="relative">
                  <select
                    id="experiment-algorithm"
                    defaultValue=""
                    className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  >
                    <option value="" disabled>
                      Select an algorithm
                    </option>
                    <option value="random-forest">Random Forest</option>
                    <option value="linear-regression">Linear Regression</option>
                    <option value="logistic-regression">
                      Logistic Regression
                    </option>
                    <option value="xgboost">XGBoost</option>
                    <option value="k-means">K-Means</option>
                  </select>

                  <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 px-3 py-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Additional experiment configuration can be added here when the
                  experiment workflow is connected to the backend.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 px-5 py-4 border-t border-border bg-muted/20 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 text-sm font-medium transition-colors border rounded-md h-9 border-input bg-background text-foreground hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 px-4 text-sm font-medium rounded-md opacity-50 h-9 bg-primary text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
                Create Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectExperiments;
