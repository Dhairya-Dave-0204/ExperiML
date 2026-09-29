import { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

const CreatePredictionModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setFile(null);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Prediction name is required.");
      return;
    }

    if (!file) {
      setError("Prediction input file is required.");
      return;
    }

    try {
      await onSubmit({
        name: trimmedName,
        predictionType: "SINGLE",
        file,
      });
    } catch (error) {
      setError(
        error?.response?.data?.message || "Failed to create prediction.",
      );
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={isSubmitting ? undefined : onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden border shadow-xl rounded-xl border-border bg-surface">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Create Prediction
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Run a prediction using this experiment's trained model.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5 space-y-5">
            <div>
              <label
                htmlFor="prediction-name"
                className="block text-sm font-medium text-foreground"
              >
                Prediction Name
              </label>

              <input
                id="prediction-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                placeholder="e.g. Customer Prediction"
                maxLength={100}
                disabled={isSubmitting}
                className="w-full px-3 py-2 mt-2 text-sm border rounded-md outline-none border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">
                Prediction Type
              </label>

              <div className="px-3 py-2 mt-2 text-sm border rounded-md border-border bg-muted/40 text-foreground">
                Single Prediction
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                V1 supports one input row per prediction.
              </p>
            </div>

            <div>
              <label
                htmlFor="prediction-file"
                className="block text-sm font-medium text-foreground"
              >
                Input File
              </label>

              <label
                htmlFor="prediction-file"
                className="flex flex-col items-center justify-center w-full px-4 py-8 mt-2 text-center border border-dashed rounded-lg cursor-pointer border-border hover:bg-muted/30"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />

                <span className="mt-2 text-sm font-medium text-foreground">
                  {file ? file.name : "Choose prediction input file"}
                </span>

                <span className="mt-1 text-xs text-muted-foreground">
                  CSV, XLSX, or PARQUET
                </span>

                <input
                  id="prediction-file"
                  type="file"
                  accept=".csv,.xlsx,.parquet"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="sr-only"
                />
              </label>

              {file && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              )}
            </div>

            {error && (
              <div className="px-3 py-2 text-sm rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-md text-surface bg-text-secondary/50 hover:bg-text-secondary/70 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-surface hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}

              {isSubmitting ? "Creating..." : "Create Prediction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePredictionModal;
