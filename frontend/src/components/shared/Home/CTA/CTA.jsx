import React from "react";
import { motion } from "framer-motion";

import {
  heroContent,
  fadeUp,
  defaultViewport,
} from "@/animations/animations.index";

import { ArrowRight } from "lucide-react";

import { CTAButton } from "@/components/components.index";
import { CTA_CONTENT } from "./ctaData";

function CTA() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={heroContent}
      id="cta"
      className="border-t section-padding border-border bg-background"
    >
      <div className="container-custom">
        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -4,
            boxShadow: "0 24px 48px rgba(15,23,42,0.10)",
          }}
          transition={{ duration: 0.35 }}
          className="relative px-6 py-16 overflow-hidden text-center border shadow-lg rounded-3xl border-border bg-linear-to-br from-surface via-surface to-primary-soft/40 sm:px-10 lg:px-16 lg:py-24"
        >
          {/* Background Decoration */}
          <div
            className="
              absolute inset-0 opacity-40
              bg-[radial-gradient(var(--color-border)_1px,transparent_1px)]
              bg-size-[24px_24px]
            "
            aria-hidden="true"
          />

          <div
            className="absolute right-0 rounded-full -top-32 h-90 w-90 bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute left-0 rounded-full -bottom-32 h-90 w-90 bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold tracking-tight font-heading text-text lg:text-5xl"
            >
              {CTA_CONTENT.title}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg leading-8 text-text-secondary"
            >
              {CTA_CONTENT.description}
            </motion.p>

            <motion.div variants={fadeUp} className="flex justify-center mt-10">
              <CTAButton to={CTA_CONTENT.button.href} icon={ArrowRight}>
                {CTA_CONTENT.button.label}
              </CTAButton>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-6 font-mono text-sm text-text-secondary"
            >
              {CTA_CONTENT.note}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default CTA;
