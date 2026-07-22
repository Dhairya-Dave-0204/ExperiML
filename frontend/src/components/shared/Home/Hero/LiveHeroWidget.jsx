import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Database } from "lucide-react";

import {
  HERO_WORKSPACE,
  ACTIVE_EXPERIMENT,
  COMPLETED_EXPERIMENT,
} from "./heroWidgetData";

function LiveHeroWidget() {
  const [epoch, setEpoch] = useState(ACTIVE_EXPERIMENT.training.startEpoch);

  const [gpuUtil, setGpuUtil] = useState(ACTIVE_EXPERIMENT.training.gpuMin);

  const [loss, setLoss] = useState(ACTIVE_EXPERIMENT.training.startLoss);

  useEffect(() => {
    const interval = setInterval(() => {
      setGpuUtil(
        Math.floor(
          Math.random() *
            (ACTIVE_EXPERIMENT.training.gpuMax -
              ACTIVE_EXPERIMENT.training.gpuMin +
              1) +
            ACTIVE_EXPERIMENT.training.gpuMin,
        ),
      );

      setEpoch((prev) =>
        prev < ACTIVE_EXPERIMENT.training.maxEpoch
          ? prev + 1
          : ACTIVE_EXPERIMENT.training.startEpoch,
      );

      setLoss((prev) =>
        Math.max(ACTIVE_EXPERIMENT.training.minLoss, prev - 0.0002),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-6 border shadow-lg rounded-2xl border-border bg-surface">
      {/* ================= Header ================= */}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold font-heading text-text">
            {HERO_WORKSPACE.projectName}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-xs text-text-secondary">
            <Database size={12} />

            <span>dataset: {HERO_WORKSPACE.datasetVersion}</span>

            <span className="text-border">|</span>

            <span>{HERO_WORKSPACE.activeExperiments} active experiments</span>
          </div>
        </div>

        <Activity size={20} className="text-text-secondary" />
      </div>

      {/* ================= Active Experiment ================= */}

      <div className="p-4 transition-colors duration-300 border rounded-xl border-primary/20 bg-primary-light hover:bg-primary-light">
        <div className="flex items-start justify-between gap-4">
          {/* Left */}

          <div className="flex items-center gap-4">
            <div
              className="
                h-2.5
                w-2.5
                animate-pulse
                rounded-full
                bg-primary
              "
            />

            <div>
              <h4 className="font-heading text-[15px] font-semibold text-text">
                {ACTIVE_EXPERIMENT.name}
              </h4>

              <p className="mt-1 font-mono text-xs text-text-secondary">
                eta: {ACTIVE_EXPERIMENT.parameters.eta}
                {" • "}
                max_depth: {ACTIVE_EXPERIMENT.parameters.maxDepth}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-primary">
              Loss: {loss.toFixed(4)}
            </p>

            <div className="flex flex-wrap justify-end gap-2 mt-1 text-xs text-text-secondary">
              <span>
                Epoch {epoch}/{ACTIVE_EXPERIMENT.training.maxEpoch}
              </span>

              <span className="text-accent">GPU: {gpuUtil}%</span>
            </div>
          </div>
        </div>
      </div>
      {/* ================= Completed Experiment ================= */}

      <div className="p-4 mt-3 transition-all duration-300 border border-transparent rounded-xl hover:border-border hover:bg-surface-soft">
        <div className="flex items-start justify-between gap-4">
          {/* Left */}

          <div className="flex items-center gap-4">
            <div className="h-2.5 w-2.5 rounded-full bg-success" />

            <div>
              <h4 className="font-heading text-[15px] font-semibold text-text">
                {COMPLETED_EXPERIMENT.name}
              </h4>

              <p className="mt-1 font-mono text-xs text-text-secondary">
                n_estimators: {COMPLETED_EXPERIMENT.parameters.nEstimators}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-text">
              F1: {COMPLETED_EXPERIMENT.metrics.f1Score}
            </p>

            <div className="flex items-center justify-end gap-1 mt-1 text-xs text-success">
              <CheckCircle2 size={12} />

              <span>Completed in {COMPLETED_EXPERIMENT.metrics.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveHeroWidget;
