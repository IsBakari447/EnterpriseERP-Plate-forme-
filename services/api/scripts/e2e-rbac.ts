import { PrismaClient, UserRole } from "@prisma/client";
import { PasswordService } from "../src/common/auth/password.service";
import { EnterprisePermission } from "../src/common/security/permissions";

type Json = Record<string, unknown>;
type Session = {
  accessToken: string;
  user: { id: string; email: string; companyId: string };
  companyId: string;
};
type CreatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

const baseUrl = (process.env.E2E_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
const allowRemoteWrite = process.env.E2E_ALLOW_REMOTE_WRITE === "true";
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const e2eIp = `e2e-rbac-${runId}`;
const password = "E2ePassword123";
const prisma = new PrismaClient();
const passwords = new PasswordService();

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
      companyName: `EnterpriseERP RBAC ${label} ${runId}`,
      name: `RBAC Owner ${label}`,
      email: `rbac-owner-${label}-${runId}@enterpriseerp.test`,
      password,
      sector,
      language: "en",
    }),
  });
}

async function login(email: string) {
  return request<Session>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      rememberMe: true,
      deviceName: "EnterpriseERP RBAC E2E",
    }),
  });
}

async function createRoleUser(owner: Session, role: UserRole, label: string) {
  const created = await request<CreatedUser>("/users", {
    method: "POST",
    token: owner.accessToken,
    body: JSON.stringify({
      name: `RBAC ${role} ${label}`,
      email: `rbac-${role.toLowerCase()}-${label}-${runId}@enterpriseerp.test`,
      role,
      status: "ACTIVE",
    }),
  });

  await prisma.user.update({
    where: { id: created.id },
    data: {
      passwordHash: passwords.hash(password),
      emailVerifiedAt: new Date(),
    },
  });

  return created;
}

async function createClient(token: string, label: string) {
  return request<{ id: string }>("/clients", {
    method: "POST",
    token,
    body: JSON.stringify({
      name: `RBAC Client ${label}`,
      email: `rbac-client-${label}-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 1200,
    }),
  });
}

async function createInvoice(token: string, label: string) {
  return request<{ id: string }>("/invoices", {
    method: "POST",
    token,
    body: JSON.stringify({
      number: `RBAC-INV-${label}-${runId}`,
      customer: `RBAC Customer ${label}`,
      amount: 640,
      due: "2026-12-31",
      status: "Pending",
    }),
  });
}

async function createProductPayload(label: string) {
  return {
    name: `RBAC Product ${label}`,
    sku: `RBAC-SKU-${label}-${runId}`,
    quantity: 5,
    status: "Available",
    value: 250,
  };
}

async function ensurePermission(key: EnterprisePermission) {
  const [module, action] = key.split(".");

  return prisma.permission.upsert({
    where: { key },
    update: {},
    create: {
      key,
      module,
      action,
      description: `E2E permission ${key}`,
    },
  });
}

async function createDatabasePermissionUser(input: {
  companyId: string;
  email: string;
  roleKey: string;
  permissions: EnterprisePermission[];
  membershipCompanyId?: string;
}) {
  const user = await prisma.user.create({
    data: {
      companyId: input.companyId,
      name: `RBAC DB ${input.roleKey}`,
      email: input.email,
      passwordHash: passwords.hash(password),
      role: "VIEWER",
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
    },
  });

  const role = await prisma.role.create({
    data: {
      companyId: input.membershipCompanyId ?? input.companyId,
      key: `${input.roleKey}-${runId}`,
      name: `RBAC ${input.roleKey}`,
      system: false,
    },
  });

  for (const permissionKey of input.permissions) {
    const permission = await ensurePermission(permissionKey);
    await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  await prisma.membership.create({
    data: {
      companyId: input.membershipCompanyId ?? input.companyId,
      userId: user.id,
      roleId: role.id,
      legacyRole: "VIEWER",
      status: "ACTIVE",
    },
  });

  return user;
}

async function verifyInheritedRolePermissions(ownerA: Session) {
  await expectStatus("/clients", 401);

  const viewer = await createRoleUser(ownerA, "VIEWER", "read-only");
  const viewerSession = await login(viewer.email);
  await request<Array<Json>>("/clients", { token: viewerSession.accessToken });
  await expectStatus("/clients", 403, {
    method: "POST",
    token: viewerSession.accessToken,
    body: JSON.stringify({
      name: "Viewer Forbidden Client",
      email: `viewer-forbidden-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 10,
    }),
  });

  const sales = await createRoleUser(ownerA, "SALES", "crm");
  const salesSession = await login(sales.email);
  const salesClient = await createClient(salesSession.accessToken, "sales");
  await request<Json>(`/clients/${salesClient.id}`, {
    method: "PUT",
    token: salesSession.accessToken,
    body: JSON.stringify({ status: "Qualified", revenue: 1800 }),
  });
  await expectStatus("/users", 403, {
    method: "POST",
    token: salesSession.accessToken,
    body: JSON.stringify({
      name: "Forbidden User",
      email: `sales-forbidden-user-${runId}@enterpriseerp.test`,
      role: "VIEWER",
      status: "ACTIVE",
    }),
  });

  const accounting = await createRoleUser(ownerA, "ACCOUNTING", "finance");
  const accountingSession = await login(accounting.email);
  await request<Array<Json>>("/invoices", { token: accountingSession.accessToken });
  await createInvoice(accountingSession.accessToken, "accounting");
  await expectStatus("/products", 403, {
    method: "POST",
    token: accountingSession.accessToken,
    body: JSON.stringify(await createProductPayload("accounting-forbidden")),
  });

  const manager = await createRoleUser(ownerA, "MANAGER", "owner-assignment");
  const managerSession = await login(manager.email);
  await expectStatus("/users", 403, {
    method: "POST",
    token: managerSession.accessToken,
    body: JSON.stringify({
      name: "Forbidden Owner",
      email: `manager-owner-${runId}@enterpriseerp.test`,
      role: "OWNER",
      status: "ACTIVE",
    }),
  });
}

