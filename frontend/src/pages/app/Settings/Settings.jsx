import { KeyRound, Trash2 } from "lucide-react";

import { SettingsAccount } from "@/components/components.index";

function Settings() {
  return (
    <main className="w-full max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight font-heading text-text">
          Settings
        </h1>

        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          Manage your account and security preferences.
        </p>
      </header>

      <div className="space-y-8">
        <SettingsAccount />

        {/* Security */}
        <section>
          <div className="mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-text-secondary">
              Security
            </h2>
          </div>

          <div className="border rounded-2xl border-border bg-surface">
            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-surface-soft text-text-secondary">
                  <KeyRound size={18} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text">Password</h3>

                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    Change your account password to keep your account secure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 border rounded-lg sm:w-auto border-border text-text hover:border-border-hover hover:bg-surface-soft"
              >
                Change Password
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <div className="mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-text-secondary">
              Danger Zone
            </h2>
          </div>

          <div className="border rounded-2xl border-border bg-surface">
            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-surface-soft text-text-secondary">
                  <Trash2 size={18} strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text">
                    Delete account
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    Deactivate your ExperiML account and remove it from active
                    use.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 border rounded-lg sm:w-auto border-border text-text hover:border-border-hover hover:bg-surface-soft"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfileRow({ icon: Icon, label, value, isLast = false }) {
  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 sm:px-6 ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      <Icon
        size={17}
        strokeWidth={2}
        className="shrink-0 text-text-secondary"
      />

      <div className="flex items-center justify-between w-full min-w-0 gap-4">
        <span className="text-sm text-text-secondary">{label}</span>

        <span className="text-sm font-medium text-right truncate text-text">
          {value}
        </span>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default Settings;
