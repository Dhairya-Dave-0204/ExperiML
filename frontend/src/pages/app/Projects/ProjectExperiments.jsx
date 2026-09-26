import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  ExperimentsHeader,
  ExperimentsToolbar,
  ExperimentList,
  CreateExperimentModal,
} from "@/components/components.index";

import experimentService from "@/services/experiment/experimentService";
import datasetService from "@/services/dataset/datasetService";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_LABELS = {
  CREATED: "Draft",
  QUEUED: "Queued",
  TRAINING: "Running",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiments = useCallback(async () => {
    if (!projectId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [experimentData, datasetData] = await Promise.all([
        experimentService.getProjectExperiments(projectId),
        datasetService.getProjectDatasets(projectId),
      ]);

      const datasetMap = datasetData.reduce((map, dataset) => {
        map[dataset.id] = dataset.name;
        return map;
      }, {});

      const mappedExperiments = experimentData.map((experiment) =>
        mapExperimentToUI(experiment, datasetMap),
      );

      setExperiments(mappedExperiments);
    } catch (error) {
      console.error("Failed to fetch experiments:", error);

      setError(error?.response?.data?.message || "Failed to load experiments.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

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

  const handleCreateExperiment = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreateExperiment = () => {
    setIsCreateOpen(false);
  };

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
          <CreateExperimentModal onClose={handleCloseCreateExperiment} />
        )}
      </div>
    </div>
  );
};

export default ProjectExperiments;
