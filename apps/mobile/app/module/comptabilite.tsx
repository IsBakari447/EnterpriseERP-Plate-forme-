import { MobileModuleWorkspace } from "@/screens/MobileModuleWorkspace";

export default function AccountingScreen() {
  return (
    <MobileModuleWorkspace
      titleKey="nav.comptabilite"
      subtitleKey="screen.accounting.subtitle"
      icon="calculator-outline"
      metrics={[
        { labelKey: "screen.accounting.revenue", value: "482 300 EUR", hintKey: "trend.month" },
        { labelKey: "screen.accounting.expenses", value: "236 900 EUR", hintKey: "trend.watch" },
        { labelKey: "screen.accounting.taxes", value: "24 600 EUR", hintKey: "trend.follow" },
      ]}
      sections={[
        { titleKey: "screen.accounting.booksTitle", items: ["screen.accounting.books.1", "screen.accounting.books.2", "screen.accounting.books.3", "screen.accounting.books.4"] },
        { titleKey: "screen.accounting.complianceTitle", items: ["screen.accounting.compliance.1", "screen.accounting.compliance.2", "screen.accounting.compliance.3"] },
      ]}
      aiKey="screen.accounting.ai"
    />
  );
}
