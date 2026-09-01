function WorkspaceSummary({ data }) {
  if (!data) {
    return null;
  }

  const summary = [
    {
      label: "Projects",
      value: data.projects ?? 0,
    },
    {
      label: "Experiments",
      value: data.experiments ?? 0,
    },
    {
      label: "Datasets",
      value: data.datasets ?? 0,
    },
  ];

  return (
    <div className="flex flex-wrap items-center px-1 pt-5 text-sm border-t gap-x-6 gap-y-2 border-border">
      <span className="text-xs font-semibold tracking-wider uppercase text-text-secondary">
        Workspace
      </span>

      {summary.map((stat) => (
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
