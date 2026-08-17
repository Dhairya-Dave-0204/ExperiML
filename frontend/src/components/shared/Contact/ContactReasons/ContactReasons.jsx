import { motion } from "framer-motion";

import { REASONS } from "./contactReasonsData";

import {
  sectionReveal,
  heroContent,
  fadeUp,
  staggerSlow,
  popIn,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function ContactReasons() {
  return (
    <motion.section
      className="py-16 border-t border-border md:py-24"
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
          className="max-w-xl mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Common reasons to write in
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl"
          >
            Not sure what to say? Here are a few starting points
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            None of these are required — they're just the messages that tend to
            show up most.
          </motion.p>
        </motion.div>

        {/* Contact Reasons */}
        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={popIn}
              className="flex gap-3.5 rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors duration-200 hover:border-primary/30 hover:bg-surface-soft"
            >
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-primary-light">
                <Icon size={17} strokeWidth={1.75} className="text-primary" />
              </div>

              <div>
                <h3 className="mb-1 text-[15px] font-bold text-text">
                  {title}
                </h3>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ContactReasons;
