import { Controller, Get, Headers, Param } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { I18nService } from "./i18n.service";

@Public()
@Controller("i18n")
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get("languages")
  languages() {
    return {
      defaultLocale: "fr",
      languages: this.i18n.languages,
    };
  }

  @Get("resources")
  currentResources(@Headers("accept-language") acceptLanguage?: string) {
    return this.i18n.resources(this.i18n.normalize(acceptLanguage));
  }

  @Get("resources/:locale")
  resources(@Param("locale") locale: string) {
    return this.i18n.resources(locale);
  }
}
