import { apiClient } from "@shared/api/client";
import { assistantKpis as fallbackKpis, suggestions as fallbackSuggestions } from "../data";

export type AssistantKpi = {
  labelKey: string;
  value: string;
  change?: string;
};

export type AssistantSuggestion = {
  key: string;
};

export type AssistantChatResponse = {
  question: string;
  answer: string;
  intent?: string;
  provider?: string;
  generatedBy?: string;
};

async function getOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const { data } = await apiClient.get<T>(path);
    return data;
  } catch {
    return fallback;
  }
}

export const assistantService = {
  getKpis() {
    return getOrFallback<AssistantKpi[]>("/assistant/kpis", fallbackKpis);
  },

  getSuggestions() {
    return getOrFallback<AssistantSuggestion[]>("/assistant/suggestions", fallbackSuggestions);
  },

  async chat(question: string, fallbackAnswer: string, locale: string): Promise<AssistantChatResponse> {
    try {
      const { data } = await apiClient.post<AssistantChatResponse>("/assistant/chat", { question, locale });
      return data;
    } catch {
      return {
        question,
        answer: `${fallbackAnswer} ${question}`,
      };
    }
  },
};
