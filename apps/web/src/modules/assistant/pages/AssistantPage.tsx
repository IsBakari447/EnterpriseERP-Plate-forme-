"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { useSector } from "@shared/sector/SectorProvider";
import { assistantKpis, suggestions } from "@modules/assistant/data";
import { assistantService, type AssistantChatResponse, type AssistantKpi, type AssistantSuggestion } from "../services/assistant.service";

export default function AssistantPage() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const { sectorKey } = useSector();
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<AssistantChatResponse>({
    question: t("ai.sampleQuestion"),
    answer: t("ai.sampleAnswer"),
    generatedBy: "EnterpriseERP AI",
  });
  const [kpis, setKpis] = useState<AssistantKpi[]>(assistantKpis);
  const [suggestionRows, setSuggestionRows] = useState<AssistantSuggestion[]>(suggestions);
  const [loading, setLoading] = useState(false);

  async function askAssistant(nextQuestion: string) {
    setLoading(true);

    try {
      const nextConversation = await assistantService.chat(nextQuestion, t("ai.sampleAnswer"), locale);
      setConversation(nextConversation);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadAssistant() {
      const [nextKpis, nextSuggestions] = await Promise.all([
        assistantService.getKpis(),
        assistantService.getSuggestions(),
      ]);

      setKpis(nextKpis);
      setSuggestionRows(nextSuggestions);
    }

    loadAssistant();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") !== "report") return;

    const reportQuestion = [
      t("ai.newReport"),
      `sector=${params.get("sector") ?? sectorKey}`,
      `period=${params.get("period") ?? "30d"}`,
    ].join(" - ");

    setQuestion(reportQuestion);
    askAssistant(reportQuestion);
    router.replace("/assistant");
  }, [locale, router, sectorKey, t]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    await askAssistant(question);
    setQuestion("");
  }

  return (
    <ERPLayout
      title={t("ai.assistantTitle")}
      subtitle={t("ai.assistantSubtitle")}
      action={t("ai.newReport")}
      onAction={() => {
        const reportQuestion = `${t("ai.newReport")} - sector=${sectorKey}`;
        setQuestion(reportQuestion);
        askAssistant(reportQuestion);
      }}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.labelKey} label={t(kpi.labelKey)} value={kpi.value} change={kpi.change} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-night">{t("ai.conversation")}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">{t("ai.conversationText")}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/ai-sales-agent" className="rounded-xl bg-[#00C2A9]/10 px-4 py-2 text-sm font-black text-[#008f7d]">
                {t("nav.ai-sales-agent")}
              </Link>
              <Link href="/ai-studio" className="rounded-xl bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
                {t("nav.ai-studio")}
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="max-w-xl rounded-2xl bg-slate-100 p-4 font-semibold text-slate-700">
              {conversation.question}
            </div>

            <div className="ml-auto max-w-2xl rounded-2xl bg-gradient-to-r from-[#1E2A38] to-[#00C2A9] p-5 text-white">
              {conversation.generatedBy && (
                <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-white/80">
                  {conversation.generatedBy}
                </div>
              )}
              {conversation.answer}
            </div>
          </div>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
              placeholder={t("ai.askPlaceholder")}
            />
            <button type="submit" className="rounded-xl bg-action px-6 py-3 font-semibold text-white">
              {loading ? t("common.loading") : t("common.send")}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">{t("ai.suggestions")}</h2>

          <div className="mt-5 space-y-3">
            {suggestionRows.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={async () => {
                  const text = t(item.key);
                  setQuestion(text);
                  await askAssistant(text);
                }}
                className="w-full rounded-xl bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 transition hover:bg-cyan-50"
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
