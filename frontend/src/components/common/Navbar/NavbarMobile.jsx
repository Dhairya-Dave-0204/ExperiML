import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import {
  Logo,
  PrimaryButton,
  SecondaryButton,
} from "@/components/components.index";

import { NAV_LINKS } from "./navLinks";
import { ROUTES } from "@/constants/routes";

function NavbarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between container-custom h-17">
          <Logo />

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 transition-colors duration-300 rounded-lg hover:bg-surface-soft"
            aria-label="Toggle Navigation"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Overlay */}

      <div
        onClick={closeMenu}
        className={`
          fixed
          inset-0
          z-40
          bg-black/60
          transition-opacity
          duration-300

          ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}

      <aside
        className={`
          fixed
          top-0
          right-0
          z-50
          flex
          h-screen
          w-full
          flex-col
          border-l
          border-border
          bg-surface
          shadow-lg
          transition-transform
          duration-300

          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 border-b border-border h-17">
          <Logo />

          <button
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-surface-soft"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `
                  rounded-lg
                  px-4
                  py-3
                  text-base
                  font-medium
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-primary-light text-primary"
                      : "text-text-secondary hover:bg-surface-soft hover:text-text"
                  }
                `
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3 p-6 mt-auto border-t border-border">
          <SecondaryButton
            Element={NavLink}
            to={ROUTES.SIGN_IN}
            text="Sign In"
            onClick={closeMenu}
          />

          <PrimaryButton
            Element={NavLink}
            to={ROUTES.SIGN_UP}
            text="Start Building"
            onClick={closeMenu}
          />
        </div>
      </aside>
    </>
  );
}

export default NavbarMobile;
