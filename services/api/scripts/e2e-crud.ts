type Json = Record<string, unknown>;
type Session = {
  accessToken: string;
  user: { id: string; email: string; companyId: string };
  companyId: string;
};
type Entity = { id: string };

const baseUrl = (process.env.E2E_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const allowRemoteWrite = process.env.E2E_ALLOW_REMOTE_WRITE === "true";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const e2eIp = `e2e-crud-${runId}`;
const password = "E2ePassword123";

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
  headers.set("x-forwarded-for", e2eIp);

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
  headers.set("x-forwarded-for", e2eIp);

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

async function registerTenant() {
  return request<Session>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      companyName: `EnterpriseERP CRUD ${runId}`,
      name: "CRUD Owner",
      email: `crud-owner-${runId}@enterpriseerp.test`,
      password,
      sector: "commerce",
      language: "en",
      termsAccepted: true,
    }),
  });
}

async function assertListed(path: string, token: string, id: string) {
  const items = await request<Array<Entity>>(path, { token });
  assert(items.some((item) => item.id === id), `${path}: entity ${id} not found in list`);
}

async function verifyClientCrud(token: string) {
  const created = await request<Entity & { status: string; revenue: number }>("/clients", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: "CRUD Client",
      email: `crud-client-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 100,
    }),
  });

  const read = await request<Entity & { email: string }>(`/clients/${created.id}`, { token });
  assert(read.email === `crud-client-${runId}@enterpriseerp.test`, "Client read returned the wrong record");

  const updated = await request<Entity & { status: string; revenue: number }>(`/clients/${created.id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ status: "Qualified", revenue: 250 }),
  });
  assert(updated.status === "Qualified", "Client update did not persist status");
  assert(Number(updated.revenue) === 250, "Client update did not persist revenue");

  await assertListed("/clients", token, created.id);
  await request(`/clients/${created.id}`, { method: "DELETE", token });
  await expectStatus(`/clients/${created.id}`, 404, { token });
}

async function verifyProductCrud(token: string) {
  const created = await request<Entity & { sku: string }>("/products", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: "CRUD Product",
      sku: `CRUD-SKU-${runId}`,
      quantity: 8,
      status: "Available",
      value: 400,
    }),
  });

  const read = await request<Entity & { sku: string }>(`/products/${created.id}`, { token });
  assert(read.sku === `CRUD-SKU-${runId}`, "Product read returned the wrong record");

  const updated = await request<Entity & { quantity: number; value: number }>(`/products/${created.id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity: 15, value: 550 }),
  });
  assert(updated.quantity === 15, "Product update did not persist quantity");
  assert(Number(updated.value) === 550, "Product update did not persist value");

  await assertListed("/products", token, created.id);
  await request(`/products/${created.id}`, { method: "DELETE", token });
  await expectStatus(`/products/${created.id}`, 404, { token });
}

async function verifyInvoiceCrud(token: string) {
  const created = await request<Entity & { number: string }>("/invoices", {
    method: "POST",
    token,
    body: JSON.stringify({
      number: `CRUD-INV-${runId}`,
      customer: "CRUD Customer",
      amount: 750,
      due: "2026-12-31",
      status: "Pending",
    }),
  });

  const read = await request<Entity & { number: string }>(`/invoices/${created.id}`, { token });
  assert(read.number === `CRUD-INV-${runId}`, "Invoice read returned the wrong record");

  const updated = await request<Entity & { amount: number; status: string }>(`/invoices/${created.id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ amount: 920, status: "Approved" }),
  });
  assert(Number(updated.amount) === 920, "Invoice update did not persist amount");
  assert(updated.status === "Approved", "Invoice update did not persist status");

  await assertListed("/invoices", token, created.id);
  return created;
}

async function verifyPaymentCrud(token: string, invoiceId: string) {
  const created = await request<Entity & { reference: string; invoiceId: string }>("/payments", {
    method: "POST",
    token,
    body: JSON.stringify({
      invoiceId,
      reference: `CRUD-PAY-${runId}`,
      customer: "CRUD Customer",
      amount: 920,
      method: "card",
      status: "received",
      paidAt: "2026-09-20T12:00:00.000Z",
    }),
  });
  assert(created.invoiceId === invoiceId, "Payment did not link to the expected invoice");

  await assertListed("/payments", token, created.id);

  const updated = await request<Entity & { amount: number; status: string }>(`/payments/${created.id}`, {
    method: "PUT",
    token,
    body: JSON.stringify({ amount: 930, status: "reconciled" }),
  });
  assert(Number(updated.amount) === 930, "Payment update did not persist amount");
  assert(updated.status === "reconciled", "Payment update did not persist status");

  await request(`/payments/${created.id}`, { method: "DELETE", token });
  const payments = await request<Array<Entity>>("/payments", { token });
  assert(!payments.some((payment) => payment.id === created.id), "Deleted payment is still visible in list");
}

async function main() {
  if (!isLocalUrl(baseUrl) && !allowRemoteWrite) {
    throw new Error(
      `Refusing to write CRUD E2E data to ${baseUrl}. Set E2E_ALLOW_REMOTE_WRITE=true only for a disposable staging environment.`
    );
  }

  const tenant = await registerTenant();
  const token = tenant.accessToken;

  await verifyClientCrud(token);
  await verifyProductCrud(token);
  const invoice = await verifyInvoiceCrud(token);
  await verifyPaymentCrud(token, invoice.id);

  await request(`/invoices/${invoice.id}`, { method: "DELETE", token });
  await expectStatus(`/invoices/${invoice.id}`, 404, { token });

  console.log(`CRUD E2E checks passed against ${baseUrl}.`);
}

main().catch((error) => {
  if (error instanceof TypeError && String(error.message).includes("fetch failed")) {
    console.error(`CRUD E2E checks could not reach ${baseUrl}. Start the API first with npm run dev:api.`);
    process.exitCode = 1;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
