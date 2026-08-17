import { motion } from "framer-motion";
import { MapPin, Globe } from "lucide-react";

import { MAPS_EMBED_SRC } from "./mapData";

import {
  sectionReveal,
  fadeLeft,
  fadeUp,
  widgetReveal,
  staggerFast,
  listItemReveal,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

function Locationmap() {
  return (
    <motion.section
      className="py-16 border-t border-border md:py-24"
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={sectionViewport}
    >
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Location Information */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Based in
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mb-4 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl"
          >
            Bhavnagar, Gujarat, India
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mb-6 max-w-md text-[15px] leading-relaxed text-text-secondary"
          >
            That's where the work happens day to day — but ExperiML itself is
            built for anyone, anywhere. Collaboration, discussions, and
            project-related communication all happen remotely, so distance has
            never really been a limiting factor.
          </motion.p>

          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <motion.div
              variants={listItemReveal}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm transition-colors duration-200 hover:border-primary/40"
            >
              <MapPin size={16} strokeWidth={1.75} className="text-primary" />

              <span className="text-sm font-medium text-text">
                Bhavnagar, Gujarat, India
              </span>
            </motion.div>

            <motion.div
              variants={listItemReveal}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm transition-colors duration-200 hover:border-primary/40"
            >
              <Globe size={16} strokeWidth={1.75} className="text-primary" />

              <span className="text-sm font-medium text-text">
                Open to remote collaboration
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Map */}
        <motion.div
          variants={widgetReveal}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="w-full overflow-hidden border shadow-sm aspect-4/3 rounded-xl border-border sm:aspect-video"
        >
          <iframe
            title="Map showing Bhavnagar, Gujarat, India"
            src={MAPS_EMBED_SRC}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Locationmap;
