import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sectors } from "@/config/sectors";
import type { SectorDefinition, SectorKey } from "@/types/sector";

type Value = {
  sectorKey: SectorKey;
  sector: SectorDefinition;
  ready: boolean;
  hasStoredSector: boolean;
  setSector: (key: SectorKey) => Promise<void>;
  setAccountSector: (key: SectorKey) => void;
};
const Context = createContext<Value | null>(null);

export function SectorProvider({ children }: { children: ReactNode }) {
  const [sectorKey, setKey] = useState<SectorKey>("general");
  const [hasStoredSector, setHasStoredSector] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem("enterpriseerp.sector").then((saved) => {
    if (saved && saved in sectors) {
      setKey(saved as SectorKey);
      setHasStoredSector(true);
    }
  }).finally(() => setReady(true)); }, []);
  const setSector = useCallback(async (key: SectorKey) => {
    setKey(key);
    setHasStoredSector(true);
    await AsyncStorage.setItem("enterpriseerp.sector", key);
  }, []);
  const setAccountSector = useCallback((key: SectorKey) => {
    setKey(key);
  }, []);
  const value = useMemo(
    () => ({
      sectorKey,
      sector: sectors[sectorKey],
      ready,
      hasStoredSector,
      setSector,
      setAccountSector,
    }),
    [sectorKey, ready, hasStoredSector, setSector, setAccountSector],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSector() {
  const value = useContext(Context);
  if (!value) throw new Error("useSector doit être utilisé dans SectorProvider");
  return value;
}
