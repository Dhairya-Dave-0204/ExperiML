import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

function AuthFooter({ actionLabel = "signing in" }) {
  return (
    <p className="max-w-lg mt-6 text-xs leading-relaxed text-center text-text-secondary">
      By {actionLabel}, you agree to ExperiML's{" "}
      <Link
        to={ROUTES.TERM_SERVICE}
        className="font-semibold text-text hover:text-primary hover:underline"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        to={ROUTES.PRIVACY_POLICY}
        className="font-semibold text-text hover:text-primary hover:underline"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export default AuthFooter;
