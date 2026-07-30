import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

function AuthFooter() {
  return (
    <p className="max-w-md mt-6 text-xs leading-relaxed text-center text-text-secondary">
      By signing in, you agree to ExperiML's{" "}
      <Link
        to={ROUTES.TERM_SERVICE}
        className="font-medium text-text hover:text-primary hover:underline"
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        to={ROUTES.PRIVACY_POLICY}
        className="font-medium text-text hover:text-primary hover:underline"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export default AuthFooter;
