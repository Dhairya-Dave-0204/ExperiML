import React from "react";
import { Activity } from "lucide-react";

import { Logo } from "@/components/components.index";
import FooterLinks from "./FooterLinks";
import { FOOTER_CONTENT, FOOTER_LINK_GROUPS } from "./footerData";

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="py-20 container-custom">
        {/* Top Section */}
        <div
          className="
            grid
            grid-cols-1
            gap-16
            lg:grid-cols-[1.2fr_2fr]
          "
        >
          {/* Brand */}
          <div className="max-w-sm">
            <Logo className="mb-5" />

            <p className="text-base leading-7 text-text-secondary">
              {FOOTER_CONTENT.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:justify-items-end">
            {FOOTER_LINK_GROUPS.map((group) => (
              <FooterLinks
                key={group.id}
                title={group.title}
                links={group.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 pt-8 mt-16 border-t border-border sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">
            {FOOTER_CONTENT.copyright}
          </p>

          <div className="flex items-center gap-2">
            <Activity size={16} className="text-success" />

            <span className="font-mono text-sm text-text-secondary">
              {FOOTER_CONTENT.status}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
