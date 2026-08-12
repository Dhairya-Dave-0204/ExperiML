import { motion } from "framer-motion";
import { SPEC } from "./whatIsExperimlData";
import {
  sectionReveal,
  heroContent,
  fadeUp,
  widgetReveal,
  staggerFast,
  listItemReveal,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

export default function WhatIsExperiml() {
  return (
    <motion.section
      id="what-is-experiml"
      className="py-16 border-t border-border md:py-24 bg-surface"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* Content */}
        <motion.div
          variants={heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            What is ExperiML?
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-5 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl"
          >
            A dedicated workspace for the way ML work actually happens
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="space-y-4 text-[15px] leading-relaxed text-text-secondary"
          >
            <p>
              ExperiML is a platform for managing the full lifecycle of a
              machine learning experiment — from the first dataset upload to the
              model you eventually trust enough to ship. It was built out of a
              simple frustration: ML work is inherently iterative, but most
              tooling still treats each run as a one-off script.
            </p>

            <p>
              It's built for anyone who runs experiments and needs to remember
              what they did — students working through coursework, engineers
              iterating on production models, and researchers who need their
              results to hold up under scrutiny.
            </p>
          </motion.div>
        </motion.div>

        {/* Platform Overview */}
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="self-start p-6 border shadow-sm rounded-xl border-border bg-surface-soft"
        >
          <motion.div
            variants={fadeUp}
            className="mb-4 font-mono text-xs font-semibold tracking-wider uppercase text-text-secondary"
          >
            Platform overview
          </motion.div>

          <motion.dl
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="divide-y divide-border"
          >
            {SPEC.map((row) => (
              <motion.div
                key={row.id}
                variants={listItemReveal}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <dt className="text-sm text-text-secondary">{row.label}</dt>

                <dd className="text-sm font-semibold text-right text-text">
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </motion.section>
  );
}
