import React from "react";
import { motion } from "framer-motion";

import {
  fadeUp,
  fadeLeft,
  heroContent,
  listItemReveal,
  cardHover,
  cardTap,
  defaultViewport,
} from "@/animations/animations.index";

import { CheckCircle2, GitCommit } from "lucide-react";

import { EXPERIMENT, METRICS, TRAINING_LOSS } from "./workspaceData";
function WorkspaceMetrics() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={heroContent}
    >
      {/* Experiment Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold font-heading text-text">
            {EXPERIMENT.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 font-mono text-xs text-text-secondary">
            <GitCommit size={12} />

            <motion.span>
              {EXPERIMENT.commit.hash} • {EXPERIMENT.commit.runId}
            </motion.span>
          </div>
        </div>

        <motion.div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-semibold rounded-full bg-success-soft text-success">
          <CheckCircle2 size={14} />

          <span>{EXPERIMENT.status.label}</span>
        </motion.div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={heroContent} className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <motion.div
            key={metric.id}
            variants={listItemReveal}
            whileHover={cardHover}
            whileTap={cardTap}
            className="p-4 border rounded-xl border-border bg-surface"
          >
            <p className="mb-2 font-mono text-xs tracking-wide uppercase text-text-secondary">
              {metric.label}
            </p>

            <p
              className={`font-heading text-3xl font-bold ${
                metric.highlight ? "text-primary" : "text-text"
              }`}
            >
              {metric.value}
            </p>
          </motion.div>
        ))}

        {/* Training Loss */}
        <motion.div variants={fadeUp} whileHover={cardHover} className="p-4 border rounded-xl border-border bg-surface md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs tracking-wide uppercase text-text-secondary">
              {TRAINING_LOSS.label}
            </span>

            <motion.span variants={fadeLeft} className="font-mono text-xs font-medium text-primary">
              {TRAINING_LOSS.status}
            </motion.span>
          </div>

          <svg
            viewBox="0 0 200 40"
            className="w-full h-10 overflow-visible fill-primary-light"
            role="img"
            aria-label="Training Loss Chart"
          >
            <motion.path
              className="fill-primary-soft"
              d={TRAINING_LOSS.areaPath}
              initial={{opacity:0}}
              whileInView={{opacity:1}}
              viewport={{once:true}}
              transition={{delay:0.4,duration:0.5}}
            />

            <motion.path
              className="stroke-2 stroke-primary fill-primary-light"
              initial={{pathLength:0}}
              whileInView={{pathLength:1}}
              viewport={{once:true}}
              transition={{duration:1,ease:"easeInOut"}}
              strokeLinecap="round"
              strokeLinejoin="round"
              d={TRAINING_LOSS.linePath}
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default WorkspaceMetrics;