import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/components.index";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background lg:h-screen lg:flex-row lg:overflow-hidden">
      <AppSidebar />

      <main className="flex-1 w-full min-w-0 lg:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
