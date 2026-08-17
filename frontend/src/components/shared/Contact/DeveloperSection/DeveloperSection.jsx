import { motion } from "framer-motion";

import { TRAITS } from "./developerSectionData";

import {
  sectionReveal,
  fadeUp,
  scaleIn,
  staggerSlow,
  listItemReveal,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function DeveloperSection() {
  return (
    <motion.section
      className="py-16 border-t border-border bg-surface-soft md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Introduction */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            The person behind ExperiML
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-extrabold tracking-tight font-heading text-text md:text-4xl"
          >
            Hi — thanks for stopping by
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-md text-[15px] leading-relaxed text-text-secondary"
          >
            ExperiML is built by one person who cares more about getting the
            fundamentals right than shipping something flashy. If you're curious
            about the platform, want to talk shop about ML tooling, or just want
            to say hi — that's exactly what this page is for.
          </motion.p>
        </motion.div>

        {/* Developer Traits */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="p-6 border shadow-sm rounded-xl border-border bg-surface md:p-8"
        >
          <motion.ul
            variants={staggerSlow}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="divide-y divide-border"
          >
            {TRAITS.map(({ id, icon: Icon, text }) => (
              <motion.li
                key={id}
                variants={listItemReveal}
                className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-primary-light">
                  <Icon size={15} strokeWidth={1.75} className="text-primary" />
                </div>

                <span className="pt-1 text-sm leading-relaxed text-text">
                  {text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default DeveloperSection;
