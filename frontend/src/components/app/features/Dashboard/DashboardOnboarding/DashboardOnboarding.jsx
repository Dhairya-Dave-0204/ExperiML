import { ArrowRight, FolderPlus, Workflow } from "lucide-react";

function DashboardOnboarding() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold tracking-tight font-heading text-text sm:text-2xl">
          Welcome to ExperiML.
        </h2>

        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Your workspace is ready. Start by creating your first project and
          organize your machine learning workflow in one place.
        </p>
      </div>

      {/* Primary onboarding card */}
      <section className="overflow-hidden border shadow-sm rounded-xl border-border bg-surface">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6 h-11 w-11 rounded-xl bg-primary/10 text-primary">
            <FolderPlus size={22} strokeWidth={2} />
          </div>

          <h3 className="text-xl font-bold tracking-tight font-heading text-text">
            Start your first project
          </h3>

          <p className="max-w-xl mt-2 text-sm leading-relaxed text-text-secondary">
            Projects give you a dedicated workspace for your datasets,
            experiments, models, and predictions.
          </p>

          <button
            type="button"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-primary
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-colors
              duration-150
              hover:bg-primary-dark
            "
          >
            Create Project
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* Workflow overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Workflow
            size={17}
            strokeWidth={1.9}
            className="text-text-secondary"
          />

          <h3 className="text-sm font-bold font-heading text-text">
            How ExperiML works
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="p-5 border rounded-xl border-border bg-surface">
            <span className="font-mono text-xs font-semibold text-primary">
              01
            </span>

            <h4 className="mt-3 text-sm font-semibold text-text">
              Create a project
            </h4>

            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
              Set up a workspace for your machine learning workflow.
            </p>
          </div>

          <div className="p-5 border rounded-xl border-border bg-surface">
            <span className="font-mono text-xs font-semibold text-primary">
              02
            </span>

            <h4 className="mt-3 text-sm font-semibold text-text">
              Add your data
            </h4>

            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
              Bring your datasets into the project and prepare them for
              experimentation.
            </p>
          </div>

          <div className="p-5 border rounded-xl border-border bg-surface">
            <span className="font-mono text-xs font-semibold text-primary">
              03
            </span>

            <h4 className="mt-3 text-sm font-semibold text-text">
              Run experiments
            </h4>

            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
              Train, evaluate, and compare models as you build your workflow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardOnboarding;
