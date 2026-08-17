import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { CTAButton } from "@/components/components.index";

import {
  sectionReveal,
  widgetReveal,
  fadeDown,
  fadeUp,
  popIn,
  defaultViewport,
  sectionViewport,
  ctaHover,
  ctaTap,
} from "@/animations/animations.index";

function ContactCTA() {
  return (
    <motion.section
      className="py-16 border-t border-border md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom">
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="relative px-6 overflow-hidden border shadow-md rounded-3xl border-border bg-surface-soft py-14 md:px-10 md:py-16"
        >
          {/* Background */}
          <div className="absolute inset-0">
            {/* Soft corner highlights */}
            <div className="absolute w-64 h-64 rounded-full -left-24 -top-24 bg-primary/6 blur-3xl" />

            <div className="absolute rounded-full -right-24 -bottom-24 h-72 w-72 bg-primary/8 blur-3xl" />

            {/* Engineering grid */}
            <div
              className="
                absolute
                inset-0
                opacity-[0.035]
                bg-[radial-gradient(circle,#2563eb_1px,transparent_1px)]
                bg-size-[22px_22px]
              "
            />
          </div>

          {/* Content */}
          <div className="relative max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeDown}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-soft text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Explore ExperiML
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="text-3xl font-extrabold tracking-tight font-heading text-text sm:text-4xl lg:text-5xl"
            >
              Still deciding what to say?
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="max-w-2xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:text-lg"
            >
              Before reaching out, explore how ExperiML organizes datasets,
              experiments, and models into a single, reproducible workflow. You
              might find the answers you're looking for along the way.
            </motion.p>

            <motion.div
              variants={popIn}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="flex justify-center mt-10"
            >
              <motion.div whileHover={ctaHover} whileTap={ctaTap}>
                <CTAButton
                  to={ROUTES.SIGN_IN}
                  icon={ArrowRight}
                  className="min-w-57.5"
                >
                  Explore the Platform
                </CTAButton>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ContactCTA;
