import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import dashboardService from "@/services/dashboard/dashboardService";

import {
  DashboardHeader,
  ContinueWorkingPanel,
  ContinueWorkingEmptyState,
  RecentExperiments,
  RecentProjects,
  WorkspaceSummary,
  DashboardOnboarding,
} from "@/components/components.index";

function Dashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await dashboardService.getDashboard();

        if (!isMounted) {
          return;
        }

        setDashboardData(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load your dashboard. Please try again.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const firstName = user?.firstName || "there";

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

              {dashboardData.recentWork ? (
                <ContinueWorkingPanel data={dashboardData.recentWork} />
              ) : (
                <ContinueWorkingEmptyState />
              )}

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
