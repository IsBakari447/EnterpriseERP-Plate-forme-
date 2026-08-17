"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@shared/i18n/I18nProvider";
import { translateContentText } from "@shared/i18n/content-labels";

type CheckState = "checking" | "online" | "degraded" | "offline";

type ServiceCheck = {
  id: string;
  name: string;
  description: string;
  url: string;
  state: CheckState;
  latency?: number;
  detail: string;
};

type PlatformStatus = {
  generatedAt?: string;
  services?: Array<{ name: string; status: string; detail?: string }>;
  incidents?: Array<{ title: string; status: string; date?: string }>;
  maintenance?: Array<{ title: string; status: string; window?: string }>;
};

function getDefaultApiBaseUrl() {
  if (typeof window !== "undefined" && window.location.hostname.includes("enterpriseerp-web.onrender.com")) {
    return "https://enterpriseerp-api.onrender.com/api";
  }

  return "http://localhost:4000/api";
}

function getStatusUrls() {
  const configuredApiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? getDefaultApiBaseUrl()).replace(/\/$/, "");
  const apiBaseUrl = configuredApiBaseUrl.endsWith("/api") ? configuredApiBaseUrl : `${configuredApiBaseUrl}/api`;
  const apiOriginUrl = apiBaseUrl.replace(/\/api\/?$/, "");

  return {
    apiBaseUrl,
    apiOriginUrl,
    healthUrl: `${apiOriginUrl}/health`,
    readinessUrl: `${apiOriginUrl}/health/ready`,
    platformStatusUrl: `${apiBaseUrl}/platform-status`,
  };
}

const baselineProductServices: NonNullable<PlatformStatus["services"]> = [
  { name: "Application Web", status: "available", detail: "Next.js frontend loaded" },
  { name: "API", status: "available", detail: "Health endpoint monitored" },
  { name: "PostgreSQL", status: "available", detail: "Readiness endpoint monitored" },
  { name: "Authentication", status: "beta", detail: "Dedicated auth status check required" },
  { name: "File Storage", status: "planned", detail: "Object storage integration planned" },
  { name: "AI Services", status: "beta", detail: "AI agents delivered progressively" },
];

const fallbackPlatformStatus: PlatformStatus = {
  services: baselineProductServices,
  incidents: [],
  maintenance: [],
};

function getInitialChecks(): ServiceCheck[] {
  const { healthUrl, readinessUrl, platformStatusUrl } = getStatusUrls();

  return [
    {
      id: "web",
      name: "Application web",
      description: "Disponibilite du frontend EnterpriseERP.",
      url: "/status",
      state: "checking",
      detail: "Verification en cours...",
    },
    {
      id: "health",
      name: "API principale",
      description: "Disponibilite du service backend EnterpriseERP.",
      url: healthUrl,
      state: "checking",
      detail: "Verification en cours...",
    },
    {
      id: "ready",
      name: "Base de donnees et dependances",
      description: "Controle de readiness incluant les dependances critiques.",
      url: readinessUrl,
      state: "checking",
      detail: "Verification en cours...",
    },
    {
      id: "platform",
      name: "Statut produit",
      description: "Source de verite des statuts Disponible, Beta et Prevu.",
      url: platformStatusUrl,
      state: "checking",
      detail: "Verification en cours...",
    },
  ];
}

function statusFromCheck(check: ServiceCheck | undefined): string {
  if (!check) return "beta";
  if (check.state === "online") return "available";
  if (check.state === "checking" || check.state === "degraded") return "beta";
  return "planned";
}

function buildProductServices(checks: ServiceCheck[]): NonNullable<PlatformStatus["services"]> {
  const web = checks.find((check) => check.id === "web");
  const health = checks.find((check) => check.id === "health");
  const ready = checks.find((check) => check.id === "ready");

  return [
    { ...baselineProductServices[0], status: statusFromCheck(web) },
    { ...baselineProductServices[1], status: statusFromCheck(health) },
    { ...baselineProductServices[2], status: statusFromCheck(ready) },
    baselineProductServices[3],
    baselineProductServices[4],
    baselineProductServices[5],
  ];
}

function normalizePlatformStatus(status: PlatformStatus | null | undefined, checks: ServiceCheck[]): PlatformStatus {
  return {
    ...fallbackPlatformStatus,
    ...(status ?? {}),
    services: buildProductServices(checks),
    incidents: status?.incidents ?? [],
    maintenance: status?.maintenance ?? [],
  };
}

