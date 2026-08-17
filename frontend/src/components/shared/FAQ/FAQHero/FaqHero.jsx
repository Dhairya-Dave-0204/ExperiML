import { motion } from "framer-motion";

import { getFaqHeroStats } from "./FaqHeroData";

import {
  sectionReveal,
  fadeDown,
  fadeUp,
  staggerFast,
  statReveal,
  smallCardHover,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function FaqHero({ questionCount, categoryCount }) {
  const stats = getFaqHeroStats(questionCount, categoryCount);

  return (
    <motion.section
      className="py-16 md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="flex flex-col items-center text-center container-custom">
        <motion.div
          variants={fadeDown}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Knowledge Center
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mb-4 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[42px]"
        >
          Everything you need to know about ExperiML
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="max-w-lg mb-10 text-base leading-relaxed text-text-secondary"
        >
          What it is, how it works, what it does and doesn't do — organized so
          you can find an answer in seconds instead of searching through docs.
        </motion.p>

        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <motion.div
              key={label}
              variants={statReveal}
              whileHover={smallCardHover}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3.5 shadow-sm"
            >
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-primary-light">
                <Icon size={17} strokeWidth={1.75} className="text-primary" />
              </div>

              <div className="text-left">
                <div className="text-sm font-bold font-heading text-text">
                  {value}
                </div>

                <div className="text-xs text-text-secondary">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FaqHero;
