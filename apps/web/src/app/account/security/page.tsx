"use client";

import { FormEvent, useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { profileService, type UserProfile, type UserSessionDto } from "@modules/profile/profile.service";

export default function AccountSecurityPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    profileService.getProfile().then(setProfile).catch(() => undefined);
    profileService.getSessions().then(setSessions).catch(() => undefined);
  }, []);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await profileService.updatePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setStatus("Mot de passe modifie.");
  }

  async function logoutAll() {
    await profileService.logoutAll();
    setStatus("Tous les appareils ont ete deconnectes.");
  }

  return (
    <ERPLayout title="Securite" subtitle="Mot de passe, 2FA, dernieres connexions et controle des appareils." action="Security">
      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-night">Mot de passe</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Derniere modification: {profile?.passwordChangedAt ? new Date(profile.passwordChangedAt).toLocaleString() : "Non disponible"}
            </p>
            <form onSubmit={changePassword} className="mt-5 space-y-4">
              <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Mot de passe actuel" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]" />
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nouveau mot de passe" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]" />
              <button className="rounded-2xl bg-[#1E2A38] px-5 py-3 font-black text-white">Changer le mot de passe</button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-night">Authentification a deux facteurs</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Statut: desactivee</p>
            <button className="mt-5 rounded-2xl bg-[#00C2A9]/10 px-5 py-3 font-black text-[#008f7d]">
              Activer le 2FA
            </button>
          </section>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">Sessions actives</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Derniere connexion: {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "Non disponible"}
          </p>
          <div className="mt-5 space-y-3">
            {sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black text-night">{session.deviceName ?? "Appareil"} · {session.ipAddress ?? "IP inconnue"}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">{session.userAgent ?? "Navigateur inconnu"}</p>
              </div>
            ))}
          </div>
          <button onClick={logoutAll} className="mt-5 rounded-2xl bg-red-50 px-5 py-3 font-black text-red-700">
            Deconnecter tous les appareils
          </button>
          {status && <p className="mt-4 font-bold text-[#00A693]">{status}</p>}
        </section>
      </section>
    </ERPLayout>
  );
}
