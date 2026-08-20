import React from "react";

import { LegalHero, LegalSection } from "@/components/components.index";

import { PRIVACY_POLICY, PRIVACY_SECTIONS } from "./privacyPolicyData";

function PrivacyPolicy() {
  return (
    <>
      <LegalHero
        badge={PRIVACY_POLICY.badge}
        title={PRIVACY_POLICY.title}
        description={PRIVACY_POLICY.description}
        lastUpdated={PRIVACY_POLICY.lastUpdated}
      />

      <main className="py-16 container-custom md:py-20">
        {/* Overview */}

        <section className="p-8 border shadow-sm rounded-2xl border-border bg-surface">
          <h2 className="mb-4 text-2xl font-bold font-heading text-text">
            Privacy Overview
          </h2>

          <div className="space-y-4 text-base leading-8 text-text-secondary">
            <p>
              ExperiML is built with a strong emphasis on transparency and
              responsible handling of information. We collect only the data
              necessary to operate the platform, improve the user experience,
              and maintain security.
            </p>

            <p>
              We believe users should understand what information is collected,
              why it is collected, and how it is protected. This page explains
              those practices in clear, straightforward language.
            </p>
          </div>
        </section>

        <div className="mt-12">
          {PRIVACY_SECTIONS.map((section) => (
            <LegalSection
              key={section.id}
              id={section.id}
              title={section.title}
            >
              {section.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </LegalSection>
          ))}
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicy;
