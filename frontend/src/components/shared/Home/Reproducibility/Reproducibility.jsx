import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { REPRODUCIBILITY } from "./reproducibilityData";
import ReproDiffViewer from "./ReproDiffViewer";

import {
  fadeUp,
  fadeLeft,
  heroContent,
  listItemReveal,
  defaultViewport,
} from "@/animations/animations.index";

function Reproducibility() {
  return (
    <section
      className="section-padding bg-border/40"
    >
      <div className="grid items-center grid-cols-1 gap-16 container-custom xl:grid-cols-2">
        {/* ================= Left Content ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={heroContent}
        >
          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="
              mb-5
              inline-flex
              items-center
              rounded-full
              bg-surface
              px-4
              py-1.5
              font-mono
              text-xs
              font-semibold
              text-primary
            "
          >
            {REPRODUCIBILITY.badge}
          </motion.div>

          {/* Heading */}

          <motion.h2
            variants={fadeUp}
            className="mb-6 text-4xl font-extrabold leading-tight font-heading text-text lg:text-5xl"
          >
            {REPRODUCIBILITY.title}
          </motion.h2>

          {/* Description */}

          <motion.p
            variants={fadeUp}
            className="max-w-xl mb-8 leading-8 text-md text-text-secondary"
          >
            {REPRODUCIBILITY.description}
          </motion.p>

          {/* Features */}

          <motion.ul
            variants={heroContent}
            className="flex flex-col gap-4"
          >
            {REPRODUCIBILITY.features.map((feature) => (
              <motion.li
                key={feature.id}
                variants={listItemReveal}
                className="flex items-center gap-3 text-[15px] text-text"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-success"
                />

                <span>{feature.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ================= Diff Viewer ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeLeft}
        >
          <ReproDiffViewer />
        </motion.div>
      </div>
    </section>
  );
}

export default Reproducibility;