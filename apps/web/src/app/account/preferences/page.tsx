"use client";

import { useEffect, useMemo, useState } from "react";
import {
  countryOptions,
  currencyOptions,
  getCountryPack,
  type CountryCode,
} from "@config/country-packs";
import { companyService, type CompanyDto } from "@modules/company/services/company.service";
import { profileService, type UserProfile } from "@modules/profile/profile.service";
import ERPLayout from "@shared/components/layout/ERPLayout";
import { localeLabels, locales, type Locale } from "@shared/i18n/dictionaries";
import { useI18n } from "@shared/i18n/I18nProvider";
import { useSector } from "@shared/sector/SectorProvider";

type PreferenceState = {
  country: CountryCode;
  language: Locale;
  timezone: string;
  displayCurrency: string;
  dateFormat: string;
  numberFormat: string;
  theme: string;
  notificationEmail: boolean;
  notificationErp: boolean;
  notificationImportant: boolean;
};

const defaultPack = getCountryPack("SE");

function isCountryCode(value: string | null | undefined): value is CountryCode {
  return countryOptions.some((country) => country.code === value);
}

function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

function buildPreferences(profile: UserProfile | null, company: CompanyDto | null): PreferenceState {
  const country = isCountryCode(company?.country ?? profile?.company?.country)
    ? ((company?.country ?? profile?.company?.country) as CountryCode)
    : defaultPack.code;
  const pack = getCountryPack(country);
  const companyLanguage = company?.language ?? profile?.company?.language;
  const profileLanguage = profile?.language;

  return {
    country,
    language: isLocale(profileLanguage) ? profileLanguage : isLocale(companyLanguage) ? companyLanguage : (pack.language as Locale),
    timezone: profile?.timezone ?? company?.timezone ?? profile?.company?.timezone ?? pack.timezone,
    displayCurrency: profile?.displayCurrency ?? company?.currency ?? profile?.company?.currency ?? pack.currency,
    dateFormat: company?.dateFormat ?? profile?.company?.dateFormat ?? pack.dateFormat,
    numberFormat: company?.numberFormat ?? profile?.company?.numberFormat ?? pack.numberFormat,
    theme: profile?.theme ?? "system",
    notificationEmail: profile?.notificationEmail ?? true,
    notificationErp: profile?.notificationErp ?? true,
    notificationImportant: profile?.notificationImportant ?? true,
  };
}

