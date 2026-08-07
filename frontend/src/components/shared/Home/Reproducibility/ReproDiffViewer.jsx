import { motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";

import { fadeUp, listItemReveal, iconHover } from "@/animations/animations.index";

function DiffRow({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ReproDiffViewer() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="overflow-hidden rounded-xl bg-slate-900 font-mono text-[13px] text-slate-200 shadow-lg"
    >
      {/* Header */}
      <motion.div
        variants={listItemReveal}
        className="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-slate-800"
      >
        <div className="flex items-center gap-2 text-slate-300">
          <motion.div whileHover={iconHover}>
            <TerminalSquare size={16} className="text-slate-400" />
          </motion.div>

          <span>Compare: baseline vs active</span>
        </div>

        <span className="text-[11px] text-slate-500">14m ago</span>
      </motion.div>

      {/* Metadata */}
      <motion.div
        variants={listItemReveal}
        className="flex gap-4 border-b border-slate-800 bg-slate-950 px-5 py-3 text-[11px] text-slate-400"
      >
        <span>env: ubuntu-20.04</span>
        <span>seed: 42</span>
      </motion.div>

      {/* Diff */}
      <DiffRow
        delay={0.1}
        className="flex flex-wrap px-5 py-2 text-red-300 border-b border-slate-800 bg-red-500/15"
      >
        <div className="flex-1 min-w-50">- python: 3.9.12</div>

        <div className="flex-1 min-w-50">- cuda: 11.3</div>
      </DiffRow>

      <DiffRow
        delay={0.2}
        className="flex flex-wrap px-5 py-2 border-b border-slate-800 bg-emerald-500/15 text-emerald-300"
      >
        <div className="flex-1 min-w-50">+ python: 3.10.4</div>

        <div className="flex-1 min-w-50">+ cuda: 11.6</div>
      </DiffRow>

      <DiffRow
        delay={0.3}
        className="flex flex-wrap px-5 py-2 border-b border-slate-800"
      >
        <div className="flex-1 min-w-50">dataset_hash: "a1b2c3d"</div>

        <div className="flex-1 min-w-50">dataset_hash: "a1b2c3d"</div>
      </DiffRow>

      <DiffRow
        delay={0.4}
        className="flex flex-wrap px-5 py-2 text-red-300 border-b border-slate-800 bg-red-500/15"
      >
        <div className="flex-1 min-w-50">- learning_rate: 0.1</div>

        <div className="flex-1 min-w-50">- max_depth: 3</div>
      </DiffRow>

      <DiffRow
        delay={0.5}
        className="flex flex-wrap px-5 py-2 border-b border-slate-800 bg-emerald-500/15 text-emerald-300"
      >
        <div className="flex-1 min-w-50">+ learning_rate: 0.01</div>

        <div className="flex-1 min-w-50">+ max_depth: 6</div>
      </DiffRow>

      <DiffRow delay={0.6} className="flex flex-wrap px-5 py-2">
        <div className="flex-1 min-w-50">n_estimators: 100</div>

        <div className="flex-1 min-w-50">subsample: 0.8</div>
      </DiffRow>
    </motion.div>
  );
}

export default ReproDiffViewer;
