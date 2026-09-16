type Json = Record<string, unknown>;
type Session = {
  accessToken: string;
  user: { id: string; email: string; companyId: string };
  companyId: string;
  sector: string;
  onboardingCompleted: boolean;
};

const baseUrl = (process.env.E2E_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const allowRemoteWrite = process.env.E2E_ALLOW_REMOTE_WRITE === "true";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function isLocalUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(url);
}

async function request<T = Json>(path: string, options: RequestInit & { token?: string } = {}) {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (options.token) {
    headers.set("authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}: ${text}`);
  }

  return data as T;
}

async function expectStatus(path: string, status: number, options: RequestInit & { token?: string } = {}) {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (options.token) {
    headers.set("authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${baseUrl}/api${path}`, {
    ...options,
    headers,
  });

  assert(response.status === status, `${options.method ?? "GET"} ${path}: expected ${status}, got ${response.status}`);
}

async function registerTenant(label: string, sector: string) {
  return request<Session>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      companyName: `EnterpriseERP E2E ${label} ${runId}`,
      name: `E2E Owner ${label}`,
      email: `e2e-${label}-${runId}@enterpriseerp.test`,
      password: "E2ePassword123",
      sector,
      language: "en",
    }),
  });
}

async function createRecord<T extends { id: string }>(path: string, token: string, body: Json) {
  const created = await request<T>(path, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  });
  assert(created.id, `${path}: created record is missing id`);
  return created;
}

async function verifyCrud(session: Session) {
  const token = session.accessToken;

  const profile = await request<Json>("/profile", { token });
  assert(profile.email === session.user.email, "profile should belong to the authenticated user");

  const updatedProfile = await request<Json>("/profile", {
    method: "PUT",
    token,
    body: JSON.stringify({
      language: "sv",
      timezone: "Africa/Douala",
      displayCurrency: "XAF",
      theme: "system",
    }),
  });
  assert(updatedProfile.language === "sv", "profile language was not persisted");
  assert(updatedProfile.displayCurrency === "XAF", "profile currency was not persisted");

  const updatedCompany = await request<Json>("/company", {
    method: "PATCH",
    token,
    body: JSON.stringify({
      sector: "hospitality",
      country: "CM",
      currency: "XAF",
      language: "sv",
      timezone: "Africa/Douala",
    }),
  });
  assert(updatedCompany.sector === "hospitality", "company sector was not persisted");
  assert(updatedCompany.currency === "XAF", "company currency was not persisted");

  await request<Json>("/company/current/complete-onboarding", { method: "POST", token });
  const companyAfterOnboarding = await request<Json>("/company/current", { token });
  assert(companyAfterOnboarding.onboardingCompleted === true, "onboarding completion was not persisted");

  const client = await createRecord<{ id: string; email: string }>("/clients", token, {
    name: "E2E Client",
    email: `client-${runId}@enterpriseerp.test`,
    country: "CM",
    status: "Prospect",
    revenue: 1200,
  });
  const clients = await request<Array<{ id: string }>>("/clients", { token });
  assert(clients.some((item) => item.id === client.id), "created client is not visible in client list");

  const product = await createRecord<{ id: string; sku: string }>("/products", token, {
    name: "E2E Product",
    sku: `SKU-${runId}`,
    quantity: 12,
    status: "Available",
    value: 450,
  });
  const products = await request<Array<{ id: string }>>("/products", { token });
  assert(products.some((item) => item.id === product.id), "created product is not visible in product list");

  const invoice = await createRecord<{ id: string; number: string }>("/invoices", token, {
    number: `INV-${runId}`,
    customer: "E2E Client",
    amount: 890,
    due: "2026-12-31",
    status: "Pending",
  });
  const invoices = await request<Array<{ id: string }>>("/invoices", { token });
  assert(invoices.some((item) => item.id === invoice.id), "created invoice is not visible in invoice list");

  return { client, product, invoice };
}

async function main() {
  if (!isLocalUrl(baseUrl) && !allowRemoteWrite) {
    throw new Error(
      `Refusing to write E2E data to ${baseUrl}. Set E2E_ALLOW_REMOTE_WRITE=true only for a disposable staging environment.`
    );
  }

  const tenantA = await registerTenant("a", "commerce");
  const tenantB = await registerTenant("b", "education");

  assert(tenantA.accessToken, "register should return an access token when email verification is not required");
  assert(tenantA.sector === "commerce", "register should return the chosen sector");

  const loginA = await request<Session>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: tenantA.user.email,
      password: "E2ePassword123",
      rememberMe: true,
      deviceName: "EnterpriseERP E2E",
    }),
  });
  assert(loginA.companyId === tenantA.companyId, "login returned a different tenant context");

  const { client, product, invoice } = await verifyCrud(tenantA);

  await expectStatus(`/clients/${client.id}`, 404, { token: tenantB.accessToken });
  await expectStatus(`/products/${product.id}`, 404, { token: tenantB.accessToken });
  await expectStatus(`/invoices/${invoice.id}`, 404, { token: tenantB.accessToken });

  console.log(`E2E smoke checks passed against ${baseUrl}.`);
}

main().catch((error) => {
  if (error instanceof TypeError && String(error.message).includes("fetch failed")) {
    console.error(`E2E smoke checks could not reach ${baseUrl}. Start the API first with npm run dev:api.`);
    process.exitCode = 1;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
