import { motion } from "framer-motion";

import {
  cardHover,
  cardTap,
  iconHover,
  fadeUp,
} from "@/animations/animations.index";

function DagNode({ icon: Icon, title, meta, active = false, success = false }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      whileTap={cardTap}
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 rgba(6,182,212,0)",
                "0 0 18px rgba(6,182,212,.18)",
                "0 0 0 rgba(6,182,212,0)",
              ],
            }
          : {}
      }
      transition={
        active
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {}
      }
      className={`
        flex
        min-w-55
        items-start
        gap-3
        rounded-xl
        border
        p-4
        shadow-sm
        transition-colors
        duration-300
        hover:border-primary
        hover:bg-surface-soft

        ${
          active
            ? "border-accent bg-cyan-50"
            : success
              ? "border-success bg-success-soft"
              : "border-border bg-surface"
        }
      `}
    >
      {/* Icon */}

      <motion.div
        whileHover={iconHover}
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg

          ${
            active
              ? "bg-cyan-100 text-accent"
              : success
                ? "bg-surface text-success"
                : "bg-surface-soft text-text-secondary"
          }
        `}
      >
        <Icon size={18} />
      </motion.div>

      {/* Content */}

      <motion.div
        initial={{
          opacity: 0,
          y: 5,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          delay: 0.1,
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex-1 min-w-0"
      >
        <h3 className="text-sm font-semibold font-heading text-text">
          {title}
        </h3>

        <p className="mt-1 font-mono text-xs text-text-secondary">{meta}</p>
      </motion.div>
    </motion.div>
  );
}

export default DagNode;
