import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/components.index";


function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">

      <AppSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}


export default AppLayout;