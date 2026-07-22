function SecondaryButton({
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
        overflow-hidden
        rounded-lg
        border
        border-border
        bg-surface
        px-4.5
        py-2.5
        text-sm
        font-semibold
        text-text
        shadow-sm
        transition-all
        duration-300
        hover:border-border-hover
        hover:bg-primary-light/30
        hover:text-primary
        active:translate-y-0
        active:shadow-sm
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10">
        {text}
      </span>
    </Element>
  );
}

export default SecondaryButton;