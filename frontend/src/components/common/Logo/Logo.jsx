import React from "react";

import { NavLink } from "react-router-dom";

import { ROUTES } from "@/constants/routes"

import { FlaskConical } from "lucide-react";

function Logo() {
  return (
    <>
      {/* ================= Logo ================= */}
      <NavLink
        to={ROUTES.HOME}
        aria-label="ExperiML Home"
        className="
            flex
            items-center
            gap-2
            text-[19px]
            font-extrabold
            tracking-tight
            text-text
            transition-colors
            duration-300
            hover:text-primary
          "
      >
        <FlaskConical size={24} strokeWidth={2.5} className="text-primary" />

        <span>ExperiML</span>
      </NavLink>
    </>
  );
}

export default Logo;
