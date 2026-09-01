import { Injectable } from "@nestjs/common";

type OperationKpi = {
  label: string;
  labelKey: string;
  value: string;
  change?: string;
  changeKey?: string;
};

type OperationItem = {
  id: string;
  title?: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  value?: string;
  meta?: string;
  metaKey?: string;
  status?: string;
  statusKey?: string;
  number?: string;
  customer?: string;
  amount?: string;
  date?: string;
  name?: string;
  role?: string;
  roleKey?: string;
  contract?: string;
};

@Injectable()
export class OperationsService {
  getSalesKpis(): OperationKpi[] {
    return [
      { label: "Ventes du mois", labelKey: "api.sales.kpi.monthlySales", value: "86 450 EUR", change: "+16%" },
      { label: "Commandes", labelKey: "api.sales.kpi.orders", value: "342", change: "+9%" },
      { label: "Panier moyen", labelKey: "api.sales.kpi.averageBasket", value: "253 EUR", change: "+5%" },
      { label: "Conversion", labelKey: "api.sales.kpi.conversion", value: "34%", change: "+3%" },
    ];
  }

  getOrders(): OperationItem[] {
    return [
      { id: "CMD-2026-001", number: "CMD-2026-001", title: "CMD-2026-001", customer: "Kamyla Group", subtitle: "Kamyla Group", amount: "12 400 EUR", value: "12 400 EUR", date: "09/07/2026", meta: "09/07/2026", status: "confirmed", statusKey: "status.confirmed" },
      { id: "CMD-2026-002", number: "CMD-2026-002", title: "CMD-2026-002", customer: "Nordic Retail AB", subtitle: "Nordic Retail AB", amount: "8 900 EUR", value: "8 900 EUR", date: "08/07/2026", meta: "08/07/2026", status: "preparing", statusKey: "status.preparing" },
      { id: "CMD-2026-003", number: "CMD-2026-003", title: "CMD-2026-003", customer: "Nova Services", subtitle: "Nova Services", amount: "4 300 EUR", value: "4 300 EUR", date: "07/07/2026", meta: "07/07/2026", status: "delivered", statusKey: "status.delivered" },
    ];
  }

  getReportsKpis(): OperationKpi[] {
    return [
      { label: "Vues enregistrees", labelKey: "api.reports.kpi.savedViews", value: "5", changeKey: "trend.month" },
      { label: "Exports", labelKey: "api.reports.kpi.exports", value: "18", changeKey: "common.export" },
      { label: "Rapports planifies", labelKey: "api.reports.kpi.scheduled", value: "7", changeKey: "trend.plan" },
      { label: "Insights IA", labelKey: "api.reports.kpi.insights", value: "12", changeKey: "trend.priority" },
    ];
  }

  getReportsItems(): OperationItem[] {
    return [
      { id: "report-1", titleKey: "api.reports.item.executive.title", subtitleKey: "api.reports.item.executive.subtitle", value: "PDF", statusKey: "status.ready" },
      { id: "report-2", titleKey: "api.reports.item.finance.title", subtitleKey: "api.reports.item.finance.subtitle", value: "Excel", statusKey: "status.scheduled" },
      { id: "report-3", titleKey: "api.reports.item.stock.title", subtitleKey: "api.reports.item.stock.subtitle", value: "BI", statusKey: "status.active" },
    ];
  }

  getAccountingKpis(): OperationKpi[] {
    return [
      { label: "Revenus", labelKey: "api.accounting.kpi.revenue", value: "482 300 EUR", change: "+11%" },
      { label: "Depenses", labelKey: "api.accounting.kpi.expenses", value: "236 900 EUR", changeKey: "trend.watch" },
      { label: "Taxes", labelKey: "api.accounting.kpi.taxes", value: "24 600 EUR", changeKey: "trend.follow" },
      { label: "Rapprochements", labelKey: "api.accounting.kpi.reconciliations", value: "8", changeKey: "status.pending" },
    ];
  }

  getAccountingItems(): OperationItem[] {
    return [
      { id: "acc-1", titleKey: "api.accounting.item.bank.title", subtitleKey: "api.accounting.item.bank.subtitle", value: "8", statusKey: "status.pending" },
      { id: "acc-2", titleKey: "api.accounting.item.vat.title", subtitleKey: "api.accounting.item.vat.subtitle", value: "24 600 EUR", statusKey: "status.toDeclare" },
      { id: "acc-3", titleKey: "api.accounting.item.export.title", subtitleKey: "api.accounting.item.export.subtitle", value: "CSV", statusKey: "status.ready" },
    ];
  }

  getHrKpis(): OperationKpi[] {
    return [
      { label: "Employes", labelKey: "api.hr.kpi.employees", value: "48" },
      { label: "Presents", labelKey: "api.hr.kpi.present", value: "42" },
      { label: "Conges", labelKey: "api.hr.kpi.leaves", value: "6" },
      { label: "Masse salariale", labelKey: "api.hr.kpi.payroll", value: "186 400 EUR" },
    ];
  }

