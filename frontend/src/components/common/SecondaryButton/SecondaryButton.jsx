import React from "react";

function SecondaryButton({ Element, link, text }) {
  return (
    <Element
      to={link}
      className="
          inline-flex
          items-center
          justify-center
          rounded-lg
          border
          border-slate-200
          bg-white
          px-4.5
          py-2.5
          text-sm
          font-semibold
          text-slate-900
          shadow-sm
          transition-all
          duration-200
          hover:border-slate-300
          hover:bg-slate-50
          hover:text-blue-600
        "
    >
      {text}
    </Element>
  );
}

export default SecondaryButton;
