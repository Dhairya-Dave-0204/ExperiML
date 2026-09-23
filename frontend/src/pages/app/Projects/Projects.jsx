import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import {
  ProjectCard,
  ProjectsGlobalHeader,
  ProjectsListHeader,
} from "@/components/components.index";

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

  const handleCreateProject = () => {
    // Project creation flow will be implemented later.
  };

  return (
    <div className="min-h-full bg-surface">
      <div className="px-6 py-10 mx-auto max-w-7xl lg:px-8 lg:py-12">
        <ProjectsGlobalHeader onCreateProject={handleCreateProject} />

        <section className="mt-12">
          <ProjectsListHeader count={PROJECTS.length} />

          <div className="grid grid-cols-1 gap-6 mt-7 md:grid-cols-2 xl:grid-cols-3">
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
