import React from "react";
import { TerminalSquare } from "lucide-react";

function ReproDiffViewer() {
  return (
    <div className="overflow-hidden rounded-xl bg-slate-900 font-mono text-[13px] text-slate-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <TerminalSquare size={16} className="text-slate-400" />

          <span>Compare: baseline vs active</span>
        </div>

        <span className="text-[11px] text-slate-500">14m ago</span>
      </div>

      {/* Metadata */}
      <div className="flex gap-4 border-b border-slate-800 bg-slate-950 px-5 py-3 text-[11px] text-slate-400">
        <span>env: ubuntu-20.04</span>
        <span>seed: 42</span>
      </div>

      {/* Diff */}
      <div className="flex flex-wrap px-5 py-2 text-red-300 border-b border-slate-800 bg-red-500/15">
        <div className="flex-1 min-w-50">- python: 3.9.12</div>

        <div className="flex-1 min-w-50">- cuda: 11.3</div>
      </div>

      <div className="flex flex-wrap px-5 py-2 border-b border-slate-800 bg-emerald-500/15 text-emerald-300">
        <div className="flex-1 min-w-50">+ python: 3.10.4</div>

        <div className="flex-1 min-w-50">+ cuda: 11.6</div>
      </div>

      <div className="flex flex-wrap px-5 py-2 border-b border-slate-800">
        <div className="flex-1 min-w-50">dataset_hash: "a1b2c3d"</div>

        <div className="flex-1 min-w-50">dataset_hash: "a1b2c3d"</div>
      </div>

      <div className="flex flex-wrap px-5 py-2 text-red-300 border-b border-slate-800 bg-red-500/15">
        <div className="flex-1 min-w-50">- learning_rate: 0.1</div>

        <div className="flex-1 min-w-50">- max_depth: 3</div>
      </div>

      <div className="flex flex-wrap px-5 py-2 border-b border-slate-800 bg-emerald-500/15 text-emerald-300">
        <div className="flex-1 min-w-50">+ learning_rate: 0.01</div>

        <div className="flex-1 min-w-50">+ max_depth: 6</div>
      </div>

      <div className="flex flex-wrap px-5 py-2">
        <div className="flex-1 min-w-50">n_estimators: 100</div>

        <div className="flex-1 min-w-50">subsample: 0.8</div>
      </div>
    </div>
  );
}

export default ReproDiffViewer;
