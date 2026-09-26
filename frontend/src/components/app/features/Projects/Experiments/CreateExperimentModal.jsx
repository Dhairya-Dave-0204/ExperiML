import { useState } from "react";
import { Beaker, ChevronDown, Plus, Sparkles, X } from "lucide-react";

const CreateExperimentModal = ({ onClose }) => {
  const [experimentName, setExperimentName] = useState("");
  const [dataset, setDataset] = useState("");
  const [algorithm, setAlgorithm] = useState("");

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
            className="flex items-center justify-center w-8 h-8 transition-colors rounded-md shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
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
              onChange={(event) => setExperimentName(event.target.value)}
              placeholder="e.g. Customer Churn Baseline"
              className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
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
                onChange={(event) => setDataset(event.target.value)}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="" disabled>
                  Select a dataset
                </option>

                <option value="dataset-placeholder">
                  Select from project datasets
                </option>
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
                onChange={(event) => setAlgorithm(event.target.value)}
                className="w-full h-10 px-3 text-sm transition-colors border rounded-md outline-none appearance-none border-input bg-background pr-9 text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
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

          {/* Informational Message */}
          <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 px-3 py-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <p className="text-xs leading-5 text-muted-foreground">
              Additional experiment configuration can be added here when the
              experiment workflow is connected to the backend.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 px-5 py-4 border-t border-border bg-muted/20 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 text-sm font-medium transition-colors border rounded-md h-9 border-input bg-background text-foreground hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center gap-2 px-4 text-sm font-medium rounded-md opacity-50 h-9 bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Create Experiment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExperimentModal;
