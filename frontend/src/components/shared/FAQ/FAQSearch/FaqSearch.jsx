import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

function FaqSearch({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search
        size={17}
        strokeWidth={1.75}
        className="absolute -translate-y-1/2 pointer-events-none left-3.5 top-1/2 text-text-secondary"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions..."
        aria-label="Search frequently asked questions"
        className="w-full py-2.5 text-sm transition-colors duration-150 border rounded-lg border-border bg-surface-soft pl-10 pr-9 text-text placeholder:text-text-secondary/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
      />

      <AnimatePresence initial={false}>
        {value && (
          <motion.button
            key="clear-search"
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-secondary transition-colors duration-150 hover:bg-border/60 hover:text-text"
          >
            <X size={14} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FaqSearch;
