const WORKSPACE_SUMMARY = [
  {
    label: "Projects",
    value: 12,
  },
  {
    label: "Experiments",
    value: 48,
  },
  {
    label: "Datasets",
    value: 23,
  },
  {
    label: "Models",
    value: 17,
  },
];

function WorkspaceSummary() {
  return (
    <div className="flex flex-wrap items-center px-1 pt-5 text-sm border-t gap-x-6 gap-y-2 border-border">
      <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Workspace
      </span>

      {WORKSPACE_SUMMARY.map((stat) => (
        <span key={stat.label} className="text-text-secondary">
          {stat.label}{" "}
          <span className="font-mono font-semibold text-text">
            {stat.value}
          </span>
        </span>
      ))}
    </div>
  );
}

export default WorkspaceSummary;
