import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";

function ChangePasswordDialog({ isOpen, onClose }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Close the dialog when the Escape key is pressed.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  /**
   * Prevent rendering when the dialog is closed.
   */
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    // API integration and validation will be added later.
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-100 bg-black/60 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        aria-describedby="change-password-description"
        className="w-full max-w-md overflow-hidden border shadow-xl rounded-2xl border-border bg-surface"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-5 border-b border-border sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-primary/10 text-primary">
              <KeyRound size={19} strokeWidth={2} />
            </div>

            <div>
              <h2
                id="change-password-title"
                className="text-base font-semibold text-text"
              >
                Change password
              </h2>

              <p
                id="change-password-description"
                className="mt-1 text-sm leading-relaxed text-text-secondary"
              >
                Update your password to keep your account secure.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close change password dialog"
            className="inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-lg shrink-0 text-text-secondary hover:bg-surface-soft hover:text-text"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5 space-y-5 sm:px-6">
            {/* Current password */}
            <PasswordField
              id="current-password"
              label="Current password"
              placeholder="Enter your current password"
              showPassword={showCurrentPassword}
              onToggleVisibility={() =>
                setShowCurrentPassword((previous) => !previous)
              }
            />

            {/* New password */}
            <PasswordField
              id="new-password"
              label="New password"
              placeholder="Enter your new password"
              showPassword={showNewPassword}
              onToggleVisibility={() =>
                setShowNewPassword((previous) => !previous)
              }
            />

            {/* Confirm password */}
            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              placeholder="Re-enter your new password"
              showPassword={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword((previous) => !previous)
              }
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 px-5 py-4 border-t border-border bg-surface-soft/50 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 border rounded-lg sm:w-auto border-border text-text hover:bg-surface hover:border-border-hover"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg sm:w-auto bg-primary text-white hover:bg-primary-hover"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  showPassword,
  onToggleVisibility,
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-text">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full px-3 text-sm transition-colors duration-200 border rounded-lg outline-none h-11 pr-11 border-border bg-surface text-text placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 -translate-y-1/2 rounded-md right-2 top-1/2 text-text-secondary hover:bg-surface-soft hover:text-text"
        >
          {showPassword ? (
            <EyeOff size={17} strokeWidth={2} />
          ) : (
            <Eye size={17} strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
}

export default ChangePasswordDialog;
