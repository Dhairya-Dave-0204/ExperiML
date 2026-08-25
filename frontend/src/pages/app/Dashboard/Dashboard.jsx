import { useAuth } from "@/context/AuthContext";
import {
  DashboardHeader,
  ContinueWorkingPanel,
  RecentExperiments,
  RecentProjects,
  WorkspaceSummary,
} from "@/components/components.index";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getFirstName(user) {
  return user?.firstName || "there";
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                          */
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
