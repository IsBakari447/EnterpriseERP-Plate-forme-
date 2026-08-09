"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { profileService, type UserProfile } from "@modules/profile/profile.service";

export default function PreferencesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    profileService.getProfile().then(setProfile).catch(() => undefined);
  }, []);

  async function save() {
    if (!profile) return;
    setProfile(await profileService.updateProfile(profile));
    setSaved(true);
  }

  return (
    <ERPLayout title="Preferences" subtitle="Langue, fuseau horaire, devise, theme et notifications personnelles." action="Preferences">
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">Affichage</h2>
          <div className="mt-5 grid gap-4">
            <Select label="Langue" value={profile?.language ?? "fr"} options={["fr", "en", "sv"]} onChange={(value) => setProfile((p) => p && { ...p, language: value })} />
            <Select label="Fuseau horaire" value={profile?.timezone ?? "Europe/Stockholm"} options={["Europe/Stockholm", "Europe/Paris", "UTC", "Africa/Kinshasa"]} onChange={(value) => setProfile((p) => p && { ...p, timezone: value })} />
            <Select label="Devise d'affichage" value={profile?.displayCurrency ?? "EUR"} options={["EUR", "USD", "SEK", "CDF"]} onChange={(value) => setProfile((p) => p && { ...p, displayCurrency: value })} />
            <Select label="Theme" value={profile?.theme ?? "system"} options={["system", "light", "dark"]} onChange={(value) => setProfile((p) => p && { ...p, theme: value })} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">Notifications</h2>
          <div className="mt-5 space-y-3">
            <Toggle label="Email" checked={profile?.notificationEmail ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationEmail: value })} />
            <Toggle label="Notifications ERP" checked={profile?.notificationErp ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationErp: value })} />
            <Toggle label="Alertes importantes" checked={profile?.notificationImportant ?? true} onChange={(value) => setProfile((p) => p && { ...p, notificationImportant: value })} />
          </div>
          <button onClick={save} className="mt-6 rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white">Enregistrer</button>
          {saved && <span className="ml-3 font-bold text-[#00A693]">Preferences enregistrees.</span>}
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
