import { Injectable } from "@nestjs/common";
import i18next, { type i18n } from "i18next";
import {
  apiLocaleLabels,
  apiLocales,
  apiTranslations,
  defaultApiLocale,
  type ApiLocale,
} from "./i18n.resources";

@Injectable()
export class I18nService {
  private readonly engine: i18n;

  constructor() {
    this.engine = i18next.createInstance();
    void this.engine.init({
      lng: defaultApiLocale,
      fallbackLng: defaultApiLocale,
      supportedLngs: apiLocales,
      keySeparator: false,
      resources: Object.fromEntries(
        apiLocales.map((locale) => [locale, { translation: apiTranslations[locale] }])
      ),
      interpolation: {
        escapeValue: false,
      },
    });
  }

  get languages() {
    return apiLocales.map((locale) => ({
      code: locale,
      label: apiLocaleLabels[locale],
    }));
  }

  normalize(value?: string): ApiLocale {
    const locale = value?.split(",")[0]?.trim().slice(0, 2).toLowerCase();
    return apiLocales.includes(locale as ApiLocale) ? (locale as ApiLocale) : defaultApiLocale;
  }

  resources(locale: string) {
    const normalized = this.normalize(locale);

    return {
      locale: normalized,
      translations: apiTranslations[normalized],
    };
  }

  t(key: string, locale?: string) {
    return this.engine.t(key, { lng: this.normalize(locale) });
  }
}