export default function PreferencesPage() {
  const { t, setLocale } = useI18n();
  const { refreshCompany } = useSector();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [preferences, setPreferences] = useState<PreferenceState>(() => buildPreferences(null, null));
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const timezoneOptions = useMemo(
    () => Array.from(new Set(countryOptions.map((country) => country.timezone))),
    []
  );
  const dateFormatOptions = useMemo(
    () => Array.from(new Set(countryOptions.map((country) => country.dateFormat))),
    []
  );
  const numberFormatOptions = useMemo(
    () => Array.from(new Set(countryOptions.map((country) => country.numberFormat))),
    []
  );

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      setLoading(true);
      setError("");

      try {
        const [nextProfile, nextCompany] = await Promise.all([
          profileService.getProfile(),
          companyService.getCurrent(),
        ]);

        if (!active) return;

        setProfile(nextProfile);
        setCompany(nextCompany);
        setPreferences(buildPreferences(nextProfile, nextCompany));
      } catch {
        if (active) {
          setError(t("sector.companyLoadError"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPreferences();

    return () => {
      active = false;
    };
  }, [t]);

  function update<K extends keyof PreferenceState>(key: K, value: PreferenceState[K]) {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: value }));
  }

  function changeCountry(country: CountryCode) {
    const pack = getCountryPack(country);

    setSaved(false);
    setPreferences((current) => ({
      ...current,
      country,
      language: isLocale(pack.language) ? pack.language : current.language,
      timezone: pack.timezone,
      displayCurrency: pack.currency,
      dateFormat: pack.dateFormat,
      numberFormat: pack.numberFormat,
    }));
  }

  async function save() {
    if (!profile || !company) return;

    setError("");

    try {
      const [nextCompany, nextProfile] = await Promise.all([
        companyService.update({
          country: preferences.country,
          currency: preferences.displayCurrency,
          language: preferences.language,
          timezone: preferences.timezone,
          dateFormat: preferences.dateFormat,
          numberFormat: preferences.numberFormat,
        }),
        profileService.updateProfile({
          language: preferences.language,
          timezone: preferences.timezone,
          displayCurrency: preferences.displayCurrency,
          theme: preferences.theme,
          notificationEmail: preferences.notificationEmail,
          notificationErp: preferences.notificationErp,
          notificationImportant: preferences.notificationImportant,
        }),
      ]);

      setCompany(nextCompany);
      setProfile(nextProfile);
      setPreferences(buildPreferences(nextProfile, nextCompany));
      setLocale(preferences.language);
      await refreshCompany();
      setSaved(true);
    } catch {
      setError(t("profile.preferencesError"));
    }
  }

  return (
    <ERPLayout title={t("account.preferences")} subtitle={t("profile.preferencesSubtitle")} action={t("account.preferences")}>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("profile.display")}</h2>
          <div className="mt-5 grid gap-4">
            <Select
              label={t("onboarding.country")}
              value={preferences.country}
              options={countryOptions.map((country) => ({
                value: country.code,
                label: `${t(`country.${country.code}`)} - ${country.currency}`,
              }))}
              onChange={(value) => changeCountry(value as CountryCode)}
            />
            <Select
              label={t("language.label")}
              value={preferences.language}
              options={locales.map((locale) => ({ value: locale, label: localeLabels[locale] }))}
              onChange={(value) => update("language", value as Locale)}
            />
            <Select
              label={t("profile.timezone")}
              value={preferences.timezone}
              options={timezoneOptions.map((timezone) => ({ value: timezone, label: timezone }))}
              onChange={(value) => update("timezone", value)}
            />
            <Select
              label={t("profile.displayCurrency")}
              value={preferences.displayCurrency}
              options={currencyOptions.map((currency) => ({ value: currency, label: currency }))}
              onChange={(value) => update("displayCurrency", value)}
            />
            <Select
              label={t("onboarding.dateFormat")}
              value={preferences.dateFormat}
              options={dateFormatOptions.map((format) => ({ value: format, label: format }))}
              onChange={(value) => update("dateFormat", value)}
            />
            <Select
              label={t("onboarding.numberFormat")}
              value={preferences.numberFormat}
              options={numberFormatOptions.map((format) => ({ value: format, label: format }))}
              onChange={(value) => update("numberFormat", value)}
            />
            <Select
              label={t("profile.theme")}
              value={preferences.theme}
              options={["system", "light", "dark"].map((theme) => ({ value: theme, label: theme }))}
              onChange={(value) => update("theme", value)}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-2xl font-black text-night">{t("profile.notifications")}</h2>
          <div className="mt-5 space-y-3">
            <Toggle label={t("profile.email")} checked={preferences.notificationEmail} onChange={(value) => update("notificationEmail", value)} />
            <Toggle label={t("profile.erpNotifications")} checked={preferences.notificationErp} onChange={(value) => update("notificationErp", value)} />
            <Toggle label={t("profile.importantAlerts")} checked={preferences.notificationImportant} onChange={(value) => update("notificationImportant", value)} />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={loading || !profile || !company}
            className="mt-6 rounded-2xl bg-[#FF7A00] px-6 py-3 font-black text-white disabled:opacity-60"
          >
            {loading ? t("common.loading") : t("common.save")}
          </button>
          {saved && <span className="ml-3 font-bold text-[#00A693]">{t("profile.preferencesSaved")}</span>}
        </div>
      </section>
    </ERPLayout>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#00C2A9]">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5" />
    </label>
  );
}
