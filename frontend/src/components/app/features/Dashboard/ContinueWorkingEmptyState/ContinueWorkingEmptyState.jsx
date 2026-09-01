import { ArrowRight, FlaskConical } from "lucide-react";

function ContinueWorkingEmptyState() {
  return (
    <div className="p-6 border shadow-sm rounded-xl border-border bg-surface sm:p-8">
      <div className="mb-5 text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Continue Working
      </div>

      <div className="flex flex-col items-center max-w-md py-4 mx-auto text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10 text-primary">
          <FlaskConical size={22} strokeWidth={2} />
        </div>

        <h2 className="text-xl font-bold tracking-tight font-heading text-text">
          Nothing to continue yet
        </h2>

        <p className="max-w-sm mt-2 text-sm leading-relaxed text-text-secondary">
          Start an experiment to begin building your machine learning workflow.
          Your recent work will appear here when you have something to continue.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 mt-5 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
        >
          Create Experiment
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default ContinueWorkingEmptyState;
