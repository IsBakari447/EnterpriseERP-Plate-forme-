"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { sectorDefinitions } from "@/config/sectors";
import { companyService } from "@modules/company/services/company.service";
import type {
  SectorDefinition,
  SectorKey,
} from "@shared/sector/types";

type SectorContextValue = {
  sectorKey: SectorKey;
  sector: SectorDefinition;
  loading: boolean;
  error: string;
  setSector: (sector: SectorKey) => Promise<void>;
};

const SectorContext = createContext<SectorContextValue | null>(null);
const STORAGE_KEY = "enterpriseerp-sector";

function isSectorKey(value: string | null | undefined): value is SectorKey {
  return Boolean(value && value in sectorDefinitions);
}

function readSavedSector(): SectorKey {
  if (typeof window === "undefined") return "general";

  const savedSector = window.localStorage.getItem(STORAGE_KEY);
  return isSectorKey(savedSector) ? savedSector : "general";
}

export function SectorProvider({ children }: { children: ReactNode }) {
  const [sectorKey, setSectorKey] = useState<SectorKey>("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompanySector() {
      setSectorKey(readSavedSector());
      setLoading(false);
      setError("");

      try {
        const company = await companyService.getCurrent();

        if (isSectorKey(company.sector)) {
          setSectorKey(company.sector);
          window.localStorage.setItem(STORAGE_KEY, company.sector);
          return;
        }
      } catch {
        // The web app must remain usable when the API is offline in development.
      }
    }

    loadCompanySector();
  }, []);

  async function setSector(nextSector: SectorKey) {
    setSectorKey(nextSector);
    window.localStorage.setItem(STORAGE_KEY, nextSector);
    setError("");

    try {
      await companyService.update({ sector: nextSector });
    } catch {
      // Keep the selected sector locally when the API/database is unavailable.
    }
  }

  const value = useMemo(
    () => ({
      sectorKey,
      sector: sectorDefinitions[sectorKey],
      loading,
      error,
      setSector,
    }),
    [sectorKey, loading, error]
  );

  return (
    <SectorContext.Provider value={value}>
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const context = useContext(SectorContext);

  if (!context) {
    throw new Error("useSector must be used inside SectorProvider.");
  }

  return context;
}
