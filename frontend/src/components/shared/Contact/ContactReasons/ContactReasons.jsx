import React from "react";

function ContactReasons() {
  return (
    <section className="py-16 border-t border-border md:py-24">
      <div className="container-custom">
        <div className="max-w-xl mb-10">
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Common reasons to write in
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight font-heading text-text md:text-3xl">
            Not sure what to say? Here are a few starting points
          </h2>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            None of these are required — they're just the messages that tend to
            show up most.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-3.5 rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors duration-150 hover:border-primary-light"
            >
              <div className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-primary-light">
                <Icon size={17} strokeWidth={1.75} className="text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-[15px] font-bold text-text">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactReasons;
