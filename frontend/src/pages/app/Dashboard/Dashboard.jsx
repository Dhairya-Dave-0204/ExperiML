import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

import dashboardService from "@/services/dashboard/dashboardService";

import {
  DashboardHeader,
  ContinueWorkingPanel,
  RecentExperiments,
  RecentProjects,
  WorkspaceSummary,
  DashboardOnboarding,
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

  const [dashboardData, setDashboardData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  const firstName = getFirstName(user);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardService.getDashboard();

        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your dashboard. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-sm text-text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-4 text-center">
        <h2 className="text-base font-semibold text-text">
          Unable to load dashboard
        </h2>

        <p className="mt-1 text-sm text-text-secondary">{error}</p>
      </div>
    );
  }

  const hasWorkspace = dashboardData?.hasWorkspace ?? false;

  return (
    <div className="flex flex-col min-h-full">
      <DashboardHeader />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {hasWorkspace ? (
            <>
              <div>
                <h2 className="text-lg font-bold font-heading text-text">
                  Good morning, {firstName}.
                </h2>

                <p className="text-sm text-text-secondary">
                  Continue your machine learning workflow.
                </p>
              </div>

              <ContinueWorkingPanel data={dashboardData.recentWork} />

              <RecentExperiments data={dashboardData.recentExperiments} />

              <RecentProjects data={dashboardData.recentProjects} />

              <WorkspaceSummary data={dashboardData.workspaceSummary} />
            </>
          ) : (
            <DashboardOnboarding />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
