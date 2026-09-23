import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  Database,
  FlaskConical,
  MoreVertical,
  Plus,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

// Mock data for UI development.
// This will be replaced with backend data during integration.
const PROJECTS = [
  {
    id: "21a5a5af-a972-436c-be40-cc1850f6a5a6",
    name: "Customer Churn Prediction",
    description:
      "Predict customer churn using historical customer behavior data.",
    datasets: 4,
    experiments: 14,
    models: 2,
    createdAt: "Aug 13, 2026",
    updatedAt: "Sep 17, 2026",
  },
  {
    id: "heart-disease-project",
    name: "Heart Disease Prediction",
    description:
      "Predict the likelihood of heart disease using patient data and machine learning.",
    datasets: 3,
    experiments: 8,
    models: 1,
    createdAt: "Aug 10, 2026",
    updatedAt: "Sep 12, 2026",
  },
  {
    id: "ecommerce-sales-project",
    name: "E-commerce Sales Forecasting",
    description:
      "Forecast future sales for an e-commerce platform using historical data.",
    datasets: 5,
    experiments: 12,
    models: 3,
    createdAt: "Aug 5, 2026",
    updatedAt: "Sep 10, 2026",
  },
  {
    id: "loan-default-project",
    name: "Loan Default Risk",
    description:
      "Assess loan default risk using financial and demographic data.",
    datasets: 2,
    experiments: 6,
    models: 2,
    createdAt: "Aug 1, 2026",
    updatedAt: "Aug 28, 2026",
  },
  {
    id: "document-classification-project",
    name: "Document Classification",
    description:
      "Classify documents into predefined categories using machine learning.",
    datasets: 6,
    experiments: 10,
    models: 4,
    createdAt: "Jul 28, 2026",
    updatedAt: "Aug 25, 2026",
  },
  {
    id: "customer-segmentation-project",
    name: "Customer Segmentation",
    description:
      "Segment customers based on their behavior and purchase patterns.",
    datasets: 4,
    experiments: 9,
    models: 3,
    createdAt: "Jul 20, 2026",
    updatedAt: "Aug 22, 2026",
  },
];

const Projects = () => {
  const navigate = useNavigate();

  const handleOpenProject = (projectId) => {
    navigate(ROUTES.PROJECT_TAB(projectId, ROUTES.PROJECT_TABS.OVERVIEW));
  };

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-10 mx-auto max-w-7xl lg:px-8 lg:py-12">
        {/* Page header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight font-heading text-text">
              Projects
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary sm:text-base">
              Manage and explore your machine learning projects.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>

        {/* Projects section */}
        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold font-heading text-text">
                Your Projects
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                View and access all of your machine learning projects.
              </p>
            </div>

            <span className="text-sm text-text-secondary">
              {PROJECTS.length} projects
            </span>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 gap-6 mt-7 md:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((project) => (
              <article
                key={project.id}
                className="flex min-h-87.5 flex-col rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-sm"
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary-light text-primary">
                    <Boxes className="w-5 h-5" />
                  </div>

                  <button
                    type="button"
                    aria-label={`More actions for ${project.name}`}
                    className="inline-flex items-center justify-center w-8 h-8 transition-colors rounded-lg text-text-secondary hover:bg-surface-soft hover:text-text"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {/* Project information */}
                <div className="flex-1 mt-6">
                  <h3 className="text-base font-semibold tracking-tight font-heading text-text">
                    {project.name}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-text-secondary">
                    {project.description}
                  </p>

                  {/* Project statistics */}
                  <div className="flex items-center justify-between pt-5 border-t mt-7 border-border">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Database className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs">
                        {project.datasets} datasets
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <FlaskConical className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs">
                        {project.experiments} experiments
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <Boxes className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs">{project.models} models</span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-end justify-between gap-4 pt-5 mt-6 border-t border-border">
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>Created {project.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      <span>Updated {project.updatedAt}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenProject(project.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-light px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    Open Project
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
