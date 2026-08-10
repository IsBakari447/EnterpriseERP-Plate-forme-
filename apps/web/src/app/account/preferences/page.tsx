"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { profileService, type UserProfile } from "@modules/profile/profile.service";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function PreferencesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    profileService.getProfile().then(setProfile).catch(() => undefined);
  }, []);

  async function save() {
    if (!profile) return;
    setProfile(await profileService.updateProfile(profile));
    setSaved(true);
  }

  return (
    <ERPLayout title={t("account.preferences")} subtitle={t("profile.preferencesSubtitle")} action={t("account.preferences")}>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("profile.display")}</h2>
          <div className="mt-5 grid gap-4">
            <Select label={t("language.label")} value={profile?.language ?? "fr"} options={["fr", "en", "sv"]} onChange={(value) => setProfile((p) => p && { ...p, language: value })} />
            <Select label={t("profile.timezone")} value={profile?.timezone ?? "Europe/Stockholm"} options={["Europe/Stockholm", "Europe/Paris", "UTC", "Africa/Kinshasa"]} onChange={(value) => setProfile((p) => p && { ...p, timezone: value })} />
            <Select label={t("profile.displayCurrency")} value={profile?.displayCurrency ?? "EUR"} options={["EUR", "USD", "SEK", "CDF"]} onChange={(value) => setProfile((p) => p && { ...p, displayCurrency: value })} />
            <Select label={t("profile.theme")} value={profile?.theme ?? "system"} options={["system", "light", "dark"]} onChange={(value) => setProfile((p) => p && { ...p, theme: value })} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("profile.notifications")}</h2>
          <div className="mt-5 space-y-3">
            <Toggle label={t("profile.email")} checked={profile?.notificationEmail ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationEmail: value })} />
            <Toggle label={t("profile.erpNotifications")} checked={profile?.notificationErp ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationErp: value })} />
            <Toggle label={t("profile.importantAlerts")} checked={profile?.notificationImportant ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationImportant: value })} />
          </div>
          <button onClick={save} className="mt-6 rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white">{t("common.save")}</button>
          {saved && <span className="ml-3 font-bold text-[#00A693]">{t("profile.preferencesSaved")}</span>}
        </div>
      </section>
    </ERPLayout>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" />
    </label>
  );
}
