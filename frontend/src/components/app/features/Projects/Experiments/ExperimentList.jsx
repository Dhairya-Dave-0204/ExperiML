import { Search } from "lucide-react";

import { ExperimentListItem } from "@/components/components.index";

const ExperimentList = ({ experiments, onExperimentClick }) => {
  return (
    <>
      {/* Results Count */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h2 className="text-sm font-medium text-foreground">Experiments</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {experiments.length}{" "}
            {experiments.length === 1 ? "experiment" : "experiments"}
          </p>
        </div>
      </div>

      {/* Desktop / Tablet Experiment List */}
      {experiments.length > 0 && (
        <div className="hidden mt-3 overflow-hidden border rounded-lg border-border bg-card md:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Experiment
                  </th>

                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Status
                  </th>

                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Dataset
                  </th>

                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Algorithm
                  </th>

                  <th className="px-4 py-3 text-xs font-medium text-left text-muted-foreground">
                    Updated
                  </th>

                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {experiments.map((experiment) => (
                  <ExperimentListItem
                    key={experiment.id}
                    experiment={experiment}
                    onClick={() => onExperimentClick?.(experiment)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Experiment List */}
      {experiments.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {experiments.map((experiment) => (
            <div key={experiment.id}>
              <ExperimentListItem
                experiment={experiment}
                onClick={() => onExperimentClick?.(experiment)}
              />
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {experiments.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-10 mt-3 text-center border border-dashed rounded-lg min-h-65 border-border bg-card">
          <div className="flex items-center justify-center rounded-full h-11 w-11 bg-muted">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-sm font-medium text-foreground">
            No experiments found
          </h3>

          <p className="max-w-sm mt-1 text-xs leading-5 text-muted-foreground">
            No experiments match your current search or status filter.
          </p>
        </div>
      )}
    </>
  );
};

export default ExperimentList;
