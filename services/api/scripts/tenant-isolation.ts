import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { AuditService } from "../src/common/audit/audit.service";
import { AuthenticatedUser } from "../src/common/auth/current-user.decorator";
import { CrmService } from "../src/modules/crm/crm.service";
import { EducationService } from "../src/modules/education/education.service";
import { FacturationService } from "../src/modules/facturation/facturation.service";
import { StockService } from "../src/modules/stock/stock.service";
import { UsersService } from "../src/modules/users/users.service";
import { PrismaService } from "../src/prisma.service";

type TestContext = {
  prisma: PrismaService;
  companyAId: string;
  companyBId: string;
  ownerA: AuthenticatedUser;
  ownerB: AuthenticatedUser;
};

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function expectNotFound(action: () => Promise<unknown>, label: string) {
  try {
    await action();
  } catch (error) {
    if (error instanceof NotFoundException) {
      return;
    }

    throw error;
  }

  throw new Error(`${label}: expected NotFoundException`);
}

async function expectForbidden(action: () => Promise<unknown>, label: string) {
  try {
    await action();
  } catch (error) {
    if (error instanceof ForbiddenException) {
      return;
    }

    throw error;
  }

  throw new Error(`${label}: expected ForbiddenException`);
}

async function createContext(prisma: PrismaService): Promise<TestContext> {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const companyA = await prisma.company.create({
    data: {
      name: `Tenant Gate Company A ${suffix}`,
      sector: "commerce",
      country: "SE",
      currency: "SEK",
      language: "en",
      onboardingCompleted: true,
    },
  });
  const companyB = await prisma.company.create({
    data: {
      name: `Tenant Gate Company B ${suffix}`,
      sector: "education",
      country: "CM",
      currency: "XAF",
      language: "en",
      onboardingCompleted: true,
    },
  });

  const [userA, userB] = await Promise.all([
    prisma.user.create({
      data: {
        companyId: companyA.id,
        name: "Tenant Owner A",
        email: `tenant-a-${suffix}@enterpriseerp.test`,
        role: "OWNER",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        companyId: companyB.id,
        name: "Tenant Owner B",
        email: `tenant-b-${suffix}@enterpriseerp.test`,
        role: "OWNER",
        status: "ACTIVE",
      },
    }),
  ]);

  return {
    prisma,
    companyAId: companyA.id,
    companyBId: companyB.id,
    ownerA: {
      sub: userA.id,
      email: userA.email,
      companyId: companyA.id,
      role: userA.role,
      sessionId: `tenant-gate-a-${suffix}`,
    },
    ownerB: {
      sub: userB.id,
      email: userB.email,
      companyId: companyB.id,
      role: userB.role,
      sessionId: `tenant-gate-b-${suffix}`,
    },
  };
}

async function verifyCrm(ctx: TestContext, service: CrmService) {
  const clientA = await service.create(ctx.ownerA, {
    name: "Tenant A Client",
    email: `client-a-${ctx.companyAId}@enterpriseerp.test`,
    country: "SE",
    status: "Prospect",
    revenue: 1000,
  });
  const clientB = await service.create(ctx.ownerB, {
    name: "Tenant B Client",
    email: `client-b-${ctx.companyBId}@enterpriseerp.test`,
    country: "CM",
    status: "Prospect",
    revenue: 2000,
    companyId: ctx.companyAId,
  } as never);

  assert(clientB.companyId === ctx.companyBId, "CRM create must ignore frontend companyId override");
  assert(!(await service.findAll(ctx.ownerB)).some((client) => client.id === clientA.id), "CRM list leaked another tenant");
  await expectNotFound(() => service.findOne(ctx.ownerB, clientA.id), "CRM read cross-tenant");
  await expectNotFound(() => service.update(ctx.ownerB, clientA.id, { name: "Compromised" }), "CRM update cross-tenant");
  await expectNotFound(() => service.remove(ctx.ownerB, clientA.id), "CRM delete cross-tenant");
  assert((await service.findOne(ctx.ownerA, clientA.id)).name === "Tenant A Client", "CRM cross-tenant update changed data");
}

async function verifyStock(ctx: TestContext, service: StockService) {
  const productA = await service.create(ctx.ownerA, {
    name: "Tenant A Product",
    sku: `SKU-A-${ctx.companyAId}`,
    quantity: 10,
    status: "Available",
    value: 100,
  });
  const productB = await service.create(ctx.ownerB, {
    name: "Tenant B Product",
    sku: `SKU-B-${ctx.companyBId}`,
    quantity: 8,
    status: "Available",
    value: 200,
    companyId: ctx.companyAId,
  } as never);

  assert(productB.companyId === ctx.companyBId, "Stock create must ignore frontend companyId override");
  assert(!(await service.findAll(ctx.ownerB)).some((product) => product.id === productA.id), "Stock list leaked another tenant");
  await expectNotFound(() => service.findOne(ctx.ownerB, productA.id), "Stock read cross-tenant");
  await expectNotFound(() => service.update(ctx.ownerB, productA.id, { quantity: 99 }), "Stock update cross-tenant");
  await expectNotFound(() => service.remove(ctx.ownerB, productA.id), "Stock delete cross-tenant");
  assert((await service.findOne(ctx.ownerA, productA.id)).quantity === 10, "Stock cross-tenant update changed data");
}

