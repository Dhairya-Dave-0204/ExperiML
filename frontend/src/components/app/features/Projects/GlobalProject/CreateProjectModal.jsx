import { X } from "lucide-react";

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="w-full max-w-lg bg-white border shadow-xl rounded-2xl border-border"
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-border">
          <div>
            <h2
              id="create-project-title"
              className="text-lg font-semibold tracking-tight font-heading text-text"
            >
              Create Project
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-text-secondary">
              Create a new machine learning project to get started.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close create project dialog"
            className="inline-flex items-center justify-center w-8 h-8 transition-colors rounded-lg shrink-0 text-text-secondary hover:bg-surface-soft hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="px-6 py-6 space-y-5">
            <div>
              <label
                htmlFor="project-name"
                className="block text-sm font-medium text-text"
              >
                Project Name
              </label>

              <input
                id="project-name"
                name="name"
                type="text"
                placeholder="Enter project name"
                className="mt-2 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-text"
              >
                Description
                <span className="ml-1 font-normal text-text-secondary">
                  (optional)
                </span>
              </label>

              <textarea
                id="project-description"
                name="description"
                rows={4}
                placeholder="Describe what this project is about"
                className="mt-2 w-full resize-none rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-soft hover:text-text"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
