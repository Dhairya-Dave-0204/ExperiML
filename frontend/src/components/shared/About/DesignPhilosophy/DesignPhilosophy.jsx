import { motion } from "framer-motion";

import { PRINCIPLES } from "./designPhilosophyData";
import {
  sectionReveal,
  heroContent,
  fadeUp,
  staggerFast,
  listItemReveal,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function DesignPhilosophy() {
  return (
    <motion.section
      id="philosophy"
      className="py-16 border-t border-border bg-surface md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Section Introduction */}
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
            Design philosophy
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-3xl font-extrabold tracking-tight font-heading text-text md:text-4xl"
          >
            The principles behind every decision
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            These aren't aspirational — they're the filter every feature has to
            pass through before it ships.
          </motion.p>
        </motion.div>

        {/* Principles */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="border-t divide-y divide-border border-border"
        >
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.id}
              variants={listItemReveal}
              className="grid grid-cols-[28px_1fr] gap-4 py-4"
            >
              <span className="pt-0.5 font-mono text-xs font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div>
                <div className="mb-1 text-sm font-bold text-text">
                  {p.title}
                </div>

                <div className="text-sm leading-relaxed text-text-secondary">
                  {p.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default DesignPhilosophy;
