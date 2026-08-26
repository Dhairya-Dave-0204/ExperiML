import { Trash2 } from "lucide-react";

function SettingsDangerZone() {
  return (
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
                Deactivate your ExperiML account and remove it from active use.
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
  );
}

export default SettingsDangerZone;
