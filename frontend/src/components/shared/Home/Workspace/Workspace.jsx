import { motion } from "framer-motion";

import {
  WorkspaceAnalytics,
  WorkspaceMetrics,
  WorkspaceSidebar,
} from "./workspace.index";

import { WORKSPACE_CONTENT } from "./workspaceData";

import {
  fadeUp,
  heroContent,
  defaultViewport,
} from "@/animations/animations.index";

function Workspace() {
  return (
    <section
      id="workspace"
      className="border-t border-border bg-surface-soft section-padding"
    >
      <div className="container-custom">
        {/* ================= Section Header ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={heroContent}
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-extrabold leading-tight font-heading text-text lg:text-5xl"
          >
            {WORKSPACE_CONTENT.title}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg leading-8 text-text-secondary"
          >
            {WORKSPACE_CONTENT.description}
          </motion.p>
        </motion.div>

        {/* ================= Workspace Dashboard ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="overflow-hidden border shadow-lg rounded-2xl border-border bg-surface"
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[240px_1fr]
            "
          >
            {/* ================= Sidebar ================= */}

            <WorkspaceSidebar />

            {/* ================= Main Dashboard ================= */}

            <main className="p-6 md:p-8 lg:p-10">
              <WorkspaceMetrics />

              <div className="mt-8">
                <WorkspaceAnalytics />
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Workspace;
