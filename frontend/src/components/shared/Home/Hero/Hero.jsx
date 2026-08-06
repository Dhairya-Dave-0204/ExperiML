import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { PrimaryButton, SecondaryButton } from "@/components/components.index";

import { ROUTES } from "@/constants/routes";
import {
  fade,
  fadeUp,
  heroContent,
  widgetReveal,
} from "@/animations/animations.index";

import LiveHeroWidget from "./LiveHeroWidget";

function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={fade}
      className="relative pb-10 overflow-hidden border-b mt-14 border-border bg-linear-to-b from-white to-background md:pt-14"
    >
      <div
        className="
          container-custom
          grid
          items-center
          gap-16
          py-20
          lg:grid-cols-[1.1fr_0.9fr]
          lg:py-28
        "
      >
        {/* ================= Left Content ================= */}

        <motion.div
          variants={heroContent}
          className="order-1 text-center lg:text-left"
        >
          {/* Badge */}

          <motion.div
            variants={fadeUp}
            className="
              mb-5
              inline-flex
              items-center
              rounded-full
              bg-primary-light
              px-4
              py-1.5
              font-mono
              text-xs
              font-semibold
              text-primary
            "
          >
            ML Experiment Management
          </motion.div>

          {/* Heading */}

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-extrabold leading-tight tracking-tight font-heading text-text sm:text-5xl lg:text-6xl"
          >
            Engineering discipline
            <br className="hidden sm:block" /> for Machine Learning.
          </motion.h1>

          {/* Description */}

          <motion.p
            variants={fadeUp}
            className="max-w-xl mx-auto mt-6 text-base leading-8 text-text-secondary lg:mx-0 lg:text-lg"
          >
            Stop treating ML experiments like throwaway scripts. ExperiML
            provides a structured workspace for datasets, hyperparameter
            tracking, model lineage, and absolute reproducibility.
          </motion.p>

          {/* CTA */}

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4 mt-10 lg:justify-start"
          >
            <PrimaryButton
              Element={NavLink}
              to={ROUTES.SIGN_UP}
              text="Deploy Workspace"
              icon={<ArrowRight size={18} />}
            />

            <SecondaryButton
              Element={NavLink}
              to={ROUTES.DOCS}
              text="Documentation"
            />
          </motion.div>
        </motion.div>

        {/* ================= Right Widget ================= */}

        <motion.div variants={widgetReveal} className="order-2 w-full">
          <LiveHeroWidget />
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Hero;
