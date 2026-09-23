import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  Database,
  FlaskConical,
  MoreVertical,
  Plus,
  PencilRuler,
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
      <div className="px-6 py-8 mx-auto max-w-7xl lg:px-8">
        <div className="flex flex-col gap-5 mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight font-heading text-text sm:text-3xl">
              Projects
            </h1>

            <p className="mt-2 text-sm text-text-secondary sm:text-base">
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

        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold font-heading text-text">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              View and access all of your machine learning projects.
            </p>
          </div>

          <span className="text-sm shrink-0 text-text-secondary">
            {PROJECTS.length} projects
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className="flex flex-col p-5 transition-shadow bg-white border min-h-80 rounded-xl border-border hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light text-primary">
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

              <div className="flex-1 mt-5">
                <h3 className="text-base font-semibold tracking-tight font-heading text-text">
                  {project.name}
                </h3>

                <p className="mt-2 text-sm leading-5 text-text-secondary line-clamp-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap pt-5 mt-5 text-xs border-t gap-x-5 gap-y-2 border-border text-text-secondary">
                  <div className="inline-flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-primary" />
                    <span>{project.datasets} datasets</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-primary" />
                    <span>{project.experiments} experiments</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-primary" />
                    <span>{project.models} models</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 pt-5 mt-5 border-t border-border">
                <div className="text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>Created: {project.createdAt}</span>
                  </div>

                  <div className="flex mt-1.5 items-center gap-1.5">
                    <PencilRuler className="w-3.5 h-3.5" />
                    <span>Updated: {project.updatedAt}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenProject(project.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-light px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  Open Project
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
