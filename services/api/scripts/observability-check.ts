type CheckStatus = "pass" | "warn" | "fail";

type CheckResult = {
  name: string;
  url: string;
  status: CheckStatus;
  httpStatus?: number;
  latencyMs: number;
  message: string;
  data?: unknown;
};

const defaultTargets = {
  web: "https://enterpriseerp-web.onrender.com/",
  health: "https://enterpriseerp-api.onrender.com/health",
  readiness: "https://enterpriseerp-api.onrender.com/health/ready",
  platformStatus: "https://enterpriseerp-api.onrender.com/api/platform-status",
};

const timeoutMs = Number(process.env.OBSERVABILITY_TIMEOUT_MS ?? 10000);
const latencyWarnMs = Number(process.env.OBSERVABILITY_LATENCY_WARN_MS ?? 3000);
const latencyFailMs = Number(process.env.OBSERVABILITY_LATENCY_FAIL_MS ?? 10000);
const failOnWarn = process.env.OBSERVABILITY_FAIL_ON_WARN === "true";
const simulateIncident = process.env.OBSERVABILITY_SIMULATE_INCIDENT === "true";

function target(name: keyof typeof defaultTargets) {
  const envName = `OBSERVABILITY_${name.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}_URL`;
  return process.env[envName] ?? defaultTargets[name];
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startedAt = Date.now();
    const response = await fetch(url, { signal: controller.signal });
    const latencyMs = Date.now() - startedAt;
    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : summarizeTextResponse(await response.text(), contentType);

    return { response, latencyMs, data };
  } finally {
    clearTimeout(timeout);
  }
}

function summarizeTextResponse(body: string, contentType: string) {
  return {
    contentType: contentType || "unknown",
    bodyLength: body.length,
  };
}

function latencyStatus(latencyMs: number): Pick<CheckResult, "status" | "message"> {
  if (latencyMs >= latencyFailMs) {
    return { status: "fail", message: `Latency ${latencyMs}ms is above fail threshold ${latencyFailMs}ms.` };
  }

  if (latencyMs >= latencyWarnMs) {
    return { status: "warn", message: `Latency ${latencyMs}ms is above warning threshold ${latencyWarnMs}ms.` };
  }

  return { status: "pass", message: "Service responded within latency threshold." };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

async function checkHttp(name: string, url: string): Promise<CheckResult> {
  try {
    const { response, latencyMs, data } = await fetchWithTimeout(url);
    const latency = latencyStatus(latencyMs);

    if (response.status >= 500) {
      return {
        name,
        url,
        status: "fail",
        httpStatus: response.status,
        latencyMs,
        message: `HTTP ${response.status} from ${name}.`,
        data,
      };
    }

    if (!response.ok) {
      return {
        name,
        url,
        status: "warn",
        httpStatus: response.status,
        latencyMs,
        message: `HTTP ${response.status} from ${name}.`,
        data,
      };
    }

    return {
      name,
      url,
      status: latency.status,
      httpStatus: response.status,
      latencyMs,
      message: latency.message,
      data,
    };
  } catch (error) {
    return {
      name,
      url,
      status: "fail",
      latencyMs: timeoutMs,
      message: error instanceof Error ? error.message : "Request failed.",
    };
  }
}

async function checkReadiness(url: string): Promise<CheckResult> {
  const result = await checkHttp("api-readiness", url);

  if (result.status === "fail") {
    return result;
  }

  if (isRecord(result.data) && result.data.status !== "ready") {
    return {
      ...result,
      status: "fail",
      message: `Readiness status is ${String(result.data.status)} instead of ready.`,
    };
  }

  if (isRecord(result.data)) {
    const rateLimit = result.data.rateLimit;

    if (isRecord(rateLimit) && rateLimit.distributed === false) {
      return {
        ...result,
        status: "fail",
        message: "Rate limiting is not distributed. Expected Redis backend in production.",
      };
    }
  }

  return result;
}

async function sendAlert(results: CheckResult[]) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    return { sent: false, reason: "ALERT_WEBHOOK_URL not configured" };
  }

  const failed = results.filter((result) => result.status === "fail");
  const warned = results.filter((result) => result.status === "warn");
  const content = formatAlertMessage(failed, warned);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  return { sent: response.ok, httpStatus: response.status };
}

function formatAlertMessage(failed: CheckResult[], warned: CheckResult[]) {
  const lines = [
    "[EnterpriseERP Cloud Alert]",
    "",
    `Status: ${failed.length > 0 ? "FAIL" : "WARN"}`,
    `Time: ${new Date().toISOString()}`,
    "",
  ];

  for (const result of failed) {
    lines.push(`FAIL ${result.name}: ${result.message}`);
  }

  for (const result of warned) {
    lines.push(`WARN ${result.name}: ${result.message}`);
  }

  return lines.join("\n").slice(0, 1900);
}

async function main() {
  const results = [
    await checkHttp("web", target("web")),
    await checkHttp("api-health", target("health")),
    await checkReadiness(target("readiness")),
    await checkHttp("platform-status", target("platformStatus")),
  ];

  if (simulateIncident) {
    results.push({
      name: "controlled-incident",
      url: "local-simulation",
      status: "fail",
      latencyMs: 0,
      message: "Controlled observability incident simulation.",
    });
  }

  const hasFailure = results.some((result) => result.status === "fail");
  const hasWarning = results.some((result) => result.status === "warn");
  const shouldAlert = hasFailure || hasWarning;
  const alert = shouldAlert ? await sendAlert(results) : { sent: false, reason: "no alert needed" };

  const report = {
    status: hasFailure ? "fail" : hasWarning ? "warn" : "pass",
    generatedAt: new Date().toISOString(),
    thresholds: {
      timeoutMs,
      latencyWarnMs,
      latencyFailMs,
    },
    alert,
    results,
  };

  console.log(JSON.stringify(report, null, 2));

  if (hasFailure || (hasWarning && failOnWarn)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
