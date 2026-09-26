import { FlaskConical, Plus } from "lucide-react";

const ExperimentsHeader = ({ onCreateExperiment }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold tracking-tight text-foreground">
            Experiments
          </h1>
        </div>

        <p className="max-w-2xl mt-2 text-sm leading-6 text-muted-foreground">
          Run and manage machine learning experiments for this project.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateExperiment}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-background shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:h-10"
      >
        <Plus className="w-4 h-4" />
        Create Experiment
      </button>
    </div>
  );
};

export default ExperimentsHeader;
