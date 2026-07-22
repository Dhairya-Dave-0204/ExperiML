import React from "react";

import { CapabilityCard } from "./CapabilityCard";

import { CAPABILITIES } from "./capabilitiesData";

function Capabilities() {
  return (
    <section id="capabilities" className="section-padding bg-background">
      <div className="container-custom">
        {/* ================= Section Header ================= */}

        <div className="max-w-3xl mb-12">
          <h2 className="mb-5 text-4xl font-extrabold leading-tight font-heading text-text">
            Core Platform Capabilities
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-text-secondary">
            Everything required to transition from local hacking to
            production-grade tracking.
          </p>
        </div>

        {/* ================= Bento Grid ================= */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <div
              key={capability.id}
              className={capability.wide ? "xl:col-span-2" : ""}
            >
              <CapabilityCard capability={capability} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;
