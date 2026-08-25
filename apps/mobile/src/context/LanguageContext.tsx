import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { type Locale, translate, type TranslationKey } from "@/i18n";

type LanguageContextValue = {
  locale: Locale;
  ready: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const STORAGE_KEY = "enterpriseerp.locale";
const Context = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === "fr" || saved === "en" || saved === "sv") {
          setLocaleState(saved);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setLocale = async (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    await AsyncStorage.setItem(STORAGE_KEY, nextLocale);
  };

  const value = useMemo(
    () => ({
      locale,
      ready,
      setLocale,
      t: (key: TranslationKey) => translate(locale, key),
    }),
    [locale, ready],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLanguage() {
  const value = useContext(Context);

  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return value;
}
