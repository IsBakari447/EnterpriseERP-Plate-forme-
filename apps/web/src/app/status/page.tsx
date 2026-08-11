"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { apiOriginUrl } from "@shared/api/client";

type CheckState = "checking" | "online" | "degraded" | "offline";

type ServiceCheck = {
  id: string;
  name: string;
  description: string;
  path: string;
  state: CheckState;
  latency?: number;
  detail: string;
};

const initialChecks: ServiceCheck[] = [
  {
    id: "health",
    name: "API principale",
    description: "Disponibilite du service backend EnterpriseERP.",
    path: "/health",
    state: "checking",
    detail: "Verification en cours...",
  },
  {
    id: "ready",
    name: "Base de donnees et dependances",
    description: "Controle de readiness incluant les dependances critiques.",
    path: "/health/ready",
    state: "checking",
    detail: "Verification en cours...",
  },
];

function badgeClass(state: CheckState) {
  if (state === "online") return "bg-emerald-50 text-emerald-700";
  if (state === "degraded") return "bg-orange-50 text-orange-700";
  if (state === "offline") return "bg-red-50 text-red-700";
  return "bg-slate-100 text-slate-600";
}

function label(state: CheckState) {
  return {
    checking: "Verification",
    online: "Operationnel",
    degraded: "Degrade",
    offline: "Indisponible",
  }[state];
}

export default function StatusPage() {
  const [checks, setChecks] = useState<ServiceCheck[]>(initialChecks);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  async function runChecks() {
    const results = await Promise.all(
      initialChecks.map(async (check) => {
        const startedAt = performance.now();

        try {
          await axios.get(`${apiOriginUrl}${check.path}`, { timeout: 8000 });
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
    setLastUpdated(new Date().toLocaleString());
  }

  useEffect(() => {
    runChecks();
  }, []);

  const globalState = useMemo<CheckState>(() => {
    if (checks.some((check) => check.state === "offline")) return "offline";
    if (checks.some((check) => check.state === "degraded" || check.state === "checking")) return "degraded";
    return "online";
  }, [checks]);

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-6 py-16 text-night lg:px-16">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
              Statut plateforme
            </span>
            <h1 className="mt-6 text-5xl font-black">Disponibilite EnterpriseERP Cloud.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Cette page verifie les endpoints de sante de l'API, la disponibilite des dependances et la latence observee.
            </p>
          </div>
          <button onClick={runChecks} className="rounded-2xl bg-[#FF7A00] px-6 py-4 font-black text-white shadow-lg shadow-orange-500/20">
            Actualiser
          </button>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-7 shadow ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Etat global</h2>
              <p className="mt-2 text-slate-500">Derniere verification: {lastUpdated || "en cours"}</p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-black ${badgeClass(globalState)}`}>
              {label(globalState)}
            </span>
          </div>
        </section>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {checks.map((item) => (
            <article key={item.id} className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{item.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{item.description}</p>
                </div>
                <span className={`rounded-full px-4 py-2 text-sm font-black ${badgeClass(item.state)}`}>
                  {label(item.state)}
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <p>{item.detail}</p>
                <p className="mt-2">Endpoint: {item.path}</p>
                <p className="mt-2">Latence: {item.latency ? `${item.latency} ms` : "non disponible"}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
