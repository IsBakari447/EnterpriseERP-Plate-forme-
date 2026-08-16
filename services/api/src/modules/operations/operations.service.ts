import { Injectable } from "@nestjs/common";

@Injectable()
export class OperationsService {
  getSalesKpis() {
    return [
      { label: "Ventes du mois", value: "86 450 EUR", change: "+16%" },
      { label: "Commandes", value: "342", change: "+9%" },
      { label: "Panier moyen", value: "253 EUR", change: "+5%" },
      { label: "Conversion", value: "34%", change: "+3%" },
    ];
  }

  getOrders() {
    return [
      { number: "CMD-2026-001", customer: "Kamyla Group", amount: "12 400 EUR", date: "09/07/2026", status: "Confirmee" },
      { number: "CMD-2026-002", customer: "Nordic Retail AB", amount: "8 900 EUR", date: "08/07/2026", status: "En preparation" },
      { number: "CMD-2026-003", customer: "Nova Services", amount: "4 300 EUR", date: "07/07/2026", status: "Livree" },
    ];
  }

  getHrKpis() {
    return [
      { label: "Employes", value: "48" },
      { label: "Presents", value: "42" },
      { label: "Conges", value: "6" },
      { label: "Masse salariale", value: "186 400 EUR" },
    ];
  }

  getEmployees() {
    return [
      { name: "Amina Diallo", role: "Responsable ventes", contract: "CDI", status: "Present" },
      { name: "Lucas Martin", role: "Comptable", contract: "CDI", status: "Conge" },
      { name: "Sara Lindstrom", role: "Support client", contract: "CDD", status: "Present" },
    ];
  }

  getAssistantKpis() {
    return [
      { labelKey: "ai.kpi.analyses", value: "248", change: "+32%" },
      { labelKey: "ai.kpi.alerts", value: "18" },
      { labelKey: "ai.kpi.reports", value: "7" },
      { labelKey: "ai.kpi.savedTime", value: "42 h" },
    ];
  }

  getAssistantSuggestions() {
    return [
      { key: "ai.suggestion.sales" },
      { key: "ai.suggestion.followups" },
      { key: "ai.suggestion.finance" },
      { key: "ai.suggestion.lowStock" },
    ];
  }

  createAssistantAnswer(question: string, locale = "fr") {
    const normalizedQuestion = question.trim();
    const safeQuestion = normalizedQuestion.length > 0 ? normalizedQuestion : "";

    if (locale === "en") {
      return {
        question: normalizedQuestion,
        answer: safeQuestion
          ? `EnterpriseERP analysis: prioritize actions related to "${safeQuestion}", review recent data and assign a responsible follow-up.`
          : "EnterpriseERP analysis: ask a question to receive an operational recommendation.",
      };
    }

    if (locale === "sv") {
      return {
        question: normalizedQuestion,
        answer: safeQuestion
          ? `EnterpriseERP-analys: prioritera atgarder kopplade till "${safeQuestion}", granska senaste data och tilldela ansvarig uppfoljning.`
          : "EnterpriseERP-analys: stall en fraga for att fa en operativ rekommendation.",
      };
    }

    return {
      question: normalizedQuestion,
      answer:
        safeQuestion.length > 0
          ? `Analyse EnterpriseERP: priorisez les actions liees a "${safeQuestion}", verifiez les donnees recentes et planifiez un suivi responsable.`
          : "Analyse EnterpriseERP: posez une question pour obtenir une recommandation operationnelle.",
    };
  }

  getSettingsSummary() {
    return {
      kpis: [
        { labelKey: "settings.kpi.users", value: "24" },
        { labelKey: "settings.kpi.roles", value: "6" },
        { labelKey: "settings.kpi.languages", value: "8" },
        { labelKey: "settings.kpi.security", value: "2FA", changeKey: "settings.kpi.securityActive" },
      ],
      security: {
        twoFactor: true,
        audit: true,
        backups: "daily",
      },
    };
  }
}
