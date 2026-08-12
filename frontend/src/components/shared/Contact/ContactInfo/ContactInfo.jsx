import { motion } from "framer-motion";

import ContactCard from "./ContactCard";
import { CONTACT_ITEMS } from "./contactInfoData";

import {
  sectionReveal,
  heroContent,
  fadeUp,
  staggerFast,
  cardReveal,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function ContactInfo() {
  return (
    <motion.section
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
          className="max-w-xl mb-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Contact information
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl"
          >
            A few ways to reach out
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-[15px] leading-relaxed text-text-secondary"
          >
            Pick whichever feels right — every channel reaches the same place.
          </motion.p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CONTACT_ITEMS.map((item) => (
            <motion.div key={item.id} variants={cardReveal}>
              <ContactCard {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ContactInfo;
