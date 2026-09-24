import { Database, Upload } from "lucide-react";

const DatasetEmptyState = ({ onUpload }) => {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="flex items-center justify-center mb-3 rounded-full h-11 w-11 bg-surface-soft">
        <Database
          size={19}
          strokeWidth={1.75}
          className="text-text-secondary"
        />
      </div>

      <h3 className="mb-1 text-sm font-bold text-text">
        No datasets yet
      </h3>

      <p className="max-w-xs mb-5 text-xs leading-relaxed text-text-secondary">
        Upload a dataset to begin working with data in this project.
      </p>

      <button
        type="button"
        onClick={onUpload}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark"
      >
        <Upload size={15} strokeWidth={2} />
        Upload Dataset
      </button>
    </div>
  );
};

export default DatasetEmptyState;