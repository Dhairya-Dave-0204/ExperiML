import React from 'react'

function AuthCard({ children }) {
  return (
    <div className="relative w-full max-w-lg p-8 border shadow-lg rounded-2xl border-border bg-surface sm:p-10">
      {children}
    </div>
  );
}

export default AuthCard