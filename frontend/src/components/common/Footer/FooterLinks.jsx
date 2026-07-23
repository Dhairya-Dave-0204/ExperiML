import React from "react";
import { NavLink } from "react-router-dom";

function FooterLinks({ title, links }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold font-heading text-text">{title}</h3>

      <nav aria-label={title} className="flex flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.id}
            to={link.href}
            className="text-sm transition-colors duration-200 text-text-secondary hover:text-primary"
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default FooterLinks;