function badgeClass(state: CheckState) {
  if (state === "online") return "bg-emerald-50 text-emerald-700";
  if (state === "degraded") return "bg-orange-50 text-orange-700";
  if (state === "offline") return "bg-red-50 text-red-700";
  return "bg-slate-100 text-slate-600";
}

function stateLabel(state: CheckState) {
  return {
    checking: "Verification",
    online: "Operationnel",
    degraded: "Degrade",
    offline: "Indisponible",
  }[state];
}

export default function StatusPage() {
  const { locale } = useI18n();
  const tx = (value: string) => translateContentText(value, locale);
  const [checks, setChecks] = useState<ServiceCheck[]>(() => getInitialChecks());
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus>(fallbackPlatformStatus);

  async function runChecks() {
    const checksToRun = getInitialChecks();
    const { platformStatusUrl } = getStatusUrls();
    const results = await Promise.all(
      checksToRun.map(async (check) => {
        const startedAt = performance.now();

        if (check.id === "web") {
          return {
            ...check,
            latency: Math.round(performance.now() - startedAt),
            state: "online",
            detail: "Application web chargee.",
          } satisfies ServiceCheck;
        }

        try {
          const response = await axios.get(check.url, { timeout: 8000 });
          const latency = Math.round(performance.now() - startedAt);

          return {
            ...check,
            latency,
            state: latency > 1500 ? "degraded" : "online",
            detail: latency > 1500 ? "Service joignable, latence a surveiller." : "Service joignable.",
          } satisfies ServiceCheck;
        } catch {
          return {
            ...check,
            state: "offline",
            detail: "Endpoint non joignable depuis le navigateur.",
          } satisfies ServiceCheck;
        }
      })
    );

    setChecks(results);
    const platformCheck = results.find((check) => check.id === "platform");
    let platformPayload: PlatformStatus | null = null;

    if (platformCheck?.state !== "offline") {
      try {
        const response = await axios.get(platformStatusUrl, { timeout: 8000 });
        platformPayload = response.data;
      } catch {
        platformPayload = fallbackPlatformStatus;
      }
    }

    setPlatformStatus(normalizePlatformStatus(platformPayload, results));
    setLastUpdated(new Date().toLocaleString());
  }

  useEffect(() => {
    runChecks();
  }, []);

  const globalState = useMemo<CheckState>(() => {
    const remoteChecks = checks.filter((check) => check.id !== "web");
    if (remoteChecks.every((check) => check.state === "offline")) return "degraded";
    if (checks.some((check) => check.state === "offline")) return "degraded";
    if (checks.some((check) => check.state === "degraded" || check.state === "checking")) return "degraded";
    return "online";
  }, [checks]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
              {tx("Statut plateforme")}
            </span>
            <h1 className="mt-6 text-5xl font-black">{tx("Disponibilite EnterpriseERP Cloud.")}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {tx("Cette page verifie les endpoints de sante de l'API, la disponibilite des dependances et la latence observee.")}
            </p>
          </div>
          <button onClick={runChecks} className="rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20">
            {tx("Actualiser")}
          </button>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">{tx("Etat global")}</h2>
              <p className="mt-2 text-slate-500">{tx("Derniere verification")}: {lastUpdated || tx("en cours")}</p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-black ${badgeClass(globalState)}`}>
              {tx(stateLabel(globalState))}
            </span>
          </div>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {checks.map((item) => (
            <article key={item.id} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{tx(item.name)}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{tx(item.description)}</p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-black ${badgeClass(item.state)}`}>
                  {tx(stateLabel(item.state))}
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <p>{tx(item.detail)}</p>
                <p className="mt-2">Endpoint: {item.url}</p>
                <p className="mt-2">{tx("Latence")}: {item.latency ? `${item.latency} ms` : tx("non disponible")}</p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-xl font-black">{tx("Services produit")}</h2>
            <div className="mt-5 space-y-3">
              {(platformStatus?.services ?? []).map((service) => (
                <div key={service.name} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-black text-night">{service.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{tx(service.detail ?? "")}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    {tx(service.status)}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
            <h2 className="text-xl font-black">{tx("Incidents et maintenance")}</h2>
            <div className="mt-5 space-y-3">
              {(platformStatus?.incidents?.length ?? 0) === 0 && (
                <div className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">
                  {tx("Aucun incident ouvert.")}
                </div>
              )}
              {(platformStatus?.maintenance ?? []).map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-night">{tx(item.title)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{tx(item.window ?? "")}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
