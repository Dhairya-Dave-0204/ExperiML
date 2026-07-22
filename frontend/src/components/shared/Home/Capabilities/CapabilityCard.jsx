import React from "react";

function CapabilityCard({ capability }) {
  const { title, description, icon: Icon, wide, ui } = capability;

  const renderMiniUI = () => {
    switch (ui.type) {
      case "experiment":
        return (
          <div className="p-3 font-mono text-xs border rounded-md border-border bg-background text-text-secondary">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-text">{ui.run}</strong>

              <span className="text-success">{ui.score}</span>
            </div>

            <div className="mb-2">
              <span className="text-primary">•</span> artifacts: {ui.artifacts}
            </div>

            <div>
              <span className="text-primary">•</span> params: {ui.params}
            </div>
          </div>
        );

      case "project":
        return (
          <div className="flex flex-col gap-1 p-3 font-mono text-xs border rounded-md border-border bg-background text-text-secondary">
            <div className="text-text">📁 {ui.project}</div>

            <div className="pl-4">├─ 📊 {ui.items[0]}</div>

            <div className="pl-4">├─ 🧪 {ui.items[1]}</div>

            <div className="pl-4">└─ 📦 {ui.items[2]}</div>
          </div>
        );

      case "dataset":
        return (
          <div className="p-3 font-mono text-xs border rounded-md border-border bg-background text-text-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-text">{ui.file}</span>

              <span className="rounded bg-surface-soft px-2 py-0.5">
                {ui.version}
              </span>
            </div>

            <div className="mb-2">sha256: {ui.hash}</div>

            <div>
              size: {ui.size} • linked runs: {ui.linkedRuns}
            </div>
          </div>
        );

      case "registry":
        return (
          <div className="p-3 font-mono text-xs border rounded-md border-border bg-background text-text-secondary">
            <div className="flex items-center justify-between mb-2">
              <strong className="text-text">{ui.model}</strong>

              <span className="text-success">● {ui.status}</span>
            </div>

            <div className="mb-2">stage: {ui.stage}</div>

            <div>lineage: {ui.lineage}</div>
          </div>
        );

      case "prediction":
        return (
          <div className="p-3 font-mono text-xs border rounded-md border-border bg-background text-text-secondary">
            <div className="mb-2">
              job_status: <span className="text-primary">{ui.status}</span>
            </div>

            <div className="mb-2">rows_processed: {ui.rowsProcessed}</div>

            <div className="mb-2">avg_confidence: {ui.confidence}</div>

            <div className="text-text">output: {ui.output}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <article
      className={`
        flex
        h-full
        flex-col
        rounded-xl
        border
        border-border
        bg-surface
        p-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-md

        ${wide ? "lg:col-span-2" : ""}
      `}
    >
      <div className="flex items-center justify-center mb-5 rounded-lg h-11 w-11 bg-primary-light text-primary">
        <Icon size={22} />
      </div>

      <h3 className="mb-3 text-xl font-bold font-heading text-text">{title}</h3>

      <p className="text-[15px] leading-7 text-text-secondary">{description}</p>

      <div className="pt-6 mt-auto">{renderMiniUI()}</div>
    </article>
  );
}

export default CapabilityCard;
