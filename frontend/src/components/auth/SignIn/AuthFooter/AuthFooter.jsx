import React from "react";

function AuthFooter() {
  return (
    <p className="max-w-md mt-6 text-xs leading-relaxed text-center text-text-secondary">
      By signing in, you agree to ExperiML's{" "}
      <a
        href="/terms"
        className="font-medium text-text hover:text-primary hover:underline"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="/privacy"
        className="font-medium text-text hover:text-primary hover:underline"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
}

export default AuthFooter;
