import React from "react";
import { motion } from "framer-motion";

import {
  fadeUp,
  cardReveal,
  staggerContainer,
  defaultViewport,
} from "@/animations/animations.index";

import CapabilityCard from "./CapabilityCard";

import { CAPABILITIES } from "./capabilitiesData";

function Capabilities() {
  return (
    <section id="capabilities" className="section-padding bg-background">
      <div className="container-custom">
        {/* ================= Section Header ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUp}
          className="max-w-3xl mb-12"
        >
          <h2 className="mb-5 text-4xl font-extrabold leading-tight font-heading text-text">
            Core Platform Capabilities
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-text-secondary">
            Everything required to transition from local hacking to
            production-grade tracking.
          </p>
        </motion.div>

        {/* ================= Bento Grid ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {CAPABILITIES.map((capability) => (
            <motion.div
              key={capability.id}
              variants={cardReveal}
              className={capability.wide ? "xl:col-span-2" : ""}
            >
              <CapabilityCard capability={capability} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Capabilities;
