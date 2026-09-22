import { useNavigate } from "react-router-dom";
import {
  Database,
  FlaskConical,
  Boxes,
  Target,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

const WORKFLOW_ICONS = {
  [ROUTES.PROJECT_TABS.DATASETS]: Database,
  [ROUTES.PROJECT_TABS.EXPERIMENTS]: FlaskConical,
  [ROUTES.PROJECT_TABS.MODELS]: Boxes,
  [ROUTES.PROJECT_TABS.PREDICTIONS]: Target,
};

const ProjectWorkflow = ({ projectId, workflow }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <SectionHeading
        title="Project workflow"
        description="The typical flow for building and using an ML solution."
      />

      <div className="p-6 bg-white border rounded-xl border-border">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {workflow.map((step, index) => {
            const Icon = WORKFLOW_ICONS[step.id];

            return (
              <div key={step.id} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.PROJECT_TAB(projectId, step.id))
                  }
                  className="w-full text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={[
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        step.completed
                          ? "bg-success/10 text-success"
                          : "bg-surface-soft text-text-secondary",
                      ].join(" ")}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-border" />
                    )}
                  </div>

                  <h3 className="mb-1 text-sm font-semibold text-text group-hover:text-primary">
                    {step.label}
                  </h3>

                  <p className="text-sm leading-5 text-text-secondary">
                    {step.description}
                  </p>
                </button>

                {index < workflow.length - 1 && (
                  <div className="absolute -right-4.5 top-5 hidden md:block">
                    <ChevronRight className="w-4 h-4 text-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold font-heading text-text">
        {title}
      </h2>

      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

export default ProjectWorkflow;
