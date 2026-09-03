export type CountryCode =
  | "SE"
  | "FR"
  | "DE"
  | "ES"
  | "CM"
  | "SN"
  | "CI"
  | "CA"
  | "US"
  | "GB"
  | "CH"
  | "JP"
  | "CD"
  | "BE";

export type CurrencyCode =
  | "EUR"
  | "SEK"
  | "USD"
  | "CAD"
  | "GBP"
  | "CHF"
  | "JPY"
  | "XAF"
  | "XOF"
  | "CDF";

export type CountryPack = {
  code: CountryCode;
  currency: CurrencyCode;
  locale: string;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
};

export const countryPacks: Record<CountryCode, CountryPack> = {
  SE: {
    code: "SE",
    currency: "SEK",
    locale: "sv-SE",
    language: "sv",
    timezone: "Europe/Stockholm",
    dateFormat: "yyyy-MM-dd",
    numberFormat: "sv-SE",
  },
  FR: {
    code: "FR",
    currency: "EUR",
    locale: "fr-FR",
    language: "fr",
    timezone: "Europe/Paris",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-FR",
  },
  DE: {
    code: "DE",
    currency: "EUR",
    locale: "de-DE",
    language: "de",
    timezone: "Europe/Berlin",
    dateFormat: "dd.MM.yyyy",
    numberFormat: "de-DE",
  },
  ES: {
    code: "ES",
    currency: "EUR",
    locale: "es-ES",
    language: "es",
    timezone: "Europe/Madrid",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "es-ES",
  },
  CM: {
    code: "CM",
    currency: "XAF",
    locale: "fr-CM",
    language: "fr",
    timezone: "Africa/Douala",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-CM",
  },
  SN: {
    code: "SN",
    currency: "XOF",
    locale: "fr-SN",
    language: "fr",
    timezone: "Africa/Dakar",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-SN",
  },
  CI: {
    code: "CI",
    currency: "XOF",
    locale: "fr-CI",
    language: "fr",
    timezone: "Africa/Abidjan",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-CI",
  },
  CA: {
    code: "CA",
    currency: "CAD",
    locale: "en-CA",
    language: "en",
    timezone: "America/Toronto",
    dateFormat: "yyyy-MM-dd",
    numberFormat: "en-CA",
  },
  US: {
    code: "US",
    currency: "USD",
    locale: "en-US",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    numberFormat: "en-US",
  },
  GB: {
    code: "GB",
    currency: "GBP",
    locale: "en-GB",
    language: "en",
    timezone: "Europe/London",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "en-GB",
  },
  CH: {
    code: "CH",
    currency: "CHF",
    locale: "de-CH",
    language: "de",
    timezone: "Europe/Zurich",
    dateFormat: "dd.MM.yyyy",
    numberFormat: "de-CH",
  },
  JP: {
    code: "JP",
    currency: "JPY",
    locale: "ja-JP",
    language: "en",
    timezone: "Asia/Tokyo",
    dateFormat: "yyyy/MM/dd",
    numberFormat: "ja-JP",
  },
  CD: {
    code: "CD",
    currency: "CDF",
    locale: "fr-CD",
    language: "fr",
    timezone: "Africa/Kinshasa",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-CD",
  },
  BE: {
    code: "BE",
    currency: "EUR",
    locale: "fr-BE",
    language: "fr",
    timezone: "Europe/Brussels",
    dateFormat: "dd/MM/yyyy",
    numberFormat: "fr-BE",
  },
};

export const countryOptions = Object.values(countryPacks);
export const currencyOptions: CurrencyCode[] = Array.from(
  new Set(countryOptions.map((country) => country.currency))
);

export function getCountryPack(country: string | null | undefined): CountryPack {
  return country && country in countryPacks
    ? countryPacks[country as CountryCode]
    : countryPacks.SE;
}
