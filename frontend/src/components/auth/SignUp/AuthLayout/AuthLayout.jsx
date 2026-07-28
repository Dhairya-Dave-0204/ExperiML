import React from 'react'

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 app-background">
      {children}
    </div>
  );
}

export default AuthLayout