async function verifyInvoices(ctx: TestContext, service: FacturationService) {
  const invoiceA = await service.create(ctx.ownerA, {
    number: `INV-A-${ctx.companyAId}`,
    customer: "Tenant A Client",
    amount: 750,
    due: "2026-12-31",
    status: "Pending",
  });
  const invoiceB = await service.create(ctx.ownerB, {
    number: `INV-B-${ctx.companyBId}`,
    customer: "Tenant B Client",
    amount: 850,
    due: "2026-12-31",
    status: "Pending",
    companyId: ctx.companyAId,
  } as never);

  assert(invoiceB.companyId === ctx.companyBId, "Invoice create must ignore frontend companyId override");
  assert(!(await service.findAll(ctx.ownerB)).some((invoice) => invoice.id === invoiceA.id), "Invoice list leaked another tenant");
  await expectNotFound(() => service.findOne(ctx.ownerB, invoiceA.id), "Invoice read cross-tenant");
  await expectNotFound(() => service.update(ctx.ownerB, invoiceA.id, { amount: 1 }), "Invoice update cross-tenant");
  await expectNotFound(() => service.remove(ctx.ownerB, invoiceA.id), "Invoice delete cross-tenant");
  assert((await service.findOne(ctx.ownerA, invoiceA.id)).amount === 750, "Invoice cross-tenant update changed data");
}

async function verifyEducation(ctx: TestContext, service: EducationService) {
  const studentA = (await service.create(ctx.ownerA, "students", {
    matricule: `STU-A-${ctx.companyAId}`,
    firstName: "Tenant",
    lastName: "Student A",
  })) as { id: string; companyId: string; firstName: string };
  const studentB = (await service.create(ctx.ownerB, "students", {
    matricule: `STU-B-${ctx.companyBId}`,
    firstName: "Tenant",
    lastName: "Student B",
    companyId: ctx.companyAId,
  })) as { id: string; companyId: string };

  assert(studentB.companyId === ctx.companyBId, "Education create must ignore frontend companyId override");
  assert(
    !((await service.findAll(ctx.ownerB, "students")) as { id: string }[]).some((student) => student.id === studentA.id),
    "Education list leaked another tenant"
  );
  await expectNotFound(() => service.findOne(ctx.ownerB, "students", studentA.id), "Education read cross-tenant");
  await expectNotFound(() => service.update(ctx.ownerB, "students", studentA.id, { firstName: "Compromised" }), "Education update cross-tenant");
  await expectNotFound(() => service.remove(ctx.ownerB, "students", studentA.id), "Education delete cross-tenant");
  assert(((await service.findOne(ctx.ownerA, "students", studentA.id)) as { firstName: string }).firstName === "Tenant", "Education cross-tenant update changed data");
}

async function verifyUsers(ctx: TestContext, service: UsersService) {
  const userA = await service.create(ctx.ownerA, {
    name: "Tenant A Employee",
    email: `employee-a-${ctx.companyAId}@enterpriseerp.test`,
  });
  const userB = await service.create(ctx.ownerB, {
    name: "Tenant B Employee",
    email: `employee-b-${ctx.companyBId}@enterpriseerp.test`,
    companyId: ctx.companyAId,
  } as never);
  const storedUserB = await ctx.prisma.user.findUniqueOrThrow({ where: { id: userB.id } });

  assert(storedUserB.companyId === ctx.companyBId, "Users create must ignore frontend companyId override");
  assert(!(await service.findAll(ctx.ownerB)).some((user) => user.id === userA.id), "Users list leaked another tenant");
  await expectNotFound(() => service.findOne(ctx.ownerB, userA.id), "Users read cross-tenant");
  await expectNotFound(() => service.update(ctx.ownerB, userA.id, { name: "Compromised" }), "Users update cross-tenant");
  await expectNotFound(() => service.remove(ctx.ownerB, userA.id), "Users delete cross-tenant");

  const managerB: AuthenticatedUser = {
    ...ctx.ownerB,
    role: "MANAGER" as UserRole,
    permissions: [],
  };
  await expectForbidden(
    () =>
      service.create(managerB, {
        name: "Privilege Escalation Attempt",
        email: `role-escalation-${ctx.companyBId}@enterpriseerp.test`,
        role: "OWNER",
      }),
    "Users role escalation"
  );
}

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();

  const audit = new AuditService(prisma);
  const ctx = await createContext(prisma);

  try {
    await verifyCrm(ctx, new CrmService(prisma, audit));
    await verifyStock(ctx, new StockService(prisma, audit));
    await verifyInvoices(ctx, new FacturationService(prisma, audit));
    await verifyEducation(ctx, new EducationService(prisma));
    await verifyUsers(ctx, new UsersService(prisma, audit));
    console.log("Tenant isolation checks passed.");
  } finally {
    await Promise.allSettled([
      prisma.company.delete({ where: { id: ctx.companyAId } }),
      prisma.company.delete({ where: { id: ctx.companyBId } }),
    ]);
    await prisma.$disconnect();
  }
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
});
