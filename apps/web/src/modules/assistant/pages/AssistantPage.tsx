"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import ERPLayout from "@shared/components/layout/ERPLayout";
import KPICard from "@shared/components/ui/KPICard";
import { useI18n } from "@shared/i18n/I18nProvider";
import { assistantKpis, suggestions } from "@modules/assistant/data";

export default function AssistantPage() {
  const { t } = useI18n();
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState({
    question: t("ai.sampleQuestion"),
    answer: t("ai.sampleAnswer"),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setConversation({
      question,
      answer: `${t("ai.sampleAnswer")} ${question}`,
    });
    setQuestion("");
  }

  return (
    <ERPLayout
      title={t("ai.assistantTitle")}
      subtitle={t("ai.assistantSubtitle")}
      action={t("ai.newReport")}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {assistantKpis.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
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
                AI Sales Agent
              </Link>
              <Link href="/ai-studio" className="rounded-xl bg-[#1E2A38] px-4 py-2 text-sm font-black text-white">
                AI Studio
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="max-w-xl rounded-2xl bg-slate-100 p-4 font-semibold text-slate-700">
              {conversation.question}
            </div>

            <div className="ml-auto max-w-2xl rounded-2xl bg-gradient-to-r from-[#1E2A38] to-[#00C2A9] p-5 text-white">
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
              {t("common.send")}
            </button>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-night">{t("ai.suggestions")}</h2>

          <div className="mt-5 space-y-3">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuestion(item);
                  setConversation({ question: item, answer: `${t("ai.sampleAnswer")} ${item}` });
                }}
                className="w-full rounded-xl bg-slate-50 p-4 text-left text-sm font-bold text-slate-700 transition hover:bg-cyan-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ERPLayout>
  );
}
