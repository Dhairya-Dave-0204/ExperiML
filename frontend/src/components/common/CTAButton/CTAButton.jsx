import { Link } from "react-router-dom";

function CTAButton({ to = "/", children, icon: Icon, className = "" }) {
  return (
    <Link
      to={to}
      className={`
        group inline-flex items-center justify-center gap-2
        rounded-lg
        border border-white/20
        bg-white
        px-8 py-3.5
        text-sm font-semibold text-primary
        shadow-md

        transition-all duration-300

        hover:-translate-y-0.5
        hover:shadow-xl

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2

        active:translate-y-0

        ${className}
      `}
    >
      <span>{children}</span>

      {Icon && (
        <Icon
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}

export default CTAButton;
