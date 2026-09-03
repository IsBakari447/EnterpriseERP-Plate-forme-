import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser, requireTenant } from "../auth/current-user.decorator";

type AiLocale = "fr" | "en" | "sv";
type AiIntent = "report" | "stock" | "sales" | "finance" | "hr" | "campaign" | "generic" | "blocked" | "empty";

type AiAnswer = {
  question: string;
  answer: string;
  intent: AiIntent;
  provider: "enterpriseerp-rule-engine";
  generatedBy: "EnterpriseERP AI";
};

type AiContext = {
  country: string | null;
  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  sector: string;
  businessType: string | null;
  enabledModules: string[];
};

const blockedPromptPatterns = [
  /ignore (all )?(previous|prior) instructions/i,
  /ignore les instructions/i,
  /system prompt/i,
  /developer message/i,
  /reveal.*secret/i,
  /show.*token/i,
  /dump.*database/i,
  /other tenant/i,
  /autre tenant/i,
  /cross[- ]tenant/i,
  /bypass/i,
];

@Injectable()
export class AiService {
  constructor(
    private readonly audit: AuditService,
    private readonly prisma: PrismaService
  ) {}

  async createAnswer(user: AuthenticatedUser, question: string, locale = "fr"): Promise<AiAnswer> {
    const companyId = requireTenant(user);
    const normalizedQuestion = question.trim();
    const language = this.normalizeLocale(locale);
    const intent = this.detectIntent(normalizedQuestion);
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        sector: true,
        businessType: true,
        country: true,
        currency: true,
        language: true,
        timezone: true,
        dateFormat: true,
        numberFormat: true,
        enabledModules: true,
      },
    });
    const context: AiContext = {
      country: company?.country ?? null,
      currency: company?.currency ?? "EUR",
      language: company?.language ?? language,
      timezone: company?.timezone ?? "Europe/Stockholm",
      dateFormat: company?.dateFormat ?? "yyyy-MM-dd",
      numberFormat: company?.numberFormat ?? "fr-FR",
      sector: company?.sector ?? "general",
      businessType: company?.businessType ?? null,
      enabledModules: company?.enabledModules ?? [],
    };
    const answer = this.buildAnswer(normalizedQuestion, language, intent, context);

    await this.audit.record({
      companyId,
      userId: user.sub,
      module: "ai",
      action: intent === "blocked" ? "ai.request.blocked" : "ai.request",
      entityType: "AIRequest",
      oldValue: {
        question: normalizedQuestion,
        locale: language,
        intent,
        context,
      },
      newValue: {
        answer,
        provider: "enterpriseerp-rule-engine",
        generatedBy: "EnterpriseERP AI",
      },
      result: intent === "blocked" ? "warning" : "success",
    });

    return {
      question: normalizedQuestion,
      answer,
      intent,
      provider: "enterpriseerp-rule-engine",
      generatedBy: "EnterpriseERP AI",
    };
  }

  private normalizeLocale(locale: string): AiLocale {
    if (locale === "en" || locale === "sv") return locale;
    return "fr";
  }

  private detectIntent(question: string): AiIntent {
    if (!question) return "empty";
    if (blockedPromptPatterns.some((pattern) => pattern.test(question))) return "blocked";

    const intent = question.toLowerCase();

    if (intent.includes("report") || intent.includes("rapport") || intent.includes("summary") || intent.includes("resume")) return "report";
    if (intent.includes("stock") || intent.includes("inventory") || intent.includes("lager") || intent.includes("rupture")) return "stock";
    if (intent.includes("vente") || intent.includes("sales") || intent.includes("devis") || intent.includes("prospect") || intent.includes("crm")) return "sales";
    if (intent.includes("finance") || intent.includes("invoice") || intent.includes("facture") || intent.includes("cash") || intent.includes("paiement")) return "finance";
    if (intent.includes("rh") || intent.includes("hr") || intent.includes("employee") || intent.includes("employe") || intent.includes("conge")) return "hr";
    if (intent.includes("canal") || intent.includes("channel") || intent.includes("email") || intent.includes("linkedin") || intent.includes("whatsapp")) return "campaign";

    return "generic";
  }

  private buildAnswer(question: string, locale: AiLocale, intent: AiIntent, context: AiContext) {
    const contextLine = this.buildContextLine(locale, context);
    const copy = {
      en: {
        empty: "EnterpriseERP analysis: ask a question to receive an operational recommendation.",
        blocked:
          "EnterpriseERP AI cannot process this request because it appears to ask for unsafe instructions, secrets or cross-tenant data. Please reformulate it as a business question.",
        report:
          "EnterpriseERP AI report: review revenue, overdue invoices, stock alerts and priority actions. Recommended next step: export the executive summary and assign owners to the open risks.",
        stock:
          "EnterpriseERP stock insight: check critical quantities, supplier lead times and products below threshold. Recommended action: prepare replenishment and update purchase priorities.",
        sales:
          "EnterpriseERP sales insight: focus on qualified opportunities, overdue quotes and high-value customers. Recommended action: schedule follow-ups and convert warm prospects first.",
        finance:
          "EnterpriseERP finance insight: compare incoming cash, overdue invoices, outgoing payments and forecast. Recommended action: secure collections before launching new spending.",
        hr:
          "EnterpriseERP HR insight: review attendance, leave, contracts and missing employee documents. Recommended action: notify managers and validate sensitive HR changes.",
        campaign:
          "EnterpriseERP AI campaign: generate a concise message linked to the selected channel, sector and prospect context. Recommended action: send it to CRM and plan the next follow-up.",
        generic: `EnterpriseERP analysis: prioritize actions related to "${question}", review recent data and assign a responsible follow-up.`,
      },
      sv: {
        empty: "EnterpriseERP-analys: stall en fraga for att fa en operativ rekommendation.",
        blocked:
          "EnterpriseERP AI kan inte behandla denna begaran eftersom den verkar be om osakra instruktioner, hemligheter eller data fran annan tenant. Formulera om den som en affarsfraga.",
        report:
          "EnterpriseERP AI-rapport: granska intakter, forfallna fakturor, lagervarningar och prioriterade atgarder. Nasta steg: exportera ledningssammanfattningen och tilldela ansvariga.",
        stock:
          "EnterpriseERP lagerinsikt: kontrollera kritiska kvantiteter, leverantorstider och artiklar under gransvarde. Rekommenderad atgard: forbered pafyllning och uppdatera inkopsprioriteringar.",
        sales:
          "EnterpriseERP saljinsikt: fokusera pa kvalificerade mojligheter, sena offerter och kunder med hogt varde. Rekommenderad atgard: planera uppfoljningar och konvertera varma prospekt forst.",
        finance:
          "EnterpriseERP finansinsikt: jamfor inkommande likviditet, forfallna fakturor, utbetalningar och prognos. Rekommenderad atgard: sakra betalningar innan nya kostnader startas.",
        hr:
          "EnterpriseERP HR-insikt: granska narvaro, ledighet, kontrakt och saknade personaldokument. Rekommenderad atgard: meddela ansvariga och validera kansliga HR-andringar.",
        campaign:
          "EnterpriseERP AI-kampanj: skapa ett kort meddelande kopplat till vald kanal, sektor och prospektkontext. Rekommenderad atgard: skicka till CRM och planera nasta uppfoljning.",
        generic: `EnterpriseERP-analys: prioritera atgarder kopplade till "${question}", granska senaste data och tilldela ansvarig uppfoljning.`,
      },
      fr: {
        empty: "Analyse EnterpriseERP: posez une question pour obtenir une recommandation operationnelle.",
        blocked:
          "EnterpriseERP AI ne peut pas traiter cette demande car elle semble viser des instructions sensibles, des secrets ou des donnees d'un autre tenant. Reformulez-la comme une question metier.",
        report:
          "Rapport IA EnterpriseERP: verifiez le chiffre d'affaires, les factures en retard, les alertes stock et les actions prioritaires. Prochaine action recommandee: exporter la synthese dirigeant et assigner les risques ouverts.",
        stock:
          "Insight stock EnterpriseERP: controlez les quantites critiques, les delais fournisseurs et les produits sous seuil. Action recommandee: preparer le reassort et mettre a jour les priorites d'achat.",
        sales:
          "Insight ventes EnterpriseERP: concentrez-vous sur les opportunites qualifiees, les devis en retard et les clients a forte valeur. Action recommandee: planifier les relances et convertir les prospects chauds en premier.",
        finance:
          "Insight finance EnterpriseERP: comparez encaissements attendus, factures en retard, paiements sortants et prevision. Action recommandee: securiser les relances avant de lancer de nouvelles depenses.",
        hr:
          "Insight RH EnterpriseERP: verifiez presences, conges, contrats et documents collaborateurs manquants. Action recommandee: notifier les responsables et valider les changements RH sensibles.",
        campaign:
          "Campagne IA EnterpriseERP: genere un message court adapte au canal, au secteur et au contexte prospect. Action recommandee: l'envoyer au CRM et planifier la prochaine relance.",
        generic: `Analyse EnterpriseERP: priorisez les actions liees a "${question}", verifiez les donnees recentes et planifiez un suivi responsable.`,
      },
    };

    return `${copy[locale][intent]} ${contextLine}`;
  }

  private buildContextLine(locale: AiLocale, context: AiContext) {
    const modules = context.enabledModules.slice(0, 5).join(", ");
    const businessType = context.businessType ? `, type ${context.businessType}` : "";

    if (locale === "en") {
      return `Context used: country ${context.country ?? "unset"}, currency ${context.currency}, timezone ${context.timezone}, sector ${context.sector}${businessType}${modules ? `, active modules ${modules}` : ""}.`;
    }

    if (locale === "sv") {
      return `Anvand kontext: land ${context.country ?? "ej valt"}, valuta ${context.currency}, tidszon ${context.timezone}, sektor ${context.sector}${businessType}${modules ? `, aktiva moduler ${modules}` : ""}.`;
    }

    return `Contexte utilise: pays ${context.country ?? "non defini"}, devise ${context.currency}, fuseau ${context.timezone}, secteur ${context.sector}${businessType}${modules ? `, modules actifs ${modules}` : ""}.`;
  }
}
