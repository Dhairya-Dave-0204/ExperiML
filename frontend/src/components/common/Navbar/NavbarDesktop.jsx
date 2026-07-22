import { NavLink } from "react-router-dom";
import { Network } from "lucide-react";

import { PrimaryButton, SecondaryButton } from "@/components/components.index";

import { NAV_LINKS } from "./navLinks";
import { ROUTES } from "@/constants/routes";

function DesktopNavbar() {
  return (
    <nav className="sticky top-0 z-50 hidden border-b border-border bg-background/85 backdrop-blur-xl md:block">
      <div
        className="flex items-center justify-between px-6 mx-auto h-17 max-w-300"
      >
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
          <Network size={24} strokeWidth={2.5} className="text-primary" />

          <span>ExperiML</span>
        </NavLink>

        {/* ================= Navigation ================= */}
        <div className="items-center hidden gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `
                group
                relative
                py-1
                text-sm
                font-medium
                transition-colors
                duration-300
                ${
                  isActive
                    ? "text-primary"
                    : "text-text-secondary hover:text-text"
                }
              `
              }
            >
              {link.label}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-0
                  bg-primary/70
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </NavLink>
          ))}
        </div>

        {/* ================= Actions ================= */}
        <div className="items-center hidden gap-4 md:flex">
          <SecondaryButton
            Element={NavLink}
            to={ROUTES.SIGN_IN}
            text="Sign In"
          />

          <PrimaryButton
            Element={NavLink}
            to={ROUTES.SIGN_UP}
            text="Start Building"
          />
        </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;
