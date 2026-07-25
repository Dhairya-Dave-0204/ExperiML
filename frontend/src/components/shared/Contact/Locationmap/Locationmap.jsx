import React from "react";

import { MapPin, Globe } from "lucide-react";

import { MAPS_EMBED_SRC } from "./mapData"

function Locationmap() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Based in
          </div>
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Bhavnagar, Gujarat, India
          </h2>
          <p className="mb-6 max-w-md text-[15px] leading-relaxed text-text-secondary">
            That's where the work happens day to day — but ExperiML itself is
            built for anyone, anywhere. Collaboration, discussions, and
            project-related communication all happen remotely, so distance has
            never really been a limiting factor.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm transition-all duration-300 hover:border-primary/40">
              <MapPin size={16} strokeWidth={1.75} className="text-primary" />
              <span className="text-sm font-medium text-text">
                Bhavnagar, Gujarat, India
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-surface px-4 py-2.5 shadow-sm transition-all duration-300 hover:border-primary/40">
              <Globe size={16} strokeWidth={1.75} className="text-primary" />
              <span className="text-sm font-medium text-text">
                Open to remote collaboration
              </span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden border shadow-sm aspect-4/3 rounded-xl border-border sm:aspect-video">
          <iframe
            title="Map showing Bhavnagar, Gujarat, India"
            src={MAPS_EMBED_SRC}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

export default Locationmap;
