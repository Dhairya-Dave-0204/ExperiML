import React from "react";

import { LegalHero, LegalSection } from "@/components/components.index";

import {
  DATA_POLICY,
  DATA_POLICY_OVERVIEW,
  DATA_POLICY_SECTIONS,
} from "./dataPolicyData";

function DataPolicy() {
  return (
    <>
      <LegalHero
        badge={DATA_POLICY.badge}
        title={DATA_POLICY.title}
        description={DATA_POLICY.description}
        lastUpdated={DATA_POLICY.lastUpdated}
      />

      <section className="section-padding">
        <div className="space-y-8 container-custom">
          <LegalSection title={DATA_POLICY_OVERVIEW.title}>
            <div className="space-y-4">
              {DATA_POLICY_OVERVIEW.content.map((paragraph, index) => (
                <p key={index} className="leading-8 text-text-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </LegalSection>

          {DATA_POLICY_SECTIONS.map((section) => (
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

export default DataPolicy;
