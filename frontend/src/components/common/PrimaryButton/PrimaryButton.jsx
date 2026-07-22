import { ArrowRight } from "lucide-react";

function PrimaryButton({
  Element = "button",
  text,
  className = "",
  ...props
}) {
  return (
    <Element
      className={`
        group
        relative
        inline-flex
        items-center
        justify-center
        gap-2
        overflow-hidden
        rounded-lg
        bg-primary
        px-4.5
        py-2.5
        text-sm
        font-semibold
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:bg-primary-dark
        hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
        ${className}
      `}
      {...props}
    >
      {/* Shine Animation */}
      <span
        className="
          pointer-events-none
          absolute
          left-[-130%]
          top-0
          h-full
          w-1/2
          -skew-x-12
          bg-linear-to-r
          from-transparent
          via-white/25
          to-transparent
          transition-all
          duration-700
          ease-out
          group-hover:left-[160%]
        "
      />

      {/* Button Text */}
      <span className="relative z-10 text-primary-light">
        {text}
      </span>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="relative z-10 font-bold transition-transform duration-300 ease-out text-primary-light group-hover:translate-x-1"
      />
    </Element>
  );
}

export default PrimaryButton;