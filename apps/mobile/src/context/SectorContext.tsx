import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sectors } from "@/config/sectors";
import type { SectorDefinition, SectorKey } from "@/types/sector";

type Value = { sectorKey: SectorKey; sector: SectorDefinition; ready: boolean; setSector: (key: SectorKey) => Promise<void> };
const Context = createContext<Value | null>(null);

export function SectorProvider({ children }: { children: ReactNode }) {
  const [sectorKey, setKey] = useState<SectorKey>("general");
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem("enterpriseerp.sector").then((saved) => {
    if (saved && saved in sectors) setKey(saved as SectorKey);
  }).finally(() => setReady(true)); }, []);
  const setSector = async (key: SectorKey) => { setKey(key); await AsyncStorage.setItem("enterpriseerp.sector", key); };
  const value = useMemo(() => ({ sectorKey, sector: sectors[sectorKey], ready, setSector }), [sectorKey, ready]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSector() {
  const value = useContext(Context);
  if (!value) throw new Error("useSector doit être utilisé dans SectorProvider");
  return value;
}
