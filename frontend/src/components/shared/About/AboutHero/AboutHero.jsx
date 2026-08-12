import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { STEPS } from "./aboutHeroData";
import { PrimaryButton, SecondaryButton } from "@/components/components.index";
import {
  heroContent,
  sectionReveal,
  widgetReveal,
  fadeUp,
  staggerFast,
  listItemReveal,
  smallCardHover,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function AboutHero() {
  return (
    <motion.section
      className="py-16 mt-10 md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Hero Content */}
        <motion.div
          variants={heroContent}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            About ExperiML
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[44px]"
          >
            A home for every experiment <br /> you run.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg mb-6 text-base leading-relaxed text-text-secondary"
          >
            ExperiML is a machine learning experiment management platform built
            for students, developers, researchers, and ML engineers — a single
            place to organize datasets, track experiments, compare models, and
            keep every result reproducible.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <PrimaryButton
              text="Explore the platform"
              Element={Link}
              to={ROUTES.SIGN_IN}
            />

            <SecondaryButton
              text="View documentation"
              Element={Link}
              to={ROUTES.DOCS}
            />
          </motion.div>
        </motion.div>

        {/* Visual: the shape of the platform, at a glance */}
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="p-5 border shadow-md rounded-xl border-border bg-surface"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between mb-4"
          >
            <div>
              <div className="text-sm font-bold font-heading text-text">
                One workspace
              </div>

              <div className="text-xs text-text-secondary">
                from raw data to trusted results
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {STEPS.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={listItemReveal}
                whileHover={smallCardHover}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-soft px-3 py-3 cursor-pointer"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md shrink-0 bg-primary-light">
                  <Icon size={16} strokeWidth={1.75} className="text-primary" />
                </div>

                <span className="text-sm font-semibold text-text">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default AboutHero;
