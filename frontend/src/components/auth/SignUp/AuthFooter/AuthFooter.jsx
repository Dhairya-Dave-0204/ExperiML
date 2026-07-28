import React from 'react'

function AuthFooter({ actionLabel = "signing in" }) {
  return (
    <p className="max-w-lg mt-6 text-xs leading-relaxed text-center text-text-secondary">
      By {actionLabel}, you agree to ExperiML's{" "}
      <a href="/terms" className="font-semibold text-text hover:text-primary hover:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="/privacy" className="font-semibold text-text hover:text-primary hover:underline">
        Privacy Policy
      </a>
      .
    </p>
  );
}

export default AuthFooter