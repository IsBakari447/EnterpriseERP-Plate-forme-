"use client";

import Badge from "./Badge";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateFixedLabel } from "@shared/i18n/fixed-labels";

export type AlertItem = {
  title: string;
  description: string;
  level?: "info" | "warning" | "critical";
};

export default function AlertPanel({
  title = "Alertes",
  alerts,
}: {
  title?: string;
  alerts: AlertItem[];
}) {
  const { locale } = useI18n();
  const tFixed = (value: string) => translateFixedLabel(value, locale);
  const colorByLevel = {
    info: "cyan",
    warning: "yellow",
    critical: "red",
  } as const;

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <h2 className="text-xl font-black text-night">{tFixed(title)}</h2>
      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <article key={alert.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-night">{tFixed(alert.title)}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{tFixed(alert.description)}</p>
              </div>
              <Badge color={colorByLevel[alert.level ?? "info"]}>
                {tFixed(alert.level ?? "info")}
              </Badge>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
