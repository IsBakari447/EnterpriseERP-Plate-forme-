import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { AuditService } from "../src/common/audit/audit.service";
import { AiService } from "../src/common/ai/ai.service";
import { AuthenticatedUser } from "../src/common/auth/current-user.decorator";
import { AuditModuleService } from "../src/modules/audit/audit.service";
import { CompanyService } from "../src/modules/company/company.service";
import { CrmService } from "../src/modules/crm/crm.service";
import { EducationService } from "../src/modules/education/education.service";
import { FacturationService } from "../src/modules/facturation/facturation.service";
import { OperationsService } from "../src/modules/operations/operations.service";
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
  assert(Number((await service.findOne(ctx.ownerA, invoiceA.id)).amount) === 750, "Invoice cross-tenant update changed data");
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

async function verifyCompany(ctx: TestContext, service: CompanyService) {
  const beforeB = await service.getCurrentCompany(ctx.ownerB);
  const updatedA = await service.updateCurrentCompany(ctx.ownerA, {
    name: "Tenant A Company Updated",
    currency: "EUR",
    language: "fr",
    companyId: ctx.companyBId,
  } as never);
  const afterB = await service.getCurrentCompany(ctx.ownerB);

  assert(updatedA.id === ctx.companyAId, "Company update must target the authenticated tenant");
  assert(updatedA.name === "Tenant A Company Updated", "Company update did not update tenant A");
  assert(afterB.name === beforeB.name, "Company update leaked into tenant B");
  assert(afterB.currency === beforeB.currency, "Company preference update leaked into tenant B");
}

async function verifyAudit(ctx: TestContext, audit: AuditService, service: AuditModuleService) {
  await audit.record({
    companyId: ctx.companyAId,
    userId: ctx.ownerA.sub,
    module: "tenant-test",
    action: "audit-a",
    entityType: "TenantAudit",
    entityId: ctx.companyAId,
  });
  await audit.record({
    companyId: ctx.companyBId,
    userId: ctx.ownerB.sub,
    module: "tenant-test",
    action: "audit-b",
    entityType: "TenantAudit",
    entityId: ctx.companyBId,
  });

  const ownerARecords = await service.list(ctx.ownerA, { module: "tenant-test" });
  const ownerBRecords = await service.list(ctx.ownerB, { module: "tenant-test" });
  const ownerAQueryingB = await service.list(ctx.ownerA, { userId: ctx.ownerB.sub, module: "tenant-test" });

  assert(ownerARecords.some((record) => record.companyId === ctx.companyAId), "Audit list did not include tenant A logs");
  assert(!ownerARecords.some((record) => record.companyId === ctx.companyBId), "Audit list leaked tenant B logs to tenant A");
  assert(ownerBRecords.some((record) => record.companyId === ctx.companyBId), "Audit list did not include tenant B logs");
  assert(!ownerBRecords.some((record) => record.companyId === ctx.companyAId), "Audit list leaked tenant A logs to tenant B");
  assert(ownerAQueryingB.length === 0, "Audit query by foreign userId leaked another tenant");
}