  getEmployees(): OperationItem[] {
    return [
      { id: "emp-1", name: "Amina Diallo", title: "Amina Diallo", role: "Responsable ventes", roleKey: "api.hr.role.salesLead", subtitleKey: "api.hr.role.salesLead", contract: "CDI", value: "CDI", status: "present", statusKey: "status.present" },
      { id: "emp-2", name: "Lucas Martin", title: "Lucas Martin", role: "Comptable", roleKey: "api.hr.role.accountant", subtitleKey: "api.hr.role.accountant", contract: "CDI", value: "CDI", status: "leave", statusKey: "status.leave" },
      { id: "emp-3", name: "Sara Lindstrom", title: "Sara Lindstrom", role: "Support client", roleKey: "api.hr.role.support", subtitleKey: "api.hr.role.support", contract: "CDD", value: "CDD", status: "present", statusKey: "status.present" },
    ];
  }

  getAppointmentsKpis(): OperationKpi[] {
    return [
      { label: "Rendez-vous du jour", labelKey: "api.appointments.kpi.today", value: "24", changeKey: "trend.today" },
      { label: "Creneaux disponibles", labelKey: "api.appointments.kpi.availableSlots", value: "8", changeKey: "common.available" },
      { label: "A confirmer", labelKey: "api.appointments.kpi.toConfirm", value: "5", changeKey: "trend.priority" },
      { label: "Risque absence", labelKey: "api.appointments.kpi.noShowRisk", value: "3", changeKey: "trend.watch" },
    ];
  }

  getAppointmentsItems(): OperationItem[] {
    return [
      { id: "apt-1", titleKey: "api.appointments.item.confirm.title", subtitleKey: "api.appointments.item.confirm.subtitle", value: "11:30", statusKey: "status.pending" },
      { id: "apt-2", titleKey: "api.appointments.item.available.title", subtitleKey: "api.appointments.item.available.subtitle", value: "8", statusKey: "status.available" },
      { id: "apt-3", titleKey: "api.appointments.item.followup.title", subtitleKey: "api.appointments.item.followup.subtitle", value: "J+1", statusKey: "status.scheduled" },
    ];
  }

  getProductionKpis(): OperationKpi[] {
    return [
      { label: "Ordres actifs", labelKey: "api.production.kpi.orders", value: "32", changeKey: "trend.live" },
      { label: "Rendement", labelKey: "api.production.kpi.yield", value: "94%", change: "+4%" },
      { label: "Couts", labelKey: "api.production.kpi.costs", value: "78 200 EUR", changeKey: "trend.watch" },
      { label: "Alertes qualite", labelKey: "api.production.kpi.qualityAlerts", value: "4", changeKey: "trend.action" },
    ];
  }

  getProductionItems(): OperationItem[] {
    return [
      { id: "prod-1", titleKey: "api.production.item.batch.title", subtitleKey: "api.production.item.batch.subtitle", value: "64%", statusKey: "status.inProgress" },
      { id: "prod-2", titleKey: "api.production.item.machine.title", subtitleKey: "api.production.item.machine.subtitle", value: "2", statusKey: "status.watch" },
      { id: "prod-3", titleKey: "api.production.item.quality.title", subtitleKey: "api.production.item.quality.subtitle", value: "4", statusKey: "status.pending" },
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
    const intent = safeQuestion.toLowerCase();

    const responses = {
      en: {
        empty: "EnterpriseERP analysis: ask a question to receive an operational recommendation.",
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
        generic: `EnterpriseERP analysis: prioritize actions related to "${safeQuestion}", review recent data and assign a responsible follow-up.`,
      },
      sv: {
        empty: "EnterpriseERP-analys: stall en fraga for att fa en operativ rekommendation.",
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
        generic: `EnterpriseERP-analys: prioritera atgarder kopplade till "${safeQuestion}", granska senaste data och tilldela ansvarig uppfoljning.`,
      },
      fr: {
        empty: "Analyse EnterpriseERP: posez une question pour obtenir une recommandation operationnelle.",
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
        generic: `Analyse EnterpriseERP: priorisez les actions liees a "${safeQuestion}", verifiez les donnees recentes et planifiez un suivi responsable.`,
      },
    };

    const language = locale === "en" || locale === "sv" ? locale : "fr";
    const copy = responses[language];

    if (!safeQuestion) return { question: normalizedQuestion, answer: copy.empty };

    if (intent.includes("report") || intent.includes("rapport") || intent.includes("summary") || intent.includes("resume")) {
      return { question: normalizedQuestion, answer: copy.report };
    }

    if (intent.includes("stock") || intent.includes("inventory") || intent.includes("lager") || intent.includes("rupture")) {
      return { question: normalizedQuestion, answer: copy.stock };
    }

    if (intent.includes("vente") || intent.includes("sales") || intent.includes("devis") || intent.includes("prospect") || intent.includes("crm")) {
      return { question: normalizedQuestion, answer: copy.sales };
    }

    if (intent.includes("finance") || intent.includes("invoice") || intent.includes("facture") || intent.includes("cash") || intent.includes("paiement")) {
      return { question: normalizedQuestion, answer: copy.finance };
    }

    if (intent.includes("rh") || intent.includes("hr") || intent.includes("employee") || intent.includes("employe") || intent.includes("conge")) {
      return { question: normalizedQuestion, answer: copy.hr };
    }

    if (intent.includes("canal") || intent.includes("channel") || intent.includes("email") || intent.includes("linkedin") || intent.includes("whatsapp")) {
      return { question: normalizedQuestion, answer: copy.campaign };
    }

    return { question: normalizedQuestion, answer: copy.generic };
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
