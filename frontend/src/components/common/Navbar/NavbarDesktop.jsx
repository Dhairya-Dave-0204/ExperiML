import React from "react";
import { NavLink } from "react-router-dom";

import { PrimaryButton, SecondaryButton } from "@/components/components.index";

import { Network } from "lucide-react";

import { NAV_LINKS } from "./navLinks";
import { ROUTES } from "@/constants/routes";

function NavbarDesktop() {
  return (
    <nav className="hidden lg:block sticky top-0 z-50 border-b border-slate-200/80 bg-[#FAFAFA]/85 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 mx-auto h-17 max-w-300">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          aria-label="ExperiML Home"
          className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight text-slate-900"
        >
          <Network size={24} strokeWidth={2.5} className="text-blue-600" />
          <span>ExperiML</span>
        </Link>

        <div className="items-center hidden lg:flex gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              className="text-sm font-medium transition-colors duration-150 text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="items-center hidden gap-4 lg:flex">
          <SecondaryButton
            Element={NavLink}
            link={ROUTES.SIGN_IN}
            text={"Sign In"}
          />

          <PrimaryButton
            Element={NavLink}
            link={ROUTES.SIGN_UP}
            textName={"Start Building"}
          />
        </div>
      </div>
    </nav>
  );
}

export default NavbarDesktop;
