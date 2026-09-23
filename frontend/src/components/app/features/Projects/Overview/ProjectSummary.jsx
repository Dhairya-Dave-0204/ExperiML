import { Database, FlaskConical, Boxes, Target } from "lucide-react";

const ProjectSummary = ({ summary }) => {
  const summaryItems = [
    {
      label: "Datasets",
      value: summary.datasets,
      icon: Database,
    },
    {
      label: "Experiments",
      value: summary.experiments,
      icon: FlaskConical,
    },
    {
      label: "Models",
      value: summary.models,
      icon: Boxes,
    },
    {
      label: "Predictions",
      value: summary.predictions,
      icon: Target,
    },
  ];

  return (
    <section className="mb-8">
      <SectionHeading
        title="Project Summary"
        description="A high-level view of the work in this project."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <SummaryCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
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

const SummaryCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="p-5 bg-white border rounded-xl border-border">
      <div className="flex items-center justify-center mb-4 rounded-lg h-9 w-9 bg-primary-light text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>

      <p className="text-sm text-text-secondary">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight font-heading text-text">
        {value}
      </p>
    </div>
  );
};

export default ProjectSummary;
