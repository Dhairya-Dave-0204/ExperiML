import { motion } from "framer-motion";

import { SIDEBAR_ITEMS } from "./workspaceData";

import {
  heroContent,
  listItemReveal,
  cardHover,
  defaultViewport,
} from "@/animations/animations.index";

function WorkspaceSidebar() {
  return (
    <aside className="p-4 border-b border-border bg-background lg:border-b-0 lg:border-r lg:px-4 lg:py-6">
      {/* ================= Sidebar ================= */}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={heroContent}
      >
        {/* Heading */}

        <motion.p
          variants={listItemReveal}
          className="pl-3 mb-5 font-mono text-xs tracking-wider text-text-secondary"
        >
          WORKSPACE
        </motion.p>

        {/* Navigation */}

        <nav
          aria-label="Workspace Navigation"
          className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                variants={listItemReveal}
                whileHover={cardHover}
                whileTap={{ scale: 0.98 }}
                className={`
                  group
                  relative
                  flex
                  min-w-max
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  duration-200

                  ${
                    item.active
                      ? "bg-primary-soft text-primary"
                      : "text-text hover:bg-surface-soft hover:text-primary"
                  }
                `}
              >
                {/* Active Indicator */}

                {item.active && (
                  <motion.span
                    layoutId="workspace-active-indicator"
                    className="absolute left-0 w-1 rounded-r-full top-2 bottom-2 bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}

                {/* Icon */}

                <motion.div
                  whileHover={{
                    rotate: -6,
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <Icon size={18} />
                </motion.div>

                {/* Label */}

                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </motion.div>
    </aside>
  );
}

export default WorkspaceSidebar;
