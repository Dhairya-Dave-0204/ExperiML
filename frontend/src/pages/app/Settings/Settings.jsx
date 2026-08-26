import {
  CalendarDays,
  KeyRound,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

function Settings() {
  const { user } = useAuth();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const accountStatus = user?.accountStatus
    ? user.accountStatus.charAt(0) + user.accountStatus.slice(1).toLowerCase()
    : "—";

  const initials = getInitials(fullName || user?.email);

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
        {/* Account */}
        <section>
          <div className="mb-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-text-secondary">
              Account
            </h2>
          </div>

          <div className="overflow-hidden border rounded-2xl border-border bg-surface">
            {/* Profile summary */}
            <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
              <div className="flex items-center justify-center w-12 h-12 text-sm font-semibold rounded-full shrink-0 bg-primary/10 text-primary">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold truncate text-text">
                  {fullName || "User"}
                </h3>

                <p className="mt-0.5 text-sm truncate text-text-secondary">
                  {user?.email || "—"}
                </p>
              </div>
            </div>

            <div className="border-t border-border">
              {/* Full name */}
              <ProfileRow
                icon={UserRound}
                label="Full name"
                value={fullName || "—"}
              />

              {/* Email */}
              <ProfileRow
                icon={UserRound}
                label="Email"
                value={user?.email || "—"}
              />

              {/* Joined */}
              <ProfileRow
                icon={CalendarDays}
                label="Joined"
                value={joinedDate}
              />

              {/* Account status */}
              <ProfileRow
                icon={ShieldCheck}
                label="Account status"
                value={
                  <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {accountStatus}
                  </span>
                }
                isLast
              />
            </div>
          </div>
        </section>

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
