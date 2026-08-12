import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { PAIRS } from "./whyExperimlExistsData";
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

function WhyExperimlExists() {
  return (
    <motion.section
      id="why-it-exists"
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
          className="max-w-3xl mx-auto mb-16 text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Why ExperiML Exists
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl"
          >
            Machine learning work breaks down in familiar ways
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg"
          >
            None of these problems are exotic. They're the everyday reality of
            running experiments without dedicated tooling — and each one is a
            reason ExperiML exists.
          </motion.p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="overflow-hidden border shadow-md rounded-2xl border-border bg-surface"
        >
          {/* Table Header */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-1 divide-y divide-border bg-surface-soft sm:grid-cols-2 sm:divide-x sm:divide-y-0"
          >
            <motion.div
              variants={fadeUp}
              className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-danger sm:px-6"
            >
              Without ExperiML
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-success sm:px-6"
            >
              With ExperiML
            </motion.div>
          </motion.div>

          {/* Table Body */}
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {PAIRS.map((pair) => (
              <motion.div
                key={pair.id}
                variants={listItemReveal}
                className="grid grid-cols-1 border-t divide-y border-border divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0"
              >
                <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
                  <X
                    size={18}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-danger"
                  />

                  <span className="text-sm leading-7 text-text-secondary md:text-[15px]">
                    {pair.problem}
                  </span>
                </div>

                <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
                  <Check
                    size={18}
                    strokeWidth={2.25}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <span className="text-sm font-medium leading-7 text-text md:text-[15px]">
                    {pair.solution}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default WhyExperimlExists;
