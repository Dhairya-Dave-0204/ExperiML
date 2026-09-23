const ProjectInformation = ({ project, projectId }) => {
  return (
    <section>
      <SectionHeading
        title="Project Information"
        description="Basic information about this project."
      />

      <div className="bg-white border rounded-xl border-border">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <InfoItem label="Created" value={formatDate(project.createdAt)} />

          <InfoItem label="Last updated" value={formatDate(project.updatedAt)} />

          <InfoItem label="Project ID" value={projectId || "—"} mono />
        </div>
      </div>
    </section>
  );
};

const SectionHeading = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold font-heading text-text">
        {title}
      </h2>

      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
};

const InfoItem = ({ label, value, mono = false }) => {
  return (
    <div className="p-5">
      <p className="mb-1 text-xs font-medium tracking-wide uppercase text-text-secondary">
        {label}
      </p>

      <p
        className={[
          "text-sm font-medium text-text",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export default ProjectInformation;
