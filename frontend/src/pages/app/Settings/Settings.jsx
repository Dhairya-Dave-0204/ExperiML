import { SettingsAccount, SettingsSecurity, SettingsDangerZone } from "@/components/components.index";

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

        <SettingsSecurity />

        <SettingsDangerZone />
      </div>
    </main>
  );
}

export default Settings;
