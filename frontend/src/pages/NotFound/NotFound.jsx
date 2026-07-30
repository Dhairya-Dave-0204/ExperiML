import { Link } from "react-router-dom";
import { Home, FileText, ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants/routes";

function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center bg-primary-light/30 py-16">
      <div className="container-custom">
        <div className="max-w-3xl p-8 mx-auto border shadow-sm rounded-2xl border-border bg-surface md:p-12">
          {/* Badge */}

          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold tracking-wider uppercase border rounded-full border-primary/15 bg-primary-light text-primary">
            Resource Not Found
          </div>

          {/* Error Code */}

          <p className="text-6xl font-black tracking-tight font-heading text-primary md:text-7xl">
            404
          </p>

          {/* Heading */}

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight font-heading text-text md:text-4xl">
            Page Not Found
          </h1>

          {/* Description */}

          <p className="max-w-xl mt-4 leading-relaxed text-text-secondary">
            The page you're looking for doesn't exist, may have been moved, or
            the address entered is incorrect.
          </p>

          {/* Actions */}

          <div className="flex flex-col gap-3 mt-8 sm:flex-row">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark"
            >
              <Home size={16} />
              Back to Home
            </Link>

            <Link
              to={ROUTES.DOCUMENTATION}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors duration-150 hover:border-border-hover hover:bg-surface-soft"
            >
              <FileText size={16} />
              Documentation
            </Link>
          </div>

          {/* Divider */}

          <div className="h-px my-10 bg-border" />

          {/* Helpful Links */}

          <div>
            <p className="mb-4 text-sm font-semibold text-text">
              Helpful Links
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to={ROUTES.HOME}
                className="flex items-center justify-between p-4 transition-colors duration-150 border rounded-lg group border-border hover:border-border-hover hover:bg-surface-soft"
              >
                <div>
                  <p className="font-medium text-text">Home</p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Return to the landing page.
                  </p>
                </div>

                <ArrowLeft
                  size={18}
                  className="transition-transform duration-150 rotate-180 text-text-secondary group-hover:translate-x-1"
                />
              </Link>

              <Link
                to={ROUTES.DOCUMENTATION}
                className="flex items-center justify-between p-4 transition-colors duration-150 border rounded-lg group border-border hover:border-border-hover hover:bg-surface-soft"
              >
                <div>
                  <p className="font-medium text-text">Documentation</p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Explore guides and resources.
                  </p>
                </div>

                <ArrowLeft
                  size={18}
                  className="transition-transform duration-150 rotate-180 text-text-secondary group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
