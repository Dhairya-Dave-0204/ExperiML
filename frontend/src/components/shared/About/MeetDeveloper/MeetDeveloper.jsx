import React from "react";
import { NavLink } from "react-router-dom";
import { GitGraph, Link, Mail } from "lucide-react";

function MeetDeveloper() {
  return (
    <section
      id="developer"
      className="py-16 border-t border-border bg-surface-soft md:py-24"
    >
      <div className="container-custom">
        <div className="flex flex-col items-center max-w-2xl gap-6 p-8 mx-auto text-center border shadow-sm rounded-xl border-border bg-surface md:p-10">
          <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white rounded-full bg-gradient-two-tone-2 font-heading">
            DD
          </div>

          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-xs font-semibold tracking-wider uppercase text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Meet the developer
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight font-heading text-text">
              Built by someone who kept losing track of their own experiments
            </h2>
          </div>

          <p className="max-w-xl text-[15px] leading-relaxed text-text-secondary">
            ExperiML started as a internship project and grew into something
            closer to a real product — a production-grade machine learning
            platform built to solve a workflow problem I ran into constantly:
            too many notebooks, not enough memory of what actually worked. It's
            still evolving, built one deliberate decision at a time, with a
            focus on getting the fundamentals right before adding anything new.
          </p>

          <div className="flex items-center gap-3">
            <NavLink
              to="https://github.com/Dhairya-Dave-0204"
              aria-label="GitHub"
              className="flex items-center justify-center w-10 h-10 transition-colors duration-150 border rounded-lg border-border text-text-secondary hover:border-border-hover hover:text-text"
            >
              <GitGraph size={18} strokeWidth={1.75} />
            </NavLink>
            <NavLink
              to="https://github.com/Dhairya-Dave-0204"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-10 h-10 transition-colors duration-150 border rounded-lg border-border text-text-secondary hover:border-border-hover hover:text-text"
            >
              <Link size={18} strokeWidth={1.75} />
            </NavLink>
            <NavLink
              to="dhairyadave.work@gmail.com"
              aria-label="Email"
              className="flex items-center justify-center w-10 h-10 transition-colors duration-150 border rounded-lg border-border text-text-secondary hover:border-border-hover hover:text-text"
            >
              <Mail size={18} strokeWidth={1.75} />
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetDeveloper;
