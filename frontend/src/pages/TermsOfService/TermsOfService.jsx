import React from "react";

import { LegalHero, LegalSection } from "@/components/components.index";

import { TERMS_OF_SERVICE, TERMS_SECTIONS } from "./termsOfServiceData";

function TermsOfService() {
  return (
    <>
      <LegalHero
        badge={TERMS_OF_SERVICE.badge}
        title={TERMS_OF_SERVICE.title}
        description={TERMS_OF_SERVICE.description}
        lastUpdated={TERMS_OF_SERVICE.lastUpdated}
      />

      <main className="py-16 container-custom md:py-20">
        {/* Overview */}
        <section className="p-8 border shadow-sm rounded-2xl border-border bg-surface">
          <h2 className="mb-4 text-2xl font-bold font-heading text-text">
            Terms Overview
          </h2>

          <div className="space-y-4 text-base leading-8 text-text-secondary">
            <p>
              These Terms of Service govern your access to and use of ExperiML.
              By creating an account or using the platform, you agree to comply
              with these terms and all applicable laws.
            </p>

            <p>
              Please read this document carefully. It explains your rights,
              responsibilities, and the rules that help maintain a secure and
              reliable platform for everyone.
            </p>
          </div>
        </section>

        <div className="mt-12">
          {TERMS_SECTIONS.map((section) => (
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

export default TermsOfService;
