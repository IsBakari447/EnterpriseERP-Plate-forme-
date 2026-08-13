"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";

import {
  defaultLocale,
  dictionaries,
  locales,
  type Locale,
} from "./dictionaries";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const resources = Object.fromEntries(
  locales.map((locale) => [locale, { translation: dictionaries[locale] }])
);

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });
}

function normalizeLocale(value: string | null | undefined): Locale {
  const short = value?.slice(0, 2).toLowerCase();
  return locales.includes(short as Locale) ? (short as Locale) : defaultLocale;
}

function I18nBridge({ children }: { children: ReactNode }) {
  const { t: translate } = useTranslation();
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem("enterpriseerp.locale");
    const browser = window.navigator.language;
    const nextLocale = normalizeLocale(stored ?? browser);
    setLocaleState(nextLocale);
    void i18next.changeLanguage(nextLocale);
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem("enterpriseerp.locale", nextLocale);
    document.documentElement.lang = nextLocale;
    void i18next.changeLanguage(nextLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translate(key),
    }),
    [locale, translate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18next}>
      <I18nBridge>{children}</I18nBridge>
    </I18nextProvider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
