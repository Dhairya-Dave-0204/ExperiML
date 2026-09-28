import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  ExperimentsHeader,
  ExperimentsToolbar,
  ExperimentList,
  CreateExperimentModal,
} from "@/components/components.index";

import experimentService from "@/services/experiment/experimentService";
import datasetService from "@/services/dataset/datasetService";

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_LABELS = {
  CREATED: "Draft",
  QUEUED: "Queued",
  TRAINING: "Running",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const ACTIVE_STATUSES = new Set(["QUEUED", "TRAINING"]);

const POLLING_INTERVAL = 3000;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatExperimentDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const mapExperimentToUI = (experiment, datasetMap) => {
  return {
    id: experiment.id,
    name: experiment.name,

    datasetId: experiment.datasetId,
    dataset: datasetMap[experiment.datasetId] ?? "Unknown dataset",

    // Keep the backend status for polling logic.
    experimentStatus: experiment.experimentStatus,

    status:
      STATUS_LABELS[experiment.experimentStatus] ?? experiment.experimentStatus,

    algorithm: experiment.algorithmName,
    problemType: experiment.problemType,

    started: experiment.startedAt
      ? formatExperimentDate(experiment.startedAt)
      : "Not started",

    createdAt: formatExperimentDate(experiment.createdAt),
    updatedAt: formatExperimentDate(experiment.updatedAt),

    metrics: experiment.metrics,
  };
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const ProjectExperiments = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [experiments, setExperiments] = useState([]);
  const [datasetMap, setDatasetMap] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [experimentToDelete, setExperimentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  /* -------------------------------------------------------------- */
  /* Fetch experiments                                               */
  /* -------------------------------------------------------------- */

  const fetchExperiments = useCallback(
    async ({ silent = false } = {}) => {
      if (!projectId) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        setError(null);

        const experimentData =
          await experimentService.getProjectExperiments(projectId);

        const mappedExperiments = experimentData.map((experiment) =>
          mapExperimentToUI(experiment, datasetMap),
        );

        setExperiments(mappedExperiments);
      } catch (error) {
        console.error("Failed to fetch experiments:", error);

        setError(
          error?.response?.data?.message || "Failed to load experiments.",
        );
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [projectId, datasetMap],
  );

  /* -------------------------------------------------------------- */
  /* Initial page load                                               */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    const loadInitialData = async () => {
      if (!projectId) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [datasetData, experimentData] = await Promise.all([
          datasetService.getProjectDatasets(projectId),
          experimentService.getProjectExperiments(projectId),
        ]);

        const map = datasetData.reduce((accumulator, dataset) => {
          accumulator[dataset.id] = dataset.name;
          return accumulator;
        }, {});

        setDatasetMap(map);

        const mappedExperiments = experimentData.map((experiment) =>
          mapExperimentToUI(experiment, map),
        );

        setExperiments(mappedExperiments);
      } catch (error) {
        console.error("Failed to load experiments:", error);

        setError(
          error?.response?.data?.message || "Failed to load experiments.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [projectId]);

  /* -------------------------------------------------------------- */
  /* Automatic polling                                               */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    const hasActiveExperiments = experiments.some((experiment) =>
      ACTIVE_STATUSES.has(experiment.experimentStatus),
    );

    if (!hasActiveExperiments) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      fetchExperiments({ silent: true });
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [experiments, fetchExperiments]);

  /* -------------------------------------------------------------- */
  /* Filtering                                                       */
  /* -------------------------------------------------------------- */

  const filteredExperiments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return experiments.filter((experiment) => {
      const matchesSearch =
        !normalizedSearch ||
        experiment.name.toLowerCase().includes(normalizedSearch) ||
        experiment.dataset.toLowerCase().includes(normalizedSearch) ||
        experiment.algorithm.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || experiment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [experiments, search, statusFilter]);

  /* -------------------------------------------------------------- */
  /* Create Experiment                                               */
  /* -------------------------------------------------------------- */

  const handleCreateExperiment = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreateExperiment = () => {
    setIsCreateOpen(false);
  };

  const handleCreateSuccess = async () => {
    // Fetch only the experiments endpoint.
    // The existing dataset map is reused.
    await fetchExperiments({ silent: true });

    toast.success("Experiment created successfully.");
  };

  /* -------------------------------------------------------------- */
  /* Experiment Actions                                              */
  /* -------------------------------------------------------------- */

  const handleExperimentClick = (experiment) => {
    navigate(`/app/projects/${projectId}/experiments/${experiment.id}`);
  };

  const handleDeleteExperiment = (experiment) => {
    setDeleteError(null);
    setExperimentToDelete(experiment);
  };

  const handleConfirmDelete = async () => {
    if (!experimentToDelete || !projectId) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await experimentService.deleteExperiment(
        projectId,
        experimentToDelete.id,
      );

      setExperimentToDelete(null);

      await fetchExperiments({ silent: true });

      toast.success("Experiment deleted successfully.");
    } catch (error) {
      console.error("Failed to delete experiment:", error);

      const message =
        error?.response?.data?.message || "Failed to delete experiment.";

      setDeleteError(message);

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  /* -------------------------------------------------------------- */
  /* Render                                                          */
  /* -------------------------------------------------------------- */

  return (
    <div className="w-full px-4">
      <div className="w-full mx-auto max-w-7xl">
        <ExperimentsHeader onCreateExperiment={handleCreateExperiment} />

        <ExperimentsToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <ExperimentList
          experiments={filteredExperiments}
          onExperimentClick={handleExperimentClick}
          onDelete={handleDeleteExperiment}
        />

        {isCreateOpen && (
          <CreateExperimentModal
            onClose={handleCloseCreateExperiment}
            onCreateSuccess={handleCreateSuccess}
          />
        )}

        {experimentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-surface border-border">
              <h2 className="text-base font-semibold text-foreground">
                Delete experiment?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {experimentToDelete.name}
                </span>
                ? This action cannot be undone.
              </p>

              {deleteError && (
                <p className="mt-3 text-sm text-destructive">{deleteError}</p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setExperimentToDelete(null);
                    setDeleteError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium border rounded-md border-border text-foreground hover:bg-surface-soft disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-400 rounded-md text-surface hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExperiments;
