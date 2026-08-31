import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";

function ChangePasswordDialog({ isOpen, onClose }) {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Close the dialog when the Escape key is pressed.
   */
  useEffect(() => {
    if (!isOpen || isSubmitting) {
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
  }, [isOpen, isSubmitting, onClose]);

  /**
   * Reset the form whenever the dialog is closed.
   */
  useEffect(() => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setErrors({});

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      setIsSubmitting(false);
    }
  }, [isOpen]);

  /**
   * Prevent rendering when the dialog is closed.
   */
  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event) {
    if (isSubmitting) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function validateForm() {
    const validationErrors = {};

    if (!currentPassword.trim()) {
      validationErrors.currentPassword = "Current password is required.";
    } else if (currentPassword.length > 128) {
      validationErrors.currentPassword =
        "Current password must not exceed 128 characters.";
    }

    if (!newPassword) {
      validationErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      validationErrors.newPassword =
        "Password must contain at least 8 characters.";
    } else if (newPassword.length > 20) {
      validationErrors.newPassword = "Password must not exceed 20 characters.";
    } else if (currentPassword === newPassword) {
      validationErrors.newPassword =
        "New password must be different from your current password.";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Password confirmation is required.";
    } else if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully.");

      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to change your password. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center h-screen p-6 z-100 bg-black/60 backdrop-blur-sm"
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
            disabled={isSubmitting}
            aria-label="Close change password dialog"
            className="inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-lg shrink-0 text-text-secondary hover:bg-surface-soft hover:text-text disabled:pointer-events-none disabled:opacity-50"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-5 py-5 space-y-5 sm:px-6">
            <PasswordField
              id="current-password"
              label="Current password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);

                if (errors.currentPassword) {
                  setErrors((previous) => ({
                    ...previous,
                    currentPassword: undefined,
                  }));
                }
              }}
              showPassword={showCurrentPassword}
              onToggleVisibility={() =>
                setShowCurrentPassword((previous) => !previous)
              }
              error={errors.currentPassword}
              disabled={isSubmitting}
            />

            <PasswordField
              id="new-password"
              label="New password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);

                if (errors.newPassword) {
                  setErrors((previous) => ({
                    ...previous,
                    newPassword: undefined,
                  }));
                }
              }}
              showPassword={showNewPassword}
              onToggleVisibility={() =>
                setShowNewPassword((previous) => !previous)
              }
              error={errors.newPassword}
              disabled={isSubmitting}
            />

            <PasswordField
              id="confirm-password"
              label="Confirm new password"
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);

                if (errors.confirmPassword) {
                  setErrors((previous) => ({
                    ...previous,
                    confirmPassword: undefined,
                  }));
                }
              }}
              showPassword={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword((previous) => !previous)
              }
              error={errors.confirmPassword}
              disabled={isSubmitting}
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 px-5 py-4 border-t border-border bg-surface-soft/50 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center bg-border/50 justify-center w-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 border rounded-lg sm:w-auto border-border text-text hover:bg-surface hover:border-border-hover disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg sm:w-auto bg-primary text-white hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-60"
            >
              {isSubmitting ? "Changing..." : "Change Password"}
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
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  error,
  disabled,
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
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full px-3 text-sm transition-colors duration-200 border rounded-lg outline-none h-11 pr-11 bg-surface text-text placeholder:text-text-secondary/60 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/10"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
          }`}
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 -translate-y-1/2 rounded-md right-2 top-1/2 text-text-secondary hover:bg-surface-soft hover:text-text disabled:pointer-events-none disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff size={17} strokeWidth={2} />
          ) : (
            <Eye size={17} strokeWidth={2} />
          )}
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default ChangePasswordDialog;
