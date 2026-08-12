import { motion } from "framer-motion";
import { CAPABILITIES } from "./coreCapabilitiesData";

import {
  sectionReveal,
  heroContent,
  fadeUp,
  staggerFast,
  cardReveal,
  cardHover,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function CoreCapabilities() {
  return (
    <motion.section
      id="capabilities"
      className="py-16 border-t border-border bg-surface-soft md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          variants={heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="max-w-full mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Core capabilities
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-4xl tracking-tight font-heading text-text md:text-5xl md:font-extrabold"
          >
            Everything an experiment needs, in one place
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            Each capability covers a real part of the ML lifecycle — nothing
            here exists just to fill a grid.
          </motion.p>
        </motion.div>

        {/* Capability Cards */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CAPABILITIES.map(({ icon: Icon, title, desc, planned, id }) => (
            <motion.div
              key={id}
              variants={cardReveal}
              whileHover={cardHover}
              className="p-5 border shadow-sm cursor-pointer rounded-xl border-border bg-surface"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light">
                  <Icon size={20} strokeWidth={1.75} className="text-primary" />
                </div>

                {planned && (
                  <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
                    Planned
                  </span>
                )}
              </div>

              <h3 className="mb-1.5 font-heading text-[15px] font-bold text-text">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-text-secondary">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CoreCapabilities;
