import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

function DeleteAccountDialog({ isOpen, onClose }) {
  const { deleteAccount } = useAuth();

  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Close the dialog when the Escape key is pressed.
   */
  useEffect(() => {
    if (!isOpen || isDeleting) {
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
  }, [isOpen, isDeleting, onClose]);

  /**
   * Reset local state whenever the dialog is closed.
   */
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleBackdropClick(event) {
    if (isDeleting) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  async function handleDeleteAccount() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount();

      toast.success("Your account has been deleted.");

      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to delete your account. Please try again.";

      toast.error(message);

      setIsDeleting(false);
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
        aria-labelledby="delete-account-title"
        aria-describedby="delete-account-description"
        className="w-full max-w-md overflow-hidden border shadow-xl rounded-2xl border-border bg-surface"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 py-5 border-b border-border sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-error/10 text-error">
              <AlertTriangle size={19} strokeWidth={2} />
            </div>

            <div>
              <h2
                id="delete-account-title"
                className="text-base font-semibold text-text"
              >
                Delete account
              </h2>

              <p
                id="delete-account-description"
                className="mt-1 text-sm leading-relaxed text-text-secondary"
              >
                This action will deactivate your ExperiML account and sign you
                out.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close delete account dialog"
            className="inline-flex items-center justify-center w-8 h-8 transition-colors duration-200 rounded-lg shrink-0 text-text-secondary hover:bg-surface-soft hover:text-text disabled:pointer-events-none disabled:opacity-50"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Confirmation content */}
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3 p-4 border rounded-xl border-border bg-surface-soft">
            <Trash2
              size={18}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-text-secondary"
            />

            <p className="text-sm leading-relaxed text-text-secondary">
              Are you sure you want to delete your account? You will be signed
              out and will no longer be able to access your ExperiML account.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 px-5 py-4 border-t border-border bg-surface-soft/50 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="inline-flex items-center bg-border/50 justify-center w-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 border rounded-lg sm:w-auto border-border text-text hover:bg-surface hover:border-border-hover disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 rounded-lg sm:w-auto bg-error text-white hover:bg-error/80 disabled:pointer-events-none disabled:opacity-60"
          >
            <Trash2 size={16} strokeWidth={2} />

            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountDialog;
