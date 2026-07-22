import { Database, GitPullRequest } from "lucide-react";

function Narrative() {
  return (
    <section id="product" className="bg-surface py-18 lg:py-28">
      <div className="container-custom">
        <div className="grid grid-cols-1 overflow-hidden border rounded-3xl border-border lg:grid-cols-2">
          {/* ================= Left Pane ================= */}

          <div className="px-6 py-10 bg-surface-soft sm:px-8 lg:px-14 lg:py-14">
            <GitPullRequest size={32} className="mb-6 text-warning" />

            <h3
              className="
                font-heading
                text-2xl
                font-extrabold
                tracking-tight
                text-text

                lg:text-[26px]
              "
            >
              The Messy Reality
            </h3>

            <p className="max-w-xl mt-5 text-base leading-8 text-text-secondary">
              Most ML work lives across fragmented Jupyter notebooks, local
              folders, and untracked CSVs. Datasets get overwritten,
              hyperparameters are forgotten, and reproducing last week's "best
              model" relies heavily on guesswork.
            </p>
          </div>

          {/* ================= Right Pane ================= */}

          <div className="px-6 py-10 bg-surface sm:px-8 lg:px-14 lg:py-14">
            <Database size={32} className="mb-6 text-primary" />

            <h3
              className="
                font-heading
                text-2xl
                font-extrabold
                tracking-tight
                text-text

                lg:text-[26px]
              "
            >
              The Engineered Standard
            </h3>

            <p className="max-w-xl mt-5 text-base leading-8 text-text-secondary">
              We treat ML like software engineering. By isolating datasets,
              enforcing immutable experiment logging, and linking models
              directly to their generating parameters, ExperiML ensures
              bit-for-bit reproducibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Narrative;
