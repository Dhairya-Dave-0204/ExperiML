import React from "react";

import { LegalHero, LegalSection } from "@/components/components.index";

import {
  COOKIE_POLICY,
  COOKIE_POLICY_OVERVIEW,
  COOKIE_POLICY_SECTIONS,
} from "./cookiePolicyData";

function cookiePolicyData() {
  return (
    <>
      <LegalHero
        badge={COOKIE_POLICY.badge}
        title={COOKIE_POLICY.title}
        description={COOKIE_POLICY.description}
        lastUpdated={COOKIE_POLICY.lastUpdated}
      />

      <section className="section-padding">
        <div className="space-y-8 container-custom">
          <LegalSection title={COOKIE_POLICY_OVERVIEW.title}>
            <div className="space-y-4">
              {COOKIE_POLICY_OVERVIEW.content.map((paragraph, index) => (
                <p key={index} className="leading-8 text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </LegalSection>

          {COOKIE_POLICY_SECTIONS.map((section) => (
            <LegalSection
              key={section.id}
              id={section.id}
              title={section.title}
            >
              <div className="space-y-4">
                {section.content.map((paragraph, index) => (
                  <p key={index} className="leading-8 text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </LegalSection>
          ))}
        </div>
      </section>
    </>
  );
}

export default cookiePolicyData;
