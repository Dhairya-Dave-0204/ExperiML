import React from "react";

import { SIDEBAR_ITEMS } from "./workspaceData";

function WorkspaceSidebar() {
  return (
    <aside className="p-4 border-b border-border bg-background lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
      {/* Sidebar Heading */}
      <p className="pl-3 mb-5 font-mono text-xs tracking-wider text-text-secondary">
        WORKSPACE
      </p>

      {/* Navigation */}
      <nav
        aria-label="Workspace Navigation"
        className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`
                flex min-w-max items-center gap-3 rounded-lg px-3 py-2
                text-sm font-medium transition-all duration-200

                ${
                  item.active
                    ? "bg-primary-soft text-primary"
                    : "text-text hover:bg-surface-soft hover:text-primary"
                }
              `}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default WorkspaceSidebar;
