import React from "react";

import {
  WorkspaceAnalytics,
  WorkspaceMetrics,
  WorkspaceSidebar,
} from "./workspace.index";

import { WORKSPACE_CONTENT } from "./workspaceData";

function Workspace() {
  return (
    <section
      id="workspace"
      className="border-t section-padding border-border bg-surface-soft"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-extrabold leading-tight font-heading text-text lg:text-5xl">
            {WORKSPACE_CONTENT.title}
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            {WORKSPACE_CONTENT.description}
          </p>
        </div>

        {/* Workspace Dashboard */}
        <div className="overflow-hidden border shadow-lg rounded-2xl border-border bg-surface">
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[240px_1fr]
            "
          >
            {/* Sidebar */}
            <WorkspaceSidebar />

            {/* Main Dashboard */}
            <main className="p-6 md:p-8 lg:p-10">
              <WorkspaceMetrics />

              <WorkspaceAnalytics />
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Workspace;
