import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  ExperimentsHeader,
  ExperimentsToolbar,
  ExperimentList,
  CreateExperimentModal,
} from "@/components/components.index";

import experimentService from "@/services/experiment/experimentService";

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

const ProjectExperiments = () => {
  const { projectId } = useParams();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExperiments = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await experimentService.getProjectExperiments(projectId);

      setExperiments(data);
    } catch (error) {
      console.error("Failed to fetch experiments:", error);

      setError(error?.response?.data?.message || "Failed to load experiments.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

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

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

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
