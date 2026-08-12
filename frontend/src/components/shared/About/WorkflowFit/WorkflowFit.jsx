import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { STAGES } from "./workflowFitData";
import {
  sectionReveal,
  heroContent,
  fadeUp,
  widgetReveal,
  staggerFast,
  listItemReveal,
  smallCardHover,
  fade,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function WorkflowFit() {
  return (
    <motion.section
      id="workflow-fit"
      className="py-16 border-t border-border md:py-24 bg-primary-light/30"
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
            How It Fits Your Workflow
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl"
          >
            One continuous path, from raw data to a finished report
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg"
          >
            ExperiML doesn't ask you to change how you work—it gives the stages
            you already move through a shared home, making every experiment
            organized, reproducible, and easy to revisit.
          </motion.p>
        </motion.div>

        {/* Workflow */}
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="overflow-hidden border shadow-md rounded-2xl border-border bg-surface"
        >
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="flex flex-wrap items-center justify-center gap-4 p-6 lg:p-8"
          >
            {STAGES.map(({ icon: Icon, label, id }, index) => (
              <motion.div key={id} className="flex items-center gap-4">
                <motion.div
                  variants={listItemReveal}
                  whileHover={smallCardHover}
                  className="flex items-center gap-3 px-5 py-4 border shadow-sm cursor-pointer group rounded-xl border-border bg-surface"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary-soft text-primary">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-semibold text-text md:text-base">
                    {label}
                  </span>
                </motion.div>

                {index < STAGES.length - 1 && (
                  <motion.div variants={fade} className="hidden lg:block">
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="text-text-secondary/40"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default WorkflowFit;
