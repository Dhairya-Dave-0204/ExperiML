import { motion } from "framer-motion";
import { cardHover } from "@/animations/animations.index";

function ContactCard({ icon: Icon, title, value, description }) {
  return (
    <motion.div
      whileHover={cardHover}
      className="p-6 border shadow-sm rounded-xl border-border bg-surface"
    >
      <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-lg bg-primary-light">
        <Icon size={20} strokeWidth={1.75} className="text-primary" />
      </div>

      <h3 className="mb-1 font-heading text-[15px] font-bold text-text">
        {title}
      </h3>

      <p className="mb-2 text-sm font-semibold text-text">{value}</p>

      <p className="text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </motion.div>
  );
}

export default ContactCard;
