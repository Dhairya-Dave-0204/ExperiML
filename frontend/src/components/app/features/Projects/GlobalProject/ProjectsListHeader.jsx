const ProjectsListHeader = ({ count }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold font-heading text-text">
          Your Projects
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-text-secondary">
          View and access all of your machine learning projects.
        </p>
      </div>

      <span className="text-sm text-text-secondary">{count} projects</span>
    </div>
  );
};

export default ProjectsListHeader;
