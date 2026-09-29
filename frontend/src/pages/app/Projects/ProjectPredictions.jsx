import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import predictionService from "@/services/prediction/predictionService";

import { CreatePredictionModal } from "@/components/components.index";

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

const ProjectPredictions = () => {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const fetchPredictions = useCallback(
    async ({ silent = false } = {}) => {
      if (!projectId || !experimentId) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }

        setError(null);

        const data = await predictionService.getPredictions(
          projectId,
          experimentId,
        );

        setPredictions(data ?? []);
      } catch (error) {
        console.error("Failed to fetch predictions:", error);

        setError(
          error?.response?.data?.message || "Failed to load predictions.",
        );
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [projectId, experimentId],
  );

  const handleCreatePrediction = async (predictionData) => {
    try {
      setIsCreating(true);

      await predictionService.createPrediction(
        projectId,
        experimentId,
        predictionData,
      );

      setIsCreateModalOpen(false);

      await fetchPredictions({ silent: true });

      toast.success("Prediction created successfully.");
    } catch (error) {
      console.error("Failed to create prediction:", error);

      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleBack = () => {
    navigate(`/app/projects/${projectId}/experiments/${experimentId}`);
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
            Back to Experiment
          </button>

          <div className="p-6 mt-6 border rounded-lg border-destructive/30 bg-destructive/5">
            <h2 className="text-sm font-medium text-foreground">
              Unable to load predictions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full mx-auto max-w-7xl">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Experiment
        </button>

        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Predictions
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Run predictions using this experiment's trained model.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-surface hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create Prediction
          </button>
        </div>

        <section className="mt-6 border rounded-lg border-border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-medium text-foreground">
              Prediction Runs
            </h2>
          </div>

          {predictions.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No predictions have been created for this experiment yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {predictions.map((prediction) => {
                const status = prediction.predictionStatus;

                const statusLabel = STATUS_LABELS[status] ?? status;

                const statusClass =
                  STATUS_CLASSES[status] ?? "bg-muted text-muted-foreground";

                return (
                  <div key={prediction.id} className="px-5 py-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-8">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-foreground">
                            {prediction.name}
                          </h3>

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-3 mt-3 text-sm sm:grid-cols-2 lg:grid-cols-[0.8fr_1.5fr_0.8fr_1.3fr]">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Type
                            </p>
                            <p className="mt-1 text-foreground">
                              {prediction.predictionType || "—"}
                            </p>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">
                              Input File
                            </p>
                            <p
                              className="mt-1 truncate text-foreground"
                              title={prediction.inputFileName || ""}
                            >
                              {prediction.inputFileName || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Rows Processed
                            </p>
                            <p className="mt-1 text-foreground">
                              {prediction.rowsProcessed ?? "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">
                              Created
                            </p>
                            <p className="mt-1 text-foreground">
                              {formatDateTime(prediction.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/app/projects/${projectId}/experiments/${experimentId}/predictions/${prediction.id}`,
                          )
                        }
                        className="self-start px-3 py-2 text-sm font-medium rounded-md lg:self-center text-primary hover:bg-primary/10"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePrediction}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default ProjectPredictions;
