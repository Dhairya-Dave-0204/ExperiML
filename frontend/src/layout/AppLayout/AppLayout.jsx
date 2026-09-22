import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/components.index";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background lg:h-screen lg:overflow-hidden lg:flex-row">
      <AppSidebar />

      <main className="flex-1 min-w-0 lg:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
