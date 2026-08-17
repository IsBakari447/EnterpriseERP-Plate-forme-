"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "@shared/i18n/LanguageSwitcher";
import { useI18n } from "@shared/i18n/I18nProvider";

export default function AuthShell({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#1E2A38]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-6 py-8 lg:grid-cols-[1.02fr_.98fr] lg:px-10">
        <section className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#1E2A38] via-[#142235] to-[#00A990] p-8 text-white shadow-2xl lg:min-h-[720px] lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(0,194,169,.34),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,122,0,.2),transparent_28%)]" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xl">
                  <Image src="/enterpriseerp-icon.png" alt="EnterpriseERP" width={48} height={48} className="h-12 w-12 object-contain" priority />
                </span>
                <span>
                  <span className="block text-2xl font-black">EnterpriseERP</span>
                  <span className="text-xs font-bold uppercase tracking-[.18em] text-[#99f6e4]">{t("app.tagline")}</span>
                </span>
              </Link>
              <LanguageSwitcher compact />
            </div>

            <div className="my-auto py-14">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[#99f6e4]">
                {eyebrow}
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">
                {text}
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  [t("auth.valueDataIsolation"), t("auth.valueDataIsolationText")],
                  [t("auth.valueRoleAccess"), t("auth.valueRoleAccessText")],
                  [t("auth.valueSecureSessions"), t("auth.valueSecureSessionsText")],
                ].map(([label, detail]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="text-lg font-black">{label}</div>
                    <div className="mt-1 text-xs font-bold text-white/65">{detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0f172a]/70 p-5 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="font-black">{t("auth.commandCenter")}</div>
                  <p className="mt-1 text-sm text-white/65">{t("auth.commandCenterText")}</p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#1E2A38]">{t("auth.enterpriseReady")}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[34px] bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8 lg:p-10">
          {children}
        </section>
      </div>
    </main>
  );
}
