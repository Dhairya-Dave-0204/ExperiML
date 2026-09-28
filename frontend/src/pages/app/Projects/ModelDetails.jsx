import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import modelService from "@/services/model/modelService";
import artifactService from "@/services/artifact/artifactService";

const formatDate = (date) => {
  if (!date) return "—";

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

const formatProblemType = (problemType) => {
  if (!problemType) return "—";

  return problemType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatAlgorithm = (algorithmName) => {
  if (!algorithmName) return "—";

  return algorithmName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatFileSize = (fileSize) => {
  if (fileSize === null || fileSize === undefined) {
    return "—";
  }

  const bytes = Number(fileSize);

  if (Number.isNaN(bytes)) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ModelDetails = () => {
  const { projectId, modelId } = useParams();

  const [modelDetails, setModelDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [downloadingArtifactId, setDownloadingArtifactId] = useState(null);

  const fetchModelDetails = useCallback(async () => {
    if (!projectId || !modelId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await modelService.getModelDetails(projectId, modelId);

      setModelDetails(data);
    } catch (error) {
      console.error("Failed to fetch model details:", error);

      setError(
        error?.response?.data?.message || "Failed to load model details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId, modelId]);

  const handleDownloadArtifact = async (artifact) => {
    if (!artifact || !experiment?.id) return;

    try {
      setDownloadingArtifactId(artifact.id);

      const response = await artifactService.downloadArtifact(
        projectId,
        experiment.id,
        artifact.id,
      );

      const blob = new Blob([response.data], {
        type: artifact.mimeType || "application/octet-stream",
      });

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        artifact.originalFileName || artifact.artifactName || "artifact";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download artifact:", error);
    } finally {
      setDownloadingArtifactId(null);
    }
  };

  useEffect(() => {
    fetchModelDetails();
  }, [fetchModelDetails]);

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <div className="w-full py-8 mx-auto max-w-7xl">
          <p className="text-sm text-muted-foreground">
            Loading model details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4">
        <div className="w-full py-8 mx-auto max-w-7xl">
          <div className="p-4 border rounded-lg border-destructive/30 bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>

            <button
              type="button"
              onClick={fetchModelDetails}
              className="px-3 py-2 mt-3 text-sm font-medium border rounded-md border-border text-foreground hover:bg-muted"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!modelDetails) {
    return null;
  }

  const { model, preprocessingPipeline, experiment } = modelDetails;

  return (
    <div className="w-full px-4">
      <div className="w-full mx-auto max-w-7xl">
        <Link
          to={`/app/projects/${projectId}/models`}
          className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Models
        </Link>

        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {experiment?.name || "Model Details"}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                {formatProblemType(experiment?.problemType)}
              </span>

              <span className="text-muted-foreground">•</span>

              <span className="text-sm text-muted-foreground">
                {formatAlgorithm(experiment?.algorithmName)}
              </span>
            </div>
          </div>

          <span className="self-start px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground">
            {model?.artifactStatus || "Unknown"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="p-5 border rounded-lg border-border bg-card">
            <h2 className="text-base font-semibold text-foreground">
              Model Information
            </h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Algorithm</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatAlgorithm(experiment?.algorithmName)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Problem Type</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatProblemType(experiment?.problemType)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Experiment</p>
                <Link
                  to={`/app/projects/${projectId}/experiments/${experiment?.id}`}
                  className="inline-block mt-1 text-sm font-medium text-foreground hover:underline"
                >
                  {experiment?.name || "—"}
                </Link>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Training Status</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {experiment?.experimentStatus || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(model?.createdAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="p-5 border rounded-lg border-border bg-card">
            <h2 className="text-base font-semibold text-foreground">
              Performance
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {experiment?.metrics?.accuracy !== undefined
                    ? `${(experiment.metrics.accuracy * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>

              <div className="p-4 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Precision</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {experiment?.metrics?.precision !== undefined
                    ? `${(experiment.metrics.precision * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>

              <div className="p-4 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">Recall</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {experiment?.metrics?.recall !== undefined
                    ? `${(experiment.metrics.recall * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>

              <div className="p-4 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground">F1 Score</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {experiment?.metrics?.f1 !== undefined
                    ? `${(experiment.metrics.f1 * 100).toFixed(1)}%`
                    : "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="p-5 border rounded-lg border-border bg-card lg:col-span-2">
            <h2 className="text-base font-semibold text-foreground">
              Artifacts
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-3 p-4 border rounded-md border-border sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Model</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {model?.originalFileName || model?.artifactName || "—"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatFileSize(model?.fileSize)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4 border rounded-md border-border sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Preprocessing Pipeline
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {preprocessingPipeline?.originalFileName ||
                      preprocessingPipeline?.artifactName ||
                      "Not available"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatFileSize(preprocessingPipeline?.fileSize)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModelDetails;
