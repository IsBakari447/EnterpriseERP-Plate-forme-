import { PrismaClient } from "@prisma/client";

type Json = Record<string, unknown>;
type Session = {
  accessToken: string;
  user: { id: string; email: string; companyId: string };
  companyId: string;
};
type TenantResource = {
  id: string;
  readPath: string;
  updatePath: string;
  deletePath: string;
  updateBody: Json;
  verifyUnchanged: () => Promise<void>;
};

const baseUrl = (process.env.E2E_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const allowRemoteWrite = process.env.E2E_ALLOW_REMOTE_WRITE === "true";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const e2eIp = `e2e-tenant-http-${runId}`;
const password = "E2ePassword123";
const prisma = new PrismaClient();

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

async function registerTenant(label: string, sector = "commerce") {
  return request<Session>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      companyName: `EnterpriseERP Tenant HTTP ${label} ${runId}`,
      name: `Tenant HTTP Owner ${label}`,
      email: `tenant-http-owner-${label}-${runId}@enterpriseerp.test`,
      password,
      sector,
      language: "en",
      termsAccepted: true,
    }),
  });
}

async function createClient(owner: Session): Promise<TenantResource> {
  const client = await request<{ id: string }>("/clients", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      name: "Tenant HTTP Client A",
      email: `tenant-http-client-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 1000,
    }),
  });

  return {
    id: client.id,
    readPath: `/clients/${client.id}`,
    updatePath: `/clients/${client.id}`,
    deletePath: `/clients/${client.id}`,
    updateBody: { status: "Leaked", revenue: 9999 },
    verifyUnchanged: async () => {
      const stored = await prisma.client.findUniqueOrThrow({ where: { id: client.id } });
      assert(stored.companyId === owner.companyId, "Client tenant ownership changed");
      assert(stored.status === "Prospect", "Cross-tenant client update changed status");
      assert(Number(stored.revenue) === 1000, "Cross-tenant client update changed revenue");
    },
  };
}

async function createProduct(owner: Session): Promise<TenantResource> {
  const product = await request<{ id: string }>("/products", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      name: "Tenant HTTP Product A",
      sku: `TENANT-HTTP-SKU-${runId}`,
      quantity: 7,
      status: "Available",
      value: 300,
    }),
  });

  return {
    id: product.id,
    readPath: `/products/${product.id}`,
    updatePath: `/products/${product.id}`,
    deletePath: `/products/${product.id}`,
    updateBody: { quantity: 99, status: "Leaked" },
    verifyUnchanged: async () => {
      const stored = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
      assert(stored.companyId === owner.companyId, "Product tenant ownership changed");
      assert(stored.quantity === 7, "Cross-tenant product update changed quantity");
      assert(stored.status === "Available", "Cross-tenant product update changed status");
    },
  };
}

async function createInvoice(owner: Session, label = "A"): Promise<TenantResource> {
  const invoice = await request<{ id: string }>("/invoices", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      number: `TENANT-HTTP-INV-${label}-${runId}`,
      customer: `Tenant HTTP Customer ${label}`,
      amount: 820,
      due: "2026-12-31",
      status: "Pending",
    }),
  });

  return {
    id: invoice.id,
    readPath: `/invoices/${invoice.id}`,
    updatePath: `/invoices/${invoice.id}`,
    deletePath: `/invoices/${invoice.id}`,
    updateBody: { amount: 9999, status: "Leaked" },
    verifyUnchanged: async () => {
      const stored = await prisma.invoice.findUniqueOrThrow({ where: { id: invoice.id } });
      assert(stored.companyId === owner.companyId, "Invoice tenant ownership changed");
      assert(Number(stored.amount) === 820, "Cross-tenant invoice update changed amount");
      assert(stored.status === "Pending", "Cross-tenant invoice update changed status");
    },
  };
}

async function createUser(owner: Session): Promise<TenantResource> {
  const user = await request<{ id: string }>("/users", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      name: "Tenant HTTP Employee A",
      email: `tenant-http-user-${runId}@enterpriseerp.test`,
      role: "EMPLOYEE",
      status: "ACTIVE",
    }),
  });

  return {
    id: user.id,
    readPath: `/users/${user.id}`,
    updatePath: `/users/${user.id}`,
    deletePath: `/users/${user.id}`,
    updateBody: { name: "Leaked User", status: "SUSPENDED" },
    verifyUnchanged: async () => {
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      assert(stored.companyId === owner.companyId, "User tenant ownership changed");
      assert(stored.name === "Tenant HTTP Employee A", "Cross-tenant user update changed name");
      assert(stored.status === "ACTIVE", "Cross-tenant user update changed status");
    },
  };
}

async function createPayment(owner: Session, invoiceId: string): Promise<TenantResource> {
  const payment = await request<{ id: string }>("/payments", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      invoiceId,
      reference: `TENANT-HTTP-PAY-${runId}`,
      customer: "Tenant HTTP Customer A",
      amount: 820,
      method: "card",
      status: "received",
      paidAt: "2026-09-20T12:00:00.000Z",
    }),
  });

  return {
    id: payment.id,
    readPath: "/payments",
    updatePath: `/payments/${payment.id}`,
    deletePath: `/payments/${payment.id}`,
    updateBody: { amount: 9999, status: "leaked" },
    verifyUnchanged: async () => {
      const stored = await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
      assert(stored.companyId === owner.companyId, "Payment tenant ownership changed");
      assert(Number(stored.amount) === 820, "Cross-tenant payment update changed amount");
      assert(stored.status === "received", "Cross-tenant payment update changed status");
    },
  };
}

async function assertCrossTenantDenied(resource: TenantResource, attacker: Session, expectedReadStatus = 404) {
  await expectStatus(resource.readPath, expectedReadStatus, { token: attacker.accessToken });
  await expectStatus(resource.updatePath, 404, {
    method: "PUT",
    token: attacker.accessToken,
    body: JSON.stringify(resource.updateBody),
  });
  await expectStatus(resource.deletePath, 404, {
    method: "DELETE",
    token: attacker.accessToken,
  });
  await resource.verifyUnchanged();
}

async function verifyPaymentInvoiceRelationship(ownerA: Session, ownerB: Session, invoiceAId: string) {
  const invoiceB = await createInvoice(ownerB, "B");

  await expectStatus("/payments", 404, {
    method: "POST",
    token: ownerB.accessToken,
    body: JSON.stringify({
      invoiceId: invoiceAId,
      reference: `TENANT-HTTP-PAY-CROSS-${runId}`,
      customer: "Tenant HTTP Customer B",
      amount: 100,
      status: "received",
    }),
  });

  const paymentB = await request<{ id: string }>("/payments", {
    method: "POST",
    token: ownerB.accessToken,
    body: JSON.stringify({
      invoiceId: invoiceB.id,
      reference: `TENANT-HTTP-PAY-B-${runId}`,
      customer: "Tenant HTTP Customer B",
      amount: 200,
      status: "received",
    }),
  });

  await expectStatus(`/payments/${paymentB.id}`, 404, {
    method: "PUT",
    token: ownerB.accessToken,
    body: JSON.stringify({ invoiceId: invoiceAId }),
  });

  const stored = await prisma.payment.findUniqueOrThrow({ where: { id: paymentB.id } });
  assert(stored.invoiceId === invoiceB.id, "Cross-tenant payment update changed invoice link");
}

async function verifyAuditTenantScope(ownerA: Session, ownerB: Session) {
  const logsA = await request<Array<{ id: string; companyId: string | null }>>("/audit?module=crm", {
    token: ownerA.accessToken,
  });
  const logsB = await request<Array<{ id: string; companyId: string | null }>>("/audit?module=crm", {
    token: ownerB.accessToken,
  });

  assert(logsA.length > 0, "Owner A should have audit logs for tenant-created resources");
  assert(logsA.every((log) => log.companyId === ownerA.companyId), "Audit list for Owner A leaked another tenant");
  assert(logsB.every((log) => log.companyId === ownerB.companyId), "Audit list for Owner B leaked another tenant");
  assert(!logsB.some((logB) => logsA.some((logA) => logA.id === logB.id)), "Audit logs overlap between tenants");
}

async function main() {
  if (!isLocalUrl(baseUrl) && !allowRemoteWrite) {
    throw new Error(
      `Refusing to write tenant HTTP E2E data to ${baseUrl}. Set E2E_ALLOW_REMOTE_WRITE=true only for a disposable staging environment.`
    );
  }

  const ownerA = await registerTenant("a", "commerce");
  const ownerB = await registerTenant("b", "education");

  const clientA = await createClient(ownerA);
  const productA = await createProduct(ownerA);
  const invoiceA = await createInvoice(ownerA);
  const paymentA = await createPayment(ownerA, invoiceA.id);
  const userA = await createUser(ownerA);

  await assertCrossTenantDenied(clientA, ownerB);
  await assertCrossTenantDenied(productA, ownerB);
  await assertCrossTenantDenied(invoiceA, ownerB);
  await assertCrossTenantDenied(paymentA, ownerB, 200);
  await assertCrossTenantDenied(userA, ownerB);
  await verifyPaymentInvoiceRelationship(ownerA, ownerB, invoiceA.id);
  await verifyAuditTenantScope(ownerA, ownerB);

  console.log(`Tenant HTTP E2E checks passed against ${baseUrl}.`);
}

main()
  .catch((error) => {
    if (error instanceof TypeError && String(error.message).includes("fetch failed")) {
      console.error(`Tenant HTTP E2E checks could not reach ${baseUrl}. Start the API first with npm run dev:api.`);
      process.exitCode = 1;
      return;
    }

    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
