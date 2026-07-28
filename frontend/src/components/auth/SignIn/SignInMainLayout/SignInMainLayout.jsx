import React from "react";

import {
  AuthHero,
  SignInForm,
  AuthFooter,
} from "@/components/components.index";

function SignInMainLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <AuthHero />

      <div className="relative flex flex-col items-center justify-center px-4 py-16 overflow-hidden sm:px-6">
        {/* Subtle decorative background for the mobile/single-column view,
            where AuthHero (and its own background) is hidden. */}
        <div
          aria-hidden="true"
          className="absolute right-0 rounded-full pointer-events-none -top-20 h-72 w-72 bg-gradient-two-tone-3 opacity-10 blur-3xl lg:hidden"
        />

        <SignInForm />
        <AuthFooter />
      </div>
    </div>
  );
}

export default SignInMainLayout;
