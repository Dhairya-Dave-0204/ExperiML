import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Beaker, ChevronDown, Loader2, Plus, Sparkles, X } from "lucide-react";

import datasetService from "@/services/dataset/datasetService";
import experimentService from "@/services/experiment/experimentService";

const PROBLEM_TYPES = [
  { value: "CLASSIFICATION", label: "Classification" },
  { value: "REGRESSION", label: "Regression" },
  { value: "CLUSTERING", label: "Clustering" },
  { value: "TIME_SERIES", label: "Time Series" },
  { value: "ANOMALY_DETECTION", label: "Anomaly Detection" },
];

const CreateExperimentModal = ({ onClose, onCreateSuccess }) => {
  const { projectId } = useParams();

  const [experimentName, setExperimentName] = useState("");
  const [dataset, setDataset] = useState("");
  const [problemType, setProblemType] = useState("");
  const [algorithm, setAlgorithm] = useState("");

  const [datasets, setDatasets] = useState([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);
  const [datasetError, setDatasetError] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      if (!projectId) return;

      try {
        setIsLoadingDatasets(true);
        setDatasetError(null);

        const data = await datasetService.getProjectDatasets(projectId);

        const readyDatasets = (data ?? []).filter(
          (item) => item.datasetStatus === "READY",
        );

        setDatasets(readyDatasets);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);

        setDatasetError(
          error?.response?.data?.message || "Failed to load project datasets.",
        );
      } finally {
        setIsLoadingDatasets(false);
      }
    };

    fetchDatasets();
  }, [projectId]);

  const handleCreate = async () => {
    if (!projectId) return;

    const name = experimentName.trim();

    if (!name) {
      setError("Experiment name is required.");
      return;
    }

    if (!dataset) {
      setError("Please select a dataset.");
      return;
    }

    if (!problemType) {
      setError("Please select a problem type.");
      return;
    }

    if (!algorithm) {
      setError("Please select an algorithm.");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const createdExperiment = await experimentService.createExperiment(
        projectId,
        {
          name,
          datasetId: dataset,
          problemType,
          algorithmName: algorithm,
          configuration: {},
          hyperparameters: {},
        },
      );

      onCreateSuccess?.(createdExperiment);
      onClose();
    } catch (error) {
      console.error("Failed to create experiment:", error);

      setError(
        error?.response?.data?.message || "Failed to create experiment.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div
        className="w-full max-w-lg overflow-hidden border shadow-xl rounded-xl border-border bg-background"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-experiment-title"
      >
        {/* Header */}
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
                Configure a new machine learning experiment for this project.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-md shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close create experiment dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-5 space-y-4 sm:px-6">
          {/* Experiment Name */}
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
              value={experimentName}
              onChange={(event) => {
                setExperimentName(event.target.value);
                setError(null);
              }}
              placeholder="e.g. Customer Churn Baseline"
              disabled={isCreating}
              className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Dataset */}
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
                value={dataset}
                onChange={(event) => {
                  setDataset(event.target.value);
                  setError(null);
                }}
                disabled={isLoadingDatasets || isCreating}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  {isLoadingDatasets
                    ? "Loading datasets..."
                    : "Select a dataset"}
                </option>

                {datasets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
            </div>

            {!isLoadingDatasets && !datasetError && datasets.length === 0 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                No ready datasets are available for this project.
              </p>
            )}

            {datasetError && (
              <p className="mt-1.5 text-xs text-destructive">{datasetError}</p>
            )}
          </div>

          {/* Problem Type */}
          <div>
            <label
              htmlFor="experiment-problem-type"
              className="mb-1.5 block text-xs font-medium text-foreground"
            >
              Problem Type
            </label>

            <div className="relative">
              <select
                id="experiment-problem-type"
                value={problemType}
                onChange={(event) => {
                  setProblemType(event.target.value);
                  setError(null);
                }}
                disabled={isCreating}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  Select a problem type
                </option>

                {PROBLEM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Algorithm */}
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
                value={algorithm}
                onChange={(event) => {
                  setAlgorithm(event.target.value);
                  setError(null);
                }}
                disabled={isCreating}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  Select an algorithm
                </option>

                <option value="random-forest">Random Forest</option>
                <option value="linear-regression">Linear Regression</option>
                <option value="logistic-regression">Logistic Regression</option>
                <option value="xgboost">XGBoost</option>
                <option value="k-means">K-Means</option>
              </select>

              <ChevronDown className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-3 top-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <p className="text-xs leading-5 text-destructive">{error}</p>
            </div>
          )}

          {/* Informational Message */}
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 px-3 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <p className="text-xs leading-5 text-muted-foreground">
              The experiment will be queued after creation and execution will
              begin asynchronously.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 px-5 py-4 border-t border-border bg-muted/20 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="px-4 text-sm font-medium transition-colors border rounded-md h-9 border-input bg-background text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isCreating || isLoadingDatasets || datasets.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 text-sm font-medium rounded-md h-9 bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Experiment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExperimentModal;
