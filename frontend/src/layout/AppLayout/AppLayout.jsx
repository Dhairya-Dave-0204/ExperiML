import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/components.index";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background lg:flex-row">
      <AppSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;