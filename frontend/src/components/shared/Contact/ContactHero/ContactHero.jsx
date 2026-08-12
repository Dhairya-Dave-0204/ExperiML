import { motion } from "framer-motion";

import {
  sectionReveal,
  heroContent,
  fadeUp,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function ContactHero() {
  return (
    <motion.section
      className="py-16 mt-10 md:py-24 bg-surface"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <motion.div
        variants={heroContent}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="flex flex-col items-center text-center container-custom"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Get in touch
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-4 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl lg:text-[42px]"
        >
          Questions, feedback, or an idea worth discussing?
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-lg text-base leading-relaxed text-text-secondary"
        >
          Whether it's a technical question, a bug you've spotted, or a
          collaboration idea — reach out. Every message about ExperiML goes
          straight to the person building it.
        </motion.p>
      </motion.div>
    </motion.section>
  );
}

export default ContactHero;