async function verifyDatabasePermissionIsolation(ownerA: Session, ownerB: Session) {
  const dbAllowed = await createDatabasePermissionUser({
    companyId: ownerA.companyId,
    email: `rbac-db-allowed-${runId}@enterpriseerp.test`,
    roleKey: "crm-create",
    permissions: ["crm.create"],
  });
  const dbAllowedSession = await login(dbAllowed.email);
  await createClient(dbAllowedSession.accessToken, "db-allowed");

  const dbDenied = await createDatabasePermissionUser({
    companyId: ownerA.companyId,
    email: `rbac-db-denied-${runId}@enterpriseerp.test`,
    roleKey: "no-crm-create",
    permissions: [],
  });
  const dbDeniedSession = await login(dbDenied.email);
  await expectStatus("/clients", 403, {
    method: "POST",
    token: dbDeniedSession.accessToken,
    body: JSON.stringify({
      name: "DB Denied Client",
      email: `db-denied-client-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 25,
    }),
  });

  const crossTenantRoleUser = await createDatabasePermissionUser({
    companyId: ownerB.companyId,
    membershipCompanyId: ownerA.companyId,
    email: `rbac-cross-tenant-role-${runId}@enterpriseerp.test`,
    roleKey: "cross-tenant-crm-create",
    permissions: ["crm.create"],
  });
  const crossTenantSession = await login(crossTenantRoleUser.email);
  await expectStatus("/clients", 403, {
    method: "POST",
    token: crossTenantSession.accessToken,
    body: JSON.stringify({
      name: "Cross Tenant Role Client",
      email: `cross-tenant-role-client-${runId}@enterpriseerp.test`,
      country: "SE",
      status: "Prospect",
      revenue: 50,
    }),
  });
}

async function main() {
  if (!isLocalUrl(baseUrl) && !allowRemoteWrite) {
    throw new Error(
      `Refusing to write RBAC E2E data to ${baseUrl}. Set E2E_ALLOW_REMOTE_WRITE=true only for a disposable staging environment.`
    );
  }

  const ownerA = await registerTenant("a", "commerce");
  const ownerB = await registerTenant("b", "education");

  await verifyInheritedRolePermissions(ownerA);
  await verifyDatabasePermissionIsolation(ownerA, ownerB);

  console.log(`RBAC E2E checks passed against ${baseUrl}.`);
}

main()
  .catch((error) => {
    if (error instanceof TypeError && String(error.message).includes("fetch failed")) {
      console.error(`RBAC E2E checks could not reach ${baseUrl}. Start the API first with npm run dev:api.`);
      process.exitCode = 1;
      return;
    }

    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
