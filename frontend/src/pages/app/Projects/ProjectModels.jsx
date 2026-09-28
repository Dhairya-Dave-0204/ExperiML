import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import modelService from "@/services/model/modelService";

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

const ProjectModels = () => {
  const { projectId } = useParams();

  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);

      const modelData = await modelService.getProjectModels(projectId);

      setModels(modelData);
    } catch (error) {
      console.error("Failed to fetch models:", error);

      setError(error?.response?.data?.message || "Failed to load models.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const modelCount = useMemo(() => models.length, [models]);

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <div className="w-full py-8 mx-auto max-w-7xl">
          <p className="text-sm text-muted-foreground">Loading models...</p>
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
              onClick={fetchModels}
              className="px-3 py-2 mt-3 text-sm font-medium border rounded-md border-border text-foreground hover:bg-muted"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full py-6 mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Models</h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {modelCount} {modelCount === 1 ? "model" : "models"} generated
                from experiments.
              </p>
            </div>
          </div>
        </div>

        {models.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-border bg-card min-h-48">
            <h2 className="text-base font-medium text-foreground">
              No models yet
            </h2>

            <p className="max-w-md mt-2 text-sm text-muted-foreground">
              Models will appear here after an experiment successfully completes
              training.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-5 border rounded-lg border-border bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-medium truncate text-foreground">
                      {model.experiment?.name || "Unnamed model"}
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {model.artifactName || "model.joblib"}
                    </p>
                  </div>

                  <span className="px-2 py-1 text-xs font-medium rounded-md shrink-0 bg-muted text-muted-foreground">
                    {model.artifactStatus || "Unknown"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Problem Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatProblemType(model.experiment?.problemType)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Algorithm</p>

                    <p className="mt-1 text-sm font-medium truncate text-foreground">
                      {formatAlgorithm(model.experiment?.algorithmName)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatDate(model.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Experiment</p>

                    <p className="mt-1 text-sm font-medium truncate text-foreground">
                      {model.experiment?.name || "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModels;
