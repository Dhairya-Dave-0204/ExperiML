import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import predictionService from "@/services/prediction/predictionService";

const STATUS_LABELS = {
  CREATED: "Created",
  RUNNING: "Running",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

const STATUS_CLASSES = {
  CREATED: "bg-muted text-muted-foreground",
  RUNNING: "bg-blue-500/10 text-blue-600",
  COMPLETED: "bg-green-500/10 text-green-600",
  FAILED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-yellow-500/10 text-yellow-600",
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

const formatFileSize = (size) => {
  if (size === null || size === undefined) {
    return "—";
  }

  const bytes = Number(size);

  if (!Number.isFinite(bytes)) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const PredictionDetails = () => {
  const { projectId, experimentId, predictionId } = useParams();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrediction = useCallback(async () => {
    if (!projectId || !experimentId || !predictionId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await predictionService.getPredictionDetails(
        projectId,
        experimentId,
        predictionId,
      );

      setPrediction(data);
    } catch (error) {
      console.error("Failed to fetch prediction:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load prediction details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId, experimentId, predictionId]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  const handleBack = () => {
    navigate(
      `/app/projects/${projectId}/experiments/${experimentId}/predictions`,
    );
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
        <div className="py-4 mx-auto max-w-7xl">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </button>

          <div className="p-6 mt-6 border rounded-lg border-destructive/30 bg-destructive/5">
            <h2 className="text-sm font-medium text-foreground">
              Unable to load prediction
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const status = prediction.predictionStatus;

  const statusLabel = STATUS_LABELS[status] ?? status;

  const statusClass =
    STATUS_CLASSES[status] ??
    "bg-muted text-muted-foreground";

  const outputArtifact = prediction.outputArtifact;

  return (
    <div className="w-full px-4">
      <div className="w-full mx-auto max-w-7xl">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Predictions
        </button>

        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                {prediction.name}
              </h1>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Prediction details and execution information.
            </p>
          </div>
        </div>

        {/* Prediction Information */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Prediction Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Prediction Type
              </p>
              <p className="mt-1 text-sm text-foreground">
                {prediction.predictionType || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Rows Processed
              </p>
              <p className="mt-1 text-sm text-foreground">
                {prediction.rowsProcessed ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDateTime(prediction.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatDateTime(prediction.completedAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Input File */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Input File
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                File Name
              </p>

              <p
                className="mt-1 text-sm truncate text-foreground"
                title={prediction.inputFileName || ""}
              >
                {prediction.inputFileName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Format
              </p>

              <p className="mt-1 text-sm text-foreground">
                {prediction.inputFormat || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                File Size
              </p>

              <p className="mt-1 text-sm text-foreground">
                {formatFileSize(prediction.fileSize)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                MIME Type
              </p>

              <p className="mt-1 text-sm truncate text-foreground">
                {prediction.mimeType || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Execution */}
        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Execution
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Prediction ID
              </p>

              <p className="mt-1 font-mono text-xs break-all text-foreground">
                {prediction.id}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Execution ID
              </p>

              <p className="mt-1 font-mono text-xs break-all text-foreground">
                {prediction.executionId || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Started
              </p>

              <p className="mt-1 text-sm text-foreground">
                {formatDateTime(prediction.startedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>

              <p className="mt-1 text-sm text-foreground">
                {formatDateTime(prediction.completedAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Output Artifact */}
        <section className="mt-6 mb-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Prediction Output
            </h2>
          </div>

          {outputArtifact ? (
            <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  File Name
                </p>

                <p
                  className="mt-1 text-sm truncate text-foreground"
                  title={outputArtifact.originalFileName || ""}
                >
                  {outputArtifact.originalFileName || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Format
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {outputArtifact.fileFormat || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  File Size
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {formatFileSize(outputArtifact.fileSize)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Status
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {outputArtifact.artifactStatus || "—"}
                </p>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <p className="text-xs text-muted-foreground">
                  Artifact
                </p>

                <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">
                      {outputArtifact.artifactName || "Prediction output"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Created{" "}
                      {formatDateTime(outputArtifact.createdAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md opacity-50 cursor-not-allowed bg-primary text-surface"
                  >
                    <Download className="w-4 h-4" />
                    Download Output
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-5 py-8">
              <p className="text-sm text-muted-foreground">
                No prediction output is available yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PredictionDetails;