import { NavLink } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

const ProjectNavigation = ({ projectId }) => {
  const projectTabs = [
    {
      label: "Overview",
      value: ROUTES.PROJECT_TABS.OVERVIEW,
    },
    {
      label: "Datasets",
      value: ROUTES.PROJECT_TABS.DATASETS,
    },
    {
      label: "Experiments",
      value: ROUTES.PROJECT_TABS.EXPERIMENTS,
    },
    {
      label: "Models",
      value: ROUTES.PROJECT_TABS.MODELS,
    },
    {
      label: "Predictions",
      value: ROUTES.PROJECT_TABS.PREDICTIONS,
    },
  ];

  return (
    <nav className="mb-8 border-b border-border">
      <div className="flex gap-6 overflow-x-auto">
        {projectTabs.map((tab) => (
          <NavLink
            key={tab.value}
            to={ROUTES.PROJECT_TAB(projectId, tab.value)}
            className={({ isActive }) =>
              [
                "relative whitespace-nowrap pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-text-secondary hover:text-text",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {tab.label}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default ProjectNavigation;
