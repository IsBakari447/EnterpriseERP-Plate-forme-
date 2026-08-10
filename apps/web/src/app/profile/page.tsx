"use client";

import { FormEvent, useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { profileService, type UserProfile } from "@modules/profile/profile.service";
import { useI18n } from "@shared/i18n/I18nProvider";

const emptyProfile: UserProfile = {
  id: "",
  name: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  department: "",
  avatarUrl: "",
  language: "fr",
  timezone: "Europe/Stockholm",
  theme: "system",
  displayCurrency: "EUR",
  notificationEmail: true,
  notificationErp: true,
  notificationImportant: true,
  signature: "",
  role: "",
  status: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile);
  const [saved, setSaved] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    profileService.getProfile().then(setProfile).catch(() => undefined);
  }, []);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = await profileService.updateProfile(profile);
    setProfile(next);
    setSaved(true);
  }

  return (
    <ERPLayout title={t("account.profile")} subtitle={t("profile.subtitle")} action={t("account.profile")}>
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[.7fr_1.3fr]">
        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("profile.photo")}</h2>
          <div className="mt-6 flex flex-col items-center rounded-3xl bg-slate-50 p-6">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-[#1E2A38] text-4xl font-black text-white">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" /> : (profile.name || "U").slice(0, 2).toUpperCase()}
            </div>
            <label className="mt-5 w-full">
              <span className="text-sm font-black text-slate-700">{t("profile.avatarUrl")}</span>
              <input
                value={profile.avatarUrl ?? ""}
                onChange={(event) => update("avatarUrl", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#00C2A9]"
                placeholder="https://storage.example/avatar.png"
              />
            </label>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => profile.avatarUrl && profileService.updateAvatar(profile.avatarUrl)} className="rounded-xl bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
                {t("profile.changePhoto")}
              </button>
              <button type="button" onClick={() => { update("avatarUrl", ""); profileService.deleteAvatar().catch(() => undefined); }} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                {t("profile.removePhoto")}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-night">{t("profile.personalInfo")}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["firstName", t("profile.firstName")],
                ["lastName", t("profile.lastName")],
                ["email", t("profile.email")],
                ["phone", t("profile.phone")],
                ["jobTitle", t("profile.jobTitle")],
                ["department", t("profile.department")],
              ].map(([key, label]) => (
                <label key={key}>
                  <span className="text-sm font-black text-slate-700">{label}</span>
                  <input
                    value={String(profile[key as keyof UserProfile] ?? "")}
                    disabled={key === "email"}
                    onChange={(event) => update(key as keyof UserProfile, event.target.value as never)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9] disabled:text-slate-400"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-night">{t("account.preferences")}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Select label={t("language.label")} value={profile.language} onChange={(value) => update("language", value)} options={["fr", "en", "sv"]} />
              <Select label={t("profile.timezone")} value={profile.timezone} onChange={(value) => update("timezone", value)} options={["Europe/Stockholm", "Europe/Paris", "UTC", "Africa/Kinshasa"]} />
              <Select label={t("profile.displayCurrency")} value={profile.displayCurrency} onChange={(value) => update("displayCurrency", value)} options={["EUR", "USD", "SEK", "CDF"]} />
              <Select label={t("profile.theme")} value={profile.theme} onChange={(value) => update("theme", value)} options={["system", "light", "dark"]} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-night">{t("profile.notifications")}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Toggle label={t("profile.email")} checked={profile.notificationEmail} onChange={(value) => update("notificationEmail", value)} />
              <Toggle label={t("profile.erpNotifications")} checked={profile.notificationErp} onChange={(value) => update("notificationErp", value)} />
              <Toggle label={t("profile.importantAlerts")} checked={profile.notificationImportant} onChange={(value) => update("notificationImportant", value)} />
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-black text-slate-700">{t("profile.signature")}</span>
              <textarea value={profile.signature ?? ""} onChange={(event) => update("signature", event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]" />
            </label>
          </div>

          <button className="rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20">
            {t("profile.saveChanges")}
          </button>
          {saved && <span className="ml-3 font-bold text-[#00A693]">{t("profile.saved")}</span>}
        </section>
      </form>
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
