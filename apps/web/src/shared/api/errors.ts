import { isAxiosError } from "axios";

type ApiErrorPayload = {
  message?: string | string[];
  error?: {
    message?: string | string[];
  };
};

function firstMessage(message: string | string[] | undefined) {
  if (Array.isArray(message)) {
    return message.find(Boolean);
  }

  return message;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorPayload>(error)) {
    return fallback;
  }

  if (!error.response) {
    return fallback;
  }

  const payload = error.response?.data;
  const message =
    firstMessage(payload?.message) ??
    firstMessage(payload?.error?.message) ??
    error.message;

  return message || fallback;
}

export function isExistingAccountError(message: string) {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    normalized.includes("existe deja") ||
    normalized.includes("already exists") ||
    normalized.includes("account exists") ||
    normalized.includes("email already")
  );
}
