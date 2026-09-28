import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import experimentService from "@/services/experiment/experimentService";

const STATUS_LABELS = {
  CREATED: "Draft",
  QUEUED: "Queued",
  TRAINING: "Running",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

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

const ExperimentDetails = () => {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();

  const [experiment, setExperiment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiment = async () => {
      if (!projectId || !experimentId) {
        return;
      }

      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchExperiment();
  }, [projectId, experimentId]);

  const handleBack = () => {
    navigate(`/app/projects/${projectId}/experiments`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4">
        <div className="py-8 mx-auto max-w-7xl">
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

  return (
    <div className="w-full px-4">
      <div className="w-full py-6 mx-auto max-w-7xl">
        {/* Back */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiments
        </button>

        {/* Header */}
        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {experiment.name}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Experiment details and execution configuration
              </p>
            </div>

            <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium border rounded-full border-border bg-muted/40 w-fit">
              {STATUS_LABELS[experiment.experimentStatus] ??
                experiment.experimentStatus}
            </div>
          </div>
        </div>

        {/* Experiment Information */}
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
              <p className="text-xs text-muted-foreground">Dataset ID</p>
              <p className="mt-1 text-sm font-medium break-all text-foreground">
                {experiment.datasetId}
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

        {/* Configuration */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Configuration
            </h2>
          </div>

          <div className="p-5">
            {Object.keys(configuration).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No additional configuration.
              </p>
            ) : (
              <pre className="p-4 overflow-x-auto text-xs rounded-md bg-muted/40">
                {JSON.stringify(configuration, null, 2)}
              </pre>
            )}
          </div>
        </section>

        {/* Hyperparameters */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Hyperparameters
            </h2>
          </div>

          <div className="p-5">
            {Object.keys(hyperparameters).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hyperparameters configured.
              </p>
            ) : (
              <pre className="p-4 overflow-x-auto text-xs rounded-md bg-muted/40">
                {JSON.stringify(hyperparameters, null, 2)}
              </pre>
            )}
          </div>
        </section>

        {/* Metrics */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">Metrics</h2>
          </div>

          <div className="p-5">
            {experiment.metrics ? (
              <pre className="p-4 overflow-x-auto text-xs rounded-md bg-muted/40">
                {JSON.stringify(experiment.metrics, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Metrics are not available yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExperimentDetails;
