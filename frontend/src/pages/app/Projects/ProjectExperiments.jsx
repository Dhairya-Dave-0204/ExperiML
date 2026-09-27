import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [experiments, setExperiments] = useState([]);
  const [datasetMap, setDatasetMap] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        <ExperimentList experiments={filteredExperiments} />

        {isCreateOpen && (
          <CreateExperimentModal
            onClose={handleCloseCreateExperiment}
            onCreateSuccess={handleCreateSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectExperiments;
