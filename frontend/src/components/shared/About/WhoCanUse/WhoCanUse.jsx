import { motion } from "framer-motion";

import { AUDIENCES } from "./whoCanUseData";
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

function WhoCanUse() {
  return (
    <motion.section
      id="who-can-use"
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
          className="max-w-2xl mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Who it's for
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-3xl font-extrabold tracking-tight font-heading text-text md:text-4xl"
          >
            Built for anyone who runs experiments
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            Different roles, same underlying need: knowing exactly what produced
            a result.
          </motion.p>
        </motion.div>

        {/* Audience Cards */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {AUDIENCES.map(({ icon: Icon, title, desc, planned, id }) => (
            <motion.div
              key={id}
              variants={cardReveal}
              whileHover={cardHover}
              className="flex gap-4 p-5 border shadow-sm rounded-xl border-border bg-surface"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary-light">
                <Icon size={20} strokeWidth={1.75} className="text-primary" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading text-[15px] font-bold text-text">
                    {title}
                  </h3>

                  {planned && (
                    <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warning">
                      Soon
                    </span>
                  )}
                </div>

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

export default WhoCanUse;
