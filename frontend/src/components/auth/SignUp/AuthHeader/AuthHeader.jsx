import React from "react";

function AuthHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight font-heading text-text">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-text-secondary">{subtitle}</p>
    </div>
  );
}

export default AuthHeader;
