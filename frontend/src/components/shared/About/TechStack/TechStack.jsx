import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { STACK } from "./techStackData";
import {
  sectionReveal,
  heroContent,
  fadeUp,
  staggerFast,
  cardReveal,
  cardHover,
  fade,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function TechStack() {
  return (
    <motion.section
      id="tech-stack"
      className="py-16 border-t border-border md:py-24 bg-primary-light/20"
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
            Under the Hood
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl"
          >
            Built on a straightforward, dependable stack
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg"
          >
            Nothing exotic—just technologies selected because they're reliable,
            well understood, and suited to each layer of the platform.
          </motion.p>
        </motion.div>

        {/* Architecture Layers */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="flex flex-col max-w-5xl mx-auto"
        >
          {STACK.map(({ id, group, items }, index) => (
            <Fragment key={id}>
              <motion.div
                variants={cardReveal}
                whileHover={cardHover}
                className="p-6 border shadow-sm rounded-2xl border-border bg-surface"
              >
                <div className="flex flex-col gap-3 mb-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                      {group}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="
                          rounded-full
                          border
                          border-border
                          bg-surface-soft
                          px-3
                          py-1.5
                          font-mono
                          text-xs
                          font-medium
                          text-text
                        "
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {index < STACK.length - 1 && (
                <motion.div
                  variants={fade}
                  className="flex justify-center py-4"
                >
                  <ArrowDown size={18} className="text-text-secondary/50" />
                </motion.div>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default TechStack;
