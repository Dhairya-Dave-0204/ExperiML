import React from "react";
import { motion } from "framer-motion";

function AuthLoadingScreen() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2 h-72 w-72 bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="relative flex flex-col items-center text-center"
      >
        {/* Brand marker */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />

          <span className="text-lg font-bold tracking-tight font-heading text-text">
            ExperiML
          </span>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center gap-2 px-4 py-2 mb-4 border rounded-full shadow-sm border-border bg-surface">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full animate-ping bg-primary/50" />

            <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
          </span>

          <span className="text-xs font-medium text-text-secondary">
            Restoring workspace
          </span>
        </div>

        <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
          Preparing your experiments and projects.
        </p>
      </motion.div>
    </div>
  );
}

export default AuthLoadingScreen;
