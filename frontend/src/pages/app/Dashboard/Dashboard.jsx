import { useAuth } from "@/context/AuthContext";
import {
  DashboardHeader,
  ContinueWorkingPanel,
  RecentExperiments,
  RecentProjects,
} from "@/components/components.index";

/* ------------------------------------------------------------------ */
/* Mock dashboard data                                                */
/* ------------------------------------------------------------------ */
const WORKSPACE_SUMMARY = [
  {
    label: "Projects",
    value: 12,
  },
  {
    label: "Experiments",
    value: 48,
  },
  {
    label: "Datasets",
    value: 23,
  },
  {
    label: "Models",
    value: 17,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getFirstName(user) {
  return user?.firstName || "there";
}

/* ------------------------------------------------------------------ */
/* Workspace Summary                                                  */
/* ------------------------------------------------------------------ */

function WorkspaceSummary() {
  return (
    <div className="flex flex-wrap items-center px-1 pt-5 text-sm border-t gap-x-6 gap-y-2 border-border">
      <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Workspace
      </span>

      {WORKSPACE_SUMMARY.map((stat) => (
        <span key={stat.label} className="text-text-secondary">
          {stat.label}{" "}
          <span className="font-mono font-semibold text-text">
            {stat.value}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard() {
  const { user } = useAuth();

  const firstName = getFirstName(user);

  return (
    <div className="flex flex-col min-h-full">
      <DashboardHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Contextual greeting */}
          <div>
            <h2 className="text-lg font-bold font-heading text-text">
              Good morning, {firstName}.
            </h2>

            <p className="text-sm text-text-secondary">
              Continue your machine learning workflow.
            </p>
          </div>

          <ContinueWorkingPanel />

          <RecentExperiments />

          <RecentProjects />

          <WorkspaceSummary />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
