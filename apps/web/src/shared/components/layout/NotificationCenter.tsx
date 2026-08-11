"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";

const tasks = [
  { key: "overdueInvoices", href: "/facturation", tone: "red" },
  { key: "roleApprovals", href: "/modules/roles-permissions", tone: "orange" },
  { key: "lowStock", href: "/stock", tone: "cyan" },
  { key: "integrationError", href: "/status", tone: "orange" },
  { key: "securityAlert", href: "/security-center", tone: "red" },
];

function toneClass(tone: string) {
  if (tone === "red") return "bg-red-50 text-red-700";
  if (tone === "orange") return "bg-orange-50 text-orange-700";
  return "bg-cyan-50 text-cyan-700";
}

export default function NotificationCenter() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-black text-night shadow ring-1 ring-slate-200 transition hover:ring-[#00C2A9]"
        aria-label={t("notifications.title")}
      >
        NO
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-black text-white">
          {tasks.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(92vw,420px)] rounded-3xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-night">{t("notifications.title")}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{t("notifications.subtitle")}</p>
            </div>
            <Link href="/modules/notifications" onClick={() => setOpen(false)} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">
              {t("notifications.viewAll")}
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.key}
                href={task.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#00C2A9] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-night">{t(`notifications.${task.key}.title`)}</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{t(`notifications.${task.key}.text`)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${toneClass(task.tone)}`}>
                    {t(`notifications.${task.key}.badge`)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
