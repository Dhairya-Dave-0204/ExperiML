import { useCallback, useEffect, useState } from "react";

import { ArrowLeft, Loader2 } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { ExperimentStatusPill } from "@/components/components.index";

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

const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatMetricValue = (value) => {
  if (typeof value !== "number") {
    return String(value ?? "—");
  }

  return value.toFixed(4);
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const ExperimentDetails = () => {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();

  const [experiment, setExperiment] = useState(null);
  const [datasetName, setDatasetName] = useState("Unknown dataset");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -------------------------------------------------------------- */
  /* Fetch experiment                                                */
  /* -------------------------------------------------------------- */

  const fetchExperiment = useCallback(
    async ({ silent = false } = {}) => {
      if (!projectId || !experimentId) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        setError(null);

        const data = await experimentService.getExperimentById(
          projectId,
          experimentId,
        );

        setExperiment(data);
      } catch (error) {
        console.error("Failed to fetch experiment:", error);

        setError(
          error?.response?.data?.message || "Failed to load experiment.",
        );
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [projectId, experimentId],
  );

  /* -------------------------------------------------------------- */
  /* Initial fetch                                                   */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    const loadInitialData = async () => {
      if (!projectId || !experimentId) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [experimentData, datasetData] = await Promise.all([
          experimentService.getExperimentById(projectId, experimentId),
          datasetService.getProjectDatasets(projectId),
        ]);

        setExperiment(experimentData);

        const selectedDataset = datasetData.find(
          (dataset) => dataset.id === experimentData.datasetId,
        );

        setDatasetName(selectedDataset?.name ?? "Unknown dataset");
      } catch (error) {
        console.error("Failed to fetch experiment details:", error);

        setError(
          error?.response?.data?.message || "Failed to load experiment.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [projectId, experimentId]);

  /* -------------------------------------------------------------- */
  /* Automatic polling                                               */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    if (!experiment) {
      return undefined;
    }

    const isActive = ACTIVE_STATUSES.has(experiment.experimentStatus);

    if (!isActive) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      fetchExperiment({ silent: true });
    }, POLLING_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [experiment, fetchExperiment]);

  /* -------------------------------------------------------------- */
  /* Navigation                                                      */
  /* -------------------------------------------------------------- */

  const handleBack = () => {
    navigate(`/app/projects/${projectId}/experiments`);
  };

  /* -------------------------------------------------------------- */
  /* Loading                                                         */
  /* -------------------------------------------------------------- */

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /* Error                                                           */
  /* -------------------------------------------------------------- */

  if (error) {
    return (
      <div className="w-full px-4">
        <div className="py-4 mx-auto max-w-7xl">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Experiments
          </button>

          <div className="p-6 mt-6 border rounded-lg border-destructive/30 bg-destructive/5">
            <h2 className="text-sm font-medium text-foreground">
              Unable to load experiment
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!experiment) {
    return null;
  }

  const configuration = experiment.configuration ?? {};
  const hyperparameters = experiment.hyperparameters ?? {};
  const metrics = experiment.metrics ?? {};

  const statusLabel =
    STATUS_LABELS[experiment.experimentStatus] ?? experiment.experimentStatus;

  const hasConfiguration = Object.keys(configuration).length > 0;

  const hasHyperparameters = Object.keys(hyperparameters).length > 0;

  const hasMetrics = Object.keys(metrics).length > 0;

  return (
    <div className="w-full px-4">
      <div className="w-full py-2 mx-auto max-w-7xl">
        {/* -------------------------------------------------------- */}
        {/* Back                                                       */}
        {/* -------------------------------------------------------- */}

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiments
        </button>

        {/* -------------------------------------------------------- */}
        {/* Header                                                     */}
        {/* -------------------------------------------------------- */}

        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-foreground">
                {experiment.name}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Experiment details and execution configuration
              </p>
            </div>

            <ExperimentStatusPill status={statusLabel} />
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* Experiment Information                                    */}
        {/* -------------------------------------------------------- */}

        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Experiment Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Problem Type</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {experiment.problemType}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Algorithm</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {experiment.algorithmName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Dataset</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {datasetName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Target Column</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {configuration.targetColumn || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Created</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDateTime(experiment.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Updated</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDateTime(experiment.updatedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Started</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDateTime(experiment.startedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Completed</p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDateTime(experiment.completedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Execution ID</p>

              <p className="mt-1 text-sm font-medium break-all text-foreground">
                {experiment.executionId || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Configuration                                             */}
        {/* -------------------------------------------------------- */}

        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Configuration
            </h2>
          </div>

          <div className="p-5">
            {hasConfiguration ? (
              <div className="border divide-y rounded-md border-border">
                {Object.entries(configuration).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {formatLabel(key)}
                    </p>

                    <p className="text-sm wrap-break-word text-muted-foreground sm:col-span-2">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No configuration provided.
              </p>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Hyperparameters                                          */}
        {/* -------------------------------------------------------- */}

        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Hyperparameters
            </h2>
          </div>

          <div className="p-5">
            {hasHyperparameters ? (
              <div className="border divide-y rounded-md border-border">
                {Object.entries(hyperparameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {formatLabel(key)}
                    </p>

                    <p className="text-sm wrap-break-word text-muted-foreground sm:col-span-2">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hyperparameters configured.
              </p>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Metrics                                                    */}
        {/* -------------------------------------------------------- */}

        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Metrics</h2>
          </div>

          <div className="p-5">
            {hasMetrics ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(metrics).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-4 py-4 border rounded-lg border-border bg-muted/20"
                  >
                    <p className="font-medium text-muted-foreground">
                      {formatLabel(key)}
                    </p>

                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {formatMetricValue(value)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Metrics are not available yet.
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 mb-6 border rounded-lg border-border bg-card">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-foreground">
                Predictions
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Run predictions using this experiment's trained model.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/app/projects/${projectId}/experiments/${experimentId}/predictions`,
                )
              }
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View Predictions
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExperimentDetails;
