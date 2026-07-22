import React from "react";

import { ArrowRight } from "lucide-react"

function PrimaryButton({ Element, link, text }) {
  return (
    <Element
      to={link}
      className="
          group
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-blue-600
          px-4.5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-[0_1px_2px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,0.15)]
          transition-all
          duration-200
          hover:bg-blue-700
          hover:shadow-[0_4px_12px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]
        "
    >
      <span>{text}</span>

      <ArrowRight
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Element>
  );
}

export default PrimaryButton;
