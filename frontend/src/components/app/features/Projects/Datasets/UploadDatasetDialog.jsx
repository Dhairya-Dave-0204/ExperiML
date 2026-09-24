import { useState } from "react";
import { useParams } from "react-router-dom";

import { FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import datasetService from "@/services/dataset/datasetService";

const UploadDatasetDialog = ({ onClose }) => {
  const { projectId } = useParams();

  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  function handleFilePicked(selectedFile) {
    if (!selectedFile) return;

    setFile(selectedFile);
    setStage("selected");
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleUpload() {
    if (!file || !projectId) {
      return;
    }

    try {
      setError(null);
      setStage("uploading");

      const formData = new FormData();

      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("file", file);

      await datasetService.createDataset(projectId, formData);

      onClose();
    } catch (error) {
      console.error("Failed to upload dataset:", error);

      setError(error?.response?.data?.message || "Failed to upload dataset.");

      setStage("selected");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-text/30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-dialog-title"
        className="relative w-full max-w-md p-6 border shadow-lg rounded-2xl border-border bg-surface"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="upload-dialog-title"
            className="text-base font-bold font-heading text-text"
          >
            Upload Dataset
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 transition-colors duration-150 rounded-lg text-text-secondary hover:bg-surface-soft hover:text-text"
          >
            <X size={17} strokeWidth={1.85} />
          </button>
        </div>

        {stage === "uploading" ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Loader2
              size={22}
              className="mb-3 animate-spin text-primary"
              strokeWidth={2}
            />

            <div className="mb-1 text-sm font-semibold text-text">
              Uploading dataset...
            </div>

            <p className="max-w-xs text-xs text-text-secondary">
              Once the upload finishes, processing continues in the background.
              You can safely close this dialog — the dataset will appear as{" "}
              <span className="font-semibold text-warning">PROCESSING</span>{" "}
              until it's ready.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-text-secondary">
              Supported formats: CSV, XLSX
            </p>

            {stage === "idle" && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);

                  handleFilePicked(event.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
                  isDragging
                    ? "border-primary bg-primary-light/30"
                    : "border-border"
                }`}
              >
                <Upload
                  size={20}
                  strokeWidth={1.75}
                  className="mb-3 text-text-secondary"
                />

                <p className="mb-1 text-sm font-medium text-text">
                  Drag and drop a file here
                </p>

                <p className="mb-4 text-xs text-text-secondary">or</p>

                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg cursor-pointer border-border text-text hover:bg-surface-soft">
                  Choose File
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="sr-only"
                    onChange={(event) =>
                      handleFilePicked(event.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>
            )}

            {stage === "selected" && file && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 border rounded-xl border-border bg-surface-soft">
                <div className="flex min-w-0 items-center gap-2.5">
                  <FileSpreadsheet
                    size={18}
                    strokeWidth={1.75}
                    className="shrink-0 text-text-secondary"
                  />

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate text-text">
                      {file.name}
                    </div>

                    <div className="text-xs text-text-secondary">
                      {formatSize(file.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setStage("idle");
                  }}
                  aria-label="Remove selected file"
                  className="shrink-0 rounded-lg p-1.5 text-text-secondary transition-colors duration-150 hover:bg-surface hover:text-text"
                >
                  <X size={15} strokeWidth={1.85} />
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold transition-colors duration-150 border rounded-lg border-border text-text hover:bg-surface-soft"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={stage !== "selected"}
                onClick={handleUpload}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 rounded-lg bg-primary hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload
              </button>
            </div>

            {error && (
              <p className="mt-3 text-xs font-medium text-danger">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadDatasetDialog;