async function verifyOperations(ctx: TestContext, service: OperationsService) {
  const salesA = await service.createSalesOrder(ctx.ownerA, {
    number: `SO-A-${ctx.companyAId}`,
    customer: "Tenant A Customer",
    amount: 100,
    status: "pending",
  });
  const salesB = await service.createSalesOrder(ctx.ownerB, {
    number: `SO-B-${ctx.companyBId}`,
    customer: "Tenant B Customer",
    amount: 200,
    status: "pending",
    companyId: ctx.companyAId,
  } as never);
  assert(salesB.companyId === ctx.companyBId, "Sales order create must ignore frontend companyId override");
  assert(!(await service.getOrders(ctx.ownerB)).some((order) => order.id === salesA.id), "Sales orders list leaked another tenant");
  await expectNotFound(() => service.updateSalesOrder(ctx.ownerB, salesA.id, { amount: 999 }), "Sales order update cross-tenant");
  await expectNotFound(() => service.deleteSalesOrder(ctx.ownerB, salesA.id), "Sales order delete cross-tenant");
  assert(Number((await ctx.prisma.salesOrder.findUniqueOrThrow({ where: { id: salesA.id } })).amount) === 100, "Sales order cross-tenant update changed data");

  const paymentA = await service.createPayment(ctx.ownerA, {
    reference: `PAY-A-${ctx.companyAId}`,
    customer: "Tenant A Customer",
    amount: 100,
  });
  const paymentB = await service.createPayment(ctx.ownerB, {
    reference: `PAY-B-${ctx.companyBId}`,
    customer: "Tenant B Customer",
    amount: 200,
    companyId: ctx.companyAId,
  } as never);
  const invoiceAForPayment = await ctx.prisma.invoice.create({
    data: {
      companyId: ctx.companyAId,
      number: `PAY-INV-A-${ctx.companyAId}`,
      customer: "Tenant A Customer",
      amount: 125,
      due: new Date("2026-12-31"),
      status: "pending",
    },
  });
  const invoiceBForPayment = await ctx.prisma.invoice.create({
    data: {
      companyId: ctx.companyBId,
      number: `PAY-INV-B-${ctx.companyBId}`,
      customer: "Tenant B Customer",
      amount: 225,
      due: new Date("2026-12-31"),
      status: "pending",
    },
  });
  const linkedPaymentB = await service.createPayment(ctx.ownerB, {
    invoiceId: invoiceBForPayment.id,
    reference: `PAY-B-LINKED-${ctx.companyBId}`,
    customer: "Tenant B Customer",
    amount: 225,
  });
  assert(paymentB.companyId === ctx.companyBId, "Payment create must ignore frontend companyId override");
  assert(linkedPaymentB.invoiceId === invoiceBForPayment.id, "Payment create did not link a same-tenant invoice");
  assert(!(await service.listPayments(ctx.ownerB)).some((payment) => payment.id === paymentA.id), "Payments list leaked another tenant");
  await expectNotFound(
    () =>
      service.createPayment(ctx.ownerB, {
        invoiceId: invoiceAForPayment.id,
        reference: `PAY-B-CROSS-INVOICE-${ctx.companyBId}`,
        amount: 999,
      }),
    "Payment create cross-tenant invoice"
  );
  await expectNotFound(() => service.updatePayment(ctx.ownerB, paymentA.id, { amount: 999 }), "Payment update cross-tenant");
  await expectNotFound(
    () => service.updatePayment(ctx.ownerB, paymentB.id, { invoiceId: invoiceAForPayment.id }),
    "Payment update cross-tenant invoice"
  );
  await expectNotFound(() => service.deletePayment(ctx.ownerB, paymentA.id), "Payment delete cross-tenant");
  assert(
    (await ctx.prisma.payment.findUniqueOrThrow({ where: { id: paymentB.id } })).invoiceId === null,
    "Payment cross-tenant invoice update changed data"
  );

  const expenseA = await service.createExpense(ctx.ownerA, {
    label: "Tenant A Expense",
    amount: 50,
  });
  const expenseB = await service.createExpense(ctx.ownerB, {
    label: "Tenant B Expense",
    amount: 60,
    companyId: ctx.companyAId,
  } as never);
  assert(expenseB.companyId === ctx.companyBId, "Expense create must ignore frontend companyId override");
  assert(!(await service.listExpenses(ctx.ownerB)).some((expense) => expense.id === expenseA.id), "Expenses list leaked another tenant");
  await expectNotFound(() => service.updateExpense(ctx.ownerB, expenseA.id, { amount: 999 }), "Expense update cross-tenant");
  await expectNotFound(() => service.deleteExpense(ctx.ownerB, expenseA.id), "Expense delete cross-tenant");

  const reportA = await service.createReportView(ctx.ownerA, {
    name: `Tenant A Report ${ctx.companyAId}`,
    type: "executive",
  });
  const reportB = await service.createReportView(ctx.ownerB, {
    name: `Tenant B Report ${ctx.companyBId}`,
    type: "executive",
    companyId: ctx.companyAId,
  } as never);
  assert(reportB.companyId === ctx.companyBId, "Report view create must ignore frontend companyId override");
  assert(!(await service.listReportViews(ctx.ownerB)).some((report) => report.id === reportA.id), "Report views list leaked another tenant");
  await expectNotFound(() => service.updateReportView(ctx.ownerB, reportA.id, { name: "Compromised" }), "Report view update cross-tenant");
  await expectNotFound(() => service.deleteReportView(ctx.ownerB, reportA.id), "Report view delete cross-tenant");

  const appointmentA = await service.createAppointment(ctx.ownerA, {
    title: "Tenant A Appointment",
    scheduledAt: "2026-12-31T10:00:00.000Z",
  });
  const appointmentB = await service.createAppointment(ctx.ownerB, {
    title: "Tenant B Appointment",
    scheduledAt: "2026-12-31T11:00:00.000Z",
    companyId: ctx.companyAId,
  } as never);
  assert(appointmentB.companyId === ctx.companyBId, "Appointment create must ignore frontend companyId override");
  assert(!(await service.getAppointmentsItems(ctx.ownerB)).some((appointment) => appointment.id === appointmentA.id), "Appointments list leaked another tenant");
  await expectNotFound(() => service.updateAppointment(ctx.ownerB, appointmentA.id, { title: "Compromised" }), "Appointment update cross-tenant");
  await expectNotFound(() => service.deleteAppointment(ctx.ownerB, appointmentA.id), "Appointment delete cross-tenant");

  const productionA = await service.createProductionOrder(ctx.ownerA, {
    number: `OF-A-${ctx.companyAId}`,
    productName: "Tenant A Product",
    quantity: 10,
  });
  const productionB = await service.createProductionOrder(ctx.ownerB, {
    number: `OF-B-${ctx.companyBId}`,
    productName: "Tenant B Product",
    quantity: 20,
    companyId: ctx.companyAId,
  } as never);
  assert(productionB.companyId === ctx.companyBId, "Production order create must ignore frontend companyId override");
  assert(!(await service.getProductionItems(ctx.ownerB)).some((order) => order.id === productionA.id), "Production list leaked another tenant");
  await expectNotFound(() => service.updateProductionOrder(ctx.ownerB, productionA.id, { quantity: 999 }), "Production update cross-tenant");
  await expectNotFound(() => service.deleteProductionOrder(ctx.ownerB, productionA.id), "Production delete cross-tenant");

  const suggestionsB = await service.getAssistantSuggestions(ctx.ownerB);
  assert(!suggestionsB.some((suggestion) => suggestion.value === ctx.companyAId), "Assistant suggestions leaked tenant A identifiers");
}

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();

  const audit = new AuditService(prisma);
  const ai = new AiService(audit, prisma);
  const ctx = await createContext(prisma);

  try {
    await verifyCrm(ctx, new CrmService(prisma, audit));
    await verifyStock(ctx, new StockService(prisma, audit));
    await verifyInvoices(ctx, new FacturationService(prisma, audit));
    await verifyEducation(ctx, new EducationService(prisma));
    await verifyUsers(ctx, new UsersService(prisma, audit));
    await verifyCompany(ctx, new CompanyService(prisma, audit));
    await verifyAudit(ctx, audit, new AuditModuleService(prisma));
    await verifyOperations(ctx, new OperationsService(ai, prisma));
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
