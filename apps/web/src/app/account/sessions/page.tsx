"use client";

import { useEffect, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { profileService, type UserSessionDto } from "@modules/profile/profile.service";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

export default function SessionsPage() {
  const { locale } = useI18n();
  const tc = (value: string) => translateContentText(value, locale);
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);

  async function load() {
    const data = await profileService.getSessions();
    setSessions(data);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function revoke(id: string) {
    await profileService.revokeSession(id);
    await load();
  }

  return (
    <ERPLayout title={tc("Sessions et appareils")} subtitle={tc("Consultez les appareils connectes et revoquez les sessions inutiles.")} action={tc("Sessions")}>
      <section className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
        <div className="grid gap-4">
          {sessions.map((session) => (
            <article key={session.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-lg font-black text-night">{tc(session.deviceName ?? "EnterpriseERP Web")}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{tc(session.userAgent ?? "Navigateur inconnu")}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">IP {session.ipAddress ?? tc("inconnue")}</span>
                  <span className="rounded-full bg-white px-3 py-1">{tc("Creation")} {new Date(session.createdAt).toLocaleString()}</span>
                  <span className="rounded-full bg-white px-3 py-1">{session.revokedAt ? tc("Revoquee") : tc("Active")}</span>
                </div>
              </div>
              <button onClick={() => revoke(session.id)} disabled={Boolean(session.revokedAt)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 disabled:opacity-40">
                {tc("Deconnecter")}
              </button>
            </article>
          ))}
        </div>
      </section>
    </ERPLayout>
  );
}
