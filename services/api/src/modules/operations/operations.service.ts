import { Injectable, NotFoundException } from "@nestjs/common";
import { AiService } from "../../common/ai/ai.service";
import { AuthenticatedUser, requireTenant } from "../../common/auth/current-user.decorator";
import { PrismaService } from "../../prisma.service";

type OperationKpi = {
  labelKey: string;
  value: string;
  change?: string;
  changeKey?: string;
};

type OperationItem = {
  id: string;
  title?: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  value?: string;
  meta?: string;
  metaKey?: string;
  status?: string;
  statusKey?: string;
  number?: string;
  customer?: string;
  amount?: string;
  date?: string;
  name?: string;
  role?: string;
  roleKey?: string;
  contract?: string;
  email?: string;
  phone?: string;
  department?: string;
  key?: string;
};

export type SalesOrderInput = {
  number: string;
  customer: string;
  amount?: number;
  status?: string;
  orderDate?: string;
  dueDate?: string | null;
  notes?: string | null;
};

export type PaymentInput = {
  invoiceId?: string | null;
  reference: string;
  customer?: string | null;
  amount?: number;
  method?: string | null;
  status?: string;
  paidAt?: string;
};

export type ExpenseInput = {
  label: string;
  category?: string | null;
  supplier?: string | null;
  amount?: number;
  status?: string;
  expenseDate?: string;
};

export type ReportViewInput = {
  name: string;
  type?: string;
  status?: string;
  schedule?: string | null;
  lastRunAt?: string | null;
};

export type AppointmentInput = {
  title: string;
  clientName?: string | null;
  scheduledAt: string;
  endAt?: string | null;
  status?: string;
  location?: string | null;
  notes?: string | null;
};

export type ProductionOrderInput = {
  number: string;
  productName: string;
  quantity?: number;
  plannedCost?: number;
  actualCost?: number | null;
  progress?: number;
  status?: string;
  dueDate?: string | null;
};

const money = (value: number, currency = "EUR") =>
  `${Math.round(value).toLocaleString("fr-FR")} ${currency}`;

const percent = (value: number) =>
  `${Math.round(value)}%`;

const isPaid = (status?: string | null) => {
  const value = String(status ?? "").toLowerCase();
  return value.includes("paid") || value.includes("pay") || value.includes("paye");
};

const isClosed = (status?: string | null) => {
  const value = String(status ?? "").toLowerCase();
  return (
    value.includes("confirmed") ||
    value.includes("delivered") ||
    value.includes("closed") ||
    value.includes("won") ||
    value.includes("paid")
  );
};

const optionalDate = (value?: string | null) =>
  value ? new Date(value) : null;

const requiredDate = (value: string) =>
  new Date(value);

@Injectable()
export class OperationsService {
  constructor(
    private readonly ai: AiService,
    private readonly prisma: PrismaService
  ) {}

  private async getCompany(user: AuthenticatedUser) {
    const companyId = requireTenant(user);
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { currency: true },
    });

    return {
      companyId,
      currency: company?.currency ?? "EUR",
    };
  }

  async getSalesKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId, currency } = await this.getCompany(user);
    const salesOrders = await this.prisma.salesOrder.findMany({ where: { companyId } });
    const invoices = salesOrders.length ? [] : await this.prisma.invoice.findMany({ where: { companyId } });
    const totalSales =
      salesOrders.reduce((sum, order) => sum + order.amount, 0) ||
      invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalOrders = salesOrders.length || invoices.length;
    const averageBasket = totalOrders ? totalSales / totalOrders : 0;
    const closedOrders = salesOrders.length
      ? salesOrders.filter((order) => isClosed(order.status)).length
      : invoices.filter((invoice) => isPaid(invoice.status)).length;
    const conversion = totalOrders ? (closedOrders / totalOrders) * 100 : 0;

    return [
      { labelKey: "api.sales.kpi.monthlySales", value: money(totalSales, currency) },
      { labelKey: "api.sales.kpi.orders", value: String(totalOrders) },
      { labelKey: "api.sales.kpi.averageBasket", value: money(averageBasket, currency) },
      { labelKey: "api.sales.kpi.conversion", value: percent(conversion) },
    ];
  }

  async getOrders(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId, currency } = await this.getCompany(user);
    const salesOrders = await this.prisma.salesOrder.findMany({
      where: { companyId },
      orderBy: { orderDate: "desc" },
      take: 12,
    });

    if (salesOrders.length > 0) {
      return salesOrders.map((order) => ({
        id: order.id,
        number: order.number,
        title: order.number,
        customer: order.customer,
        subtitle: order.customer,
        amount: money(order.amount, currency),
        value: money(order.amount, currency),
        date: order.orderDate.toISOString(),
        meta: order.orderDate.toLocaleDateString("fr-FR"),
        status: order.status,
      }));
    }

    const invoices = await this.prisma.invoice.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      title: invoice.number,
      customer: invoice.customer,
      subtitle: invoice.customer,
      amount: money(invoice.amount, currency),
      value: money(invoice.amount, currency),
      date: invoice.due.toISOString(),
      meta: invoice.due.toLocaleDateString("fr-FR"),
      status: invoice.status,
    }));
  }

  async createSalesOrder(user: AuthenticatedUser, data: SalesOrderInput) {
    const { companyId } = await this.getCompany(user);

    return this.prisma.salesOrder.create({
      data: {
        companyId,
        number: data.number,
        customer: data.customer,
        amount: data.amount ?? 0,
        status: data.status ?? "pending",
        orderDate: data.orderDate ? new Date(data.orderDate) : undefined,
        dueDate: optionalDate(data.dueDate),
        notes: data.notes ?? undefined,
      },
    });
  }

  async updateSalesOrder(user: AuthenticatedUser, id: string, data: Partial<SalesOrderInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requireSalesOrder(companyId, id);

    return this.prisma.salesOrder.update({
      where: { id },
      data: {
        number: data.number,
        customer: data.customer,
        amount: data.amount,
        status: data.status,
        orderDate: data.orderDate ? new Date(data.orderDate) : undefined,
        dueDate: data.dueDate === undefined ? undefined : optionalDate(data.dueDate),
        notes: data.notes,
      },
    });
  }

  async deleteSalesOrder(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    await this.requireSalesOrder(companyId, id);
    return this.prisma.salesOrder.delete({ where: { id } });
  }

  async getReportsKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId } = await this.getCompany(user);
    const [reportViews, scheduledReports, auditCount, productAlerts, overdueInvoices] = await Promise.all([
      this.prisma.reportView.count({ where: { companyId } }),
      this.prisma.reportView.count({ where: { companyId, schedule: { not: null } } }),
      this.prisma.auditLog.count({ where: { companyId } }),
      this.prisma.product.count({ where: { companyId, quantity: { lte: 5 } } }),
      this.countOverdueInvoices(companyId),
    ]);

    return [
      { labelKey: "api.reports.kpi.savedViews", value: String(reportViews) },
      { labelKey: "api.reports.kpi.exports", value: "0" },
      { labelKey: "api.reports.kpi.scheduled", value: String(scheduledReports) },
      { labelKey: "api.reports.kpi.insights", value: String(auditCount + productAlerts + overdueInvoices) },
    ];
  }

  async getReportsItems(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId } = await this.getCompany(user);
    const reportViews = await this.prisma.reportView.findMany({
      where: { companyId },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });

    if (reportViews.length > 0) {
      return reportViews.map((report) => ({
        id: report.id,
        title: report.name,
        subtitle: report.schedule ?? report.type,
        value: report.type,
        status: report.status,
      }));
    }

    const [clients, products, invoices] = await Promise.all([
      this.prisma.client.count({ where: { companyId } }),
      this.prisma.product.count({ where: { companyId } }),
      this.prisma.invoice.count({ where: { companyId } }),
    ]);

    return [
      {
        id: "report-crm",
        titleKey: "api.reports.item.executive.title",
        subtitle: `${clients} clients, ${products} produits, ${invoices} factures`,
        value: "API",
        statusKey: "status.ready",
      },
    ];
  }

  async getAccountingKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId, currency } = await this.getCompany(user);
    const [invoices, payments, expenses, pendingExpenses] = await Promise.all([
      this.prisma.invoice.findMany({ where: { companyId } }),
      this.prisma.payment.findMany({ where: { companyId } }),
      this.prisma.expense.findMany({ where: { companyId } }),
      this.prisma.expense.count({ where: { companyId, status: { contains: "pending", mode: "insensitive" } } }),
    ]);
    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0) ||
      invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const unpaid = invoices
      .filter((invoice) => !isPaid(invoice.status))
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices.filter((invoice) => !isPaid(invoice.status) && invoice.due < new Date()).length;

    return [
      { labelKey: "api.accounting.kpi.revenue", value: money(revenue, currency) },
      { labelKey: "api.accounting.kpi.expenses", value: money(expenseTotal, currency) },
      { labelKey: "api.accounting.kpi.taxes", value: money(0, currency) },
      { labelKey: "api.accounting.kpi.reconciliations", value: String(overdue + pendingExpenses), change: money(unpaid, currency) },
    ];
  }

  async getAccountingItems(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId, currency } = await this.getCompany(user);
    const expenses = await this.prisma.expense.findMany({
      where: { companyId },
      orderBy: { expenseDate: "desc" },
      take: 10,
    });

    if (expenses.length > 0) {
      return expenses.map((expense) => ({
        id: expense.id,
        title: expense.label,
        subtitle: expense.supplier ?? expense.category ?? "",
        value: money(expense.amount, currency),
        status: expense.status,
      }));
    }

    const overdueInvoices = await this.findOverdueInvoices(companyId, 10);
    return overdueInvoices.map((invoice) => ({
      id: invoice.id,
      title: invoice.number,
      subtitle: invoice.customer,
      value: money(invoice.amount, currency),
      statusKey: "status.overdue",
    }));
  }

  async listPayments(user: AuthenticatedUser) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.payment.findMany({ where: { companyId }, orderBy: { paidAt: "desc" } });
  }

  async createPayment(user: AuthenticatedUser, data: PaymentInput) {
    const { companyId } = await this.getCompany(user);
    const invoiceId = await this.resolveTenantInvoiceId(companyId, data.invoiceId);

    return this.prisma.payment.create({
      data: {
        companyId,
        invoiceId: invoiceId ?? undefined,
        reference: data.reference,
        customer: data.customer ?? undefined,
        amount: data.amount ?? 0,
        method: data.method ?? undefined,
        status: data.status ?? "received",
        paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      },
    });
  }

  async updatePayment(user: AuthenticatedUser, id: string, data: Partial<PaymentInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requirePayment(companyId, id);
    const invoiceId =
      Object.prototype.hasOwnProperty.call(data, "invoiceId")
        ? await this.resolveTenantInvoiceId(companyId, data.invoiceId)
        : undefined;

    const payment = await this.prisma.payment.updateMany({
      where: { id, companyId },
      data: {
        invoiceId,
        reference: data.reference,
        customer: data.customer,
        amount: data.amount,
        method: data.method,
        status: data.status,
        paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      },
    });

    if (payment.count !== 1) throw new NotFoundException("Payment not found");
    return this.requirePayment(companyId, id);
  }

  async deletePayment(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    const existing = await this.requirePayment(companyId, id);
    const payment = await this.prisma.payment.deleteMany({ where: { id, companyId } });
    if (payment.count !== 1) throw new NotFoundException("Payment not found");
    return existing;
  }

  async listExpenses(user: AuthenticatedUser) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.expense.findMany({ where: { companyId }, orderBy: { expenseDate: "desc" } });
  }

  async createExpense(user: AuthenticatedUser, data: ExpenseInput) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.expense.create({
      data: {
        companyId,
        label: data.label,
        category: data.category ?? undefined,
        supplier: data.supplier ?? undefined,
        amount: data.amount ?? 0,
        status: data.status ?? "pending",
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });
  }

  async updateExpense(user: AuthenticatedUser, id: string, data: Partial<ExpenseInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requireExpense(companyId, id);
    return this.prisma.expense.update({
      where: { id },
      data: {
        label: data.label,
        category: data.category,
        supplier: data.supplier,
        amount: data.amount,
        status: data.status,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });
  }

  async deleteExpense(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    await this.requireExpense(companyId, id);
    return this.prisma.expense.delete({ where: { id } });
  }

  async getHrKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId } = await this.getCompany(user);
    const [users, activeUsers, pendingInvitations] = await Promise.all([
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.user.count({ where: { companyId, status: "ACTIVE" } }),
      this.prisma.invitation.count({ where: { companyId, status: "PENDING" } }),
    ]);

    return [
      { labelKey: "api.hr.kpi.employees", value: String(users) },
      { labelKey: "api.hr.kpi.present", value: String(activeUsers) },
      { labelKey: "api.hr.kpi.leaves", value: "0" },
      { labelKey: "api.hr.kpi.payroll", value: String(pendingInvitations), changeKey: "status.pending" },
    ];
  }

  async getEmployees(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId } = await this.getCompany(user);
    const users = await this.prisma.user.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    return users.map((employee) => ({
      id: employee.id,
      name: employee.name,
      title: employee.name,
      role: employee.jobTitle ?? employee.role,
      subtitle: employee.jobTitle ?? employee.role,
      contract: employee.role,
      value: employee.role,
      status: employee.status,
      email: employee.email,
      phone: employee.phone ?? undefined,
      department: employee.department ?? undefined,
    }));
  }

  async getAppointmentsKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId } = await this.getCompany(user);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const [today, availableSlots, toConfirm, noShowRisk] = await Promise.all([
      this.prisma.appointment.count({ where: { companyId, scheduledAt: { gte: start, lt: end } } }),
      this.prisma.appointment.count({ where: { companyId, status: { contains: "available", mode: "insensitive" } } }),
      this.prisma.appointment.count({ where: { companyId, status: { contains: "confirm", mode: "insensitive" } } }),
      this.prisma.appointment.count({ where: { companyId, status: { contains: "risk", mode: "insensitive" } } }),
    ]);

    return [
      { labelKey: "api.appointments.kpi.today", value: String(today), changeKey: "trend.today" },
      { labelKey: "api.appointments.kpi.availableSlots", value: String(availableSlots), changeKey: "common.available" },
      { labelKey: "api.appointments.kpi.toConfirm", value: String(toConfirm), changeKey: "trend.priority" },
      { labelKey: "api.appointments.kpi.noShowRisk", value: String(noShowRisk), changeKey: "trend.watch" },
    ];
  }

  async getAppointmentsItems(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId } = await this.getCompany(user);
    const appointments = await this.prisma.appointment.findMany({
      where: { companyId },
      orderBy: { scheduledAt: "asc" },
      take: 12,
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
      subtitle: appointment.clientName ?? appointment.location ?? "",
      value: appointment.scheduledAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      meta: appointment.scheduledAt.toLocaleDateString("fr-FR"),
      status: appointment.status,
    }));
  }

  async createAppointment(user: AuthenticatedUser, data: AppointmentInput) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.appointment.create({
      data: {
        companyId,
        title: data.title,
        clientName: data.clientName ?? undefined,
        scheduledAt: requiredDate(data.scheduledAt),
        endAt: optionalDate(data.endAt),
        status: data.status ?? "scheduled",
        location: data.location ?? undefined,
        notes: data.notes ?? undefined,
      },
    });
  }

  async updateAppointment(user: AuthenticatedUser, id: string, data: Partial<AppointmentInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requireAppointment(companyId, id);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        title: data.title,
        clientName: data.clientName,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        endAt: data.endAt === undefined ? undefined : optionalDate(data.endAt),
        status: data.status,
        location: data.location,
        notes: data.notes,
      },
    });
  }

  async deleteAppointment(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    await this.requireAppointment(companyId, id);
    return this.prisma.appointment.delete({ where: { id } });
  }

  async getProductionKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId, currency } = await this.getCompany(user);
    const [productionOrders, products] = await Promise.all([
      this.prisma.productionOrder.findMany({ where: { companyId } }),
      this.prisma.product.findMany({ where: { companyId } }),
    ]);
    const stockValue = products.reduce((sum, product) => sum + product.value, 0);
    const lowStock = products.filter((product) => product.quantity <= 5).length;
    const averageYield = productionOrders.length
      ? productionOrders.reduce((sum, order) => sum + order.progress, 0) / productionOrders.length
      : 0;
    const productionCost = productionOrders.reduce(
      (sum, order) => sum + (order.actualCost ?? order.plannedCost),
      0
    );

    return [
      { labelKey: "api.production.kpi.orders", value: String(productionOrders.length), changeKey: "trend.live" },
      { labelKey: "api.production.kpi.yield", value: percent(averageYield) },
      { labelKey: "api.production.kpi.costs", value: money(productionCost || stockValue, currency), changeKey: "trend.watch" },
      { labelKey: "api.production.kpi.qualityAlerts", value: String(lowStock), changeKey: "trend.action" },
    ];
  }

  async getProductionItems(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId, currency } = await this.getCompany(user);
    const productionOrders = await this.prisma.productionOrder.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (productionOrders.length > 0) {
      return productionOrders.map((order) => ({
        id: order.id,
        title: order.number,
        subtitle: order.productName,
        value: `${order.progress}%`,
        meta: money(order.actualCost ?? order.plannedCost, currency),
        status: order.status,
      }));
    }

    const products = await this.prisma.product.findMany({
      where: { companyId, quantity: { lte: 5 } },
      orderBy: { quantity: "asc" },
      take: 10,
    });

    return products.map((product) => ({
      id: product.id,
      title: product.name,
      subtitle: product.sku,
      value: `${product.quantity}`,
      meta: money(product.value, currency),
      statusKey: "status.watch",
    }));
  }

  async createProductionOrder(user: AuthenticatedUser, data: ProductionOrderInput) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.productionOrder.create({
      data: {
        companyId,
        number: data.number,
        productName: data.productName,
        quantity: data.quantity ?? 0,
        plannedCost: data.plannedCost ?? 0,
        actualCost: data.actualCost ?? undefined,
        progress: data.progress ?? 0,
        status: data.status ?? "planned",
        dueDate: optionalDate(data.dueDate),
      },
    });
  }

  async updateProductionOrder(user: AuthenticatedUser, id: string, data: Partial<ProductionOrderInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requireProductionOrder(companyId, id);
    return this.prisma.productionOrder.update({
      where: { id },
      data: {
        number: data.number,
        productName: data.productName,
        quantity: data.quantity,
        plannedCost: data.plannedCost,
        actualCost: data.actualCost,
        progress: data.progress,
        status: data.status,
        dueDate: data.dueDate === undefined ? undefined : optionalDate(data.dueDate),
      },
    });
  }

  async deleteProductionOrder(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    await this.requireProductionOrder(companyId, id);
    return this.prisma.productionOrder.delete({ where: { id } });
  }

  async getAssistantKpis(user: AuthenticatedUser): Promise<OperationKpi[]> {
    const { companyId } = await this.getCompany(user);
    const [auditCount, overdueInvoices, lowStockProducts, appointmentsToConfirm, productionAlerts] = await Promise.all([
      this.prisma.auditLog.count({ where: { companyId } }),
      this.countOverdueInvoices(companyId),
      this.prisma.product.count({ where: { companyId, quantity: { lte: 5 } } }),
      this.prisma.appointment.count({ where: { companyId, status: { contains: "confirm", mode: "insensitive" } } }),
      this.prisma.productionOrder.count({ where: { companyId, status: { contains: "risk", mode: "insensitive" } } }),
    ]);

    return [
      { labelKey: "ai.kpi.analyses", value: String(auditCount) },
      { labelKey: "ai.kpi.alerts", value: String(overdueInvoices + lowStockProducts + appointmentsToConfirm + productionAlerts) },
      { labelKey: "ai.kpi.reports", value: String(await this.prisma.reportView.count({ where: { companyId } })) },
      { labelKey: "ai.kpi.savedTime", value: "0 h" },
    ];
  }

  async getAssistantSuggestions(user: AuthenticatedUser): Promise<OperationItem[]> {
    const { companyId } = await this.getCompany(user);
    const [overdueInvoices, lowStockProducts, inactiveClients] = await Promise.all([
      this.countOverdueInvoices(companyId),
      this.prisma.product.count({ where: { companyId, quantity: { lte: 5 } } }),
      this.prisma.client.count({ where: { companyId, status: { contains: "follow", mode: "insensitive" } } }),
    ]);

    const suggestions: OperationItem[] = [];

    if (inactiveClients > 0) {
      suggestions.push({ id: "followups", key: "ai.suggestion.followups", value: String(inactiveClients) });
    }

    if (overdueInvoices > 0) {
      suggestions.push({ id: "finance", key: "ai.suggestion.finance", value: String(overdueInvoices) });
    }

    if (lowStockProducts > 0) {
      suggestions.push({ id: "low-stock", key: "ai.suggestion.lowStock", value: String(lowStockProducts) });
    }

    return suggestions;
  }

  async listReportViews(user: AuthenticatedUser) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.reportView.findMany({ where: { companyId }, orderBy: { updatedAt: "desc" } });
  }

  async createReportView(user: AuthenticatedUser, data: ReportViewInput) {
    const { companyId } = await this.getCompany(user);
    return this.prisma.reportView.create({
      data: {
        companyId,
        name: data.name,
        type: data.type ?? "custom",
        status: data.status ?? "ready",
        schedule: data.schedule ?? undefined,
        lastRunAt: optionalDate(data.lastRunAt),
      },
    });
  }

  async updateReportView(user: AuthenticatedUser, id: string, data: Partial<ReportViewInput>) {
    const { companyId } = await this.getCompany(user);
    await this.requireReportView(companyId, id);
    return this.prisma.reportView.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        status: data.status,
        schedule: data.schedule,
        lastRunAt: data.lastRunAt === undefined ? undefined : optionalDate(data.lastRunAt),
      },
    });
  }

  async deleteReportView(user: AuthenticatedUser, id: string) {
    const { companyId } = await this.getCompany(user);
    await this.requireReportView(companyId, id);
    return this.prisma.reportView.delete({ where: { id } });
  }

  createAssistantAnswer(user: AuthenticatedUser, question: string, locale = "fr") {
    return this.ai.createAnswer(user, question, locale);
  }

  async getSettingsSummary(user: AuthenticatedUser) {
    const { companyId } = await this.getCompany(user);
    const [users, roles, auditLogs] = await Promise.all([
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.role.count({ where: { companyId } }),
      this.prisma.auditLog.count({ where: { companyId } }),
    ]);

    return {
      kpis: [
        { labelKey: "settings.kpi.users", value: String(users) },
        { labelKey: "settings.kpi.roles", value: String(roles) },
        { labelKey: "settings.kpi.languages", value: "1" },
        { labelKey: "settings.kpi.security", value: String(auditLogs), changeKey: "settings.kpi.securityActive" },
      ],
      security: {
        twoFactor: false,
        audit: auditLogs > 0,
        backups: null,
      },
    };
  }

  private countOverdueInvoices(companyId: string) {
    return this.prisma.invoice.count({
      where: {
        companyId,
        due: { lt: new Date() },
        NOT: { status: { contains: "paid", mode: "insensitive" } },
      },
    });
  }

  private findOverdueInvoices(companyId: string, take: number) {
    return this.prisma.invoice.findMany({
      where: {
        companyId,
        due: { lt: new Date() },
        NOT: { status: { contains: "paid", mode: "insensitive" } },
      },
      orderBy: { due: "asc" },
      take,
    });
  }

  private async requireSalesOrder(companyId: string, id: string) {
    const item = await this.prisma.salesOrder.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Sales order not found");
    return item;
  }

  private async requirePayment(companyId: string, id: string) {
    const item = await this.prisma.payment.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Payment not found");
    return item;
  }

  private async resolveTenantInvoiceId(companyId: string, invoiceId?: string | null) {
    if (invoiceId === undefined) return undefined;
    const normalizedInvoiceId = invoiceId?.trim();
    if (!normalizedInvoiceId) return null;

    const invoice = await this.prisma.invoice.findFirst({
      where: { id: normalizedInvoiceId, companyId },
      select: { id: true },
    });

    if (!invoice) throw new NotFoundException("Invoice not found");
    return invoice.id;
  }

  private async requireExpense(companyId: string, id: string) {
    const item = await this.prisma.expense.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Expense not found");
    return item;
  }

  private async requireReportView(companyId: string, id: string) {
    const item = await this.prisma.reportView.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Report view not found");
    return item;
  }

  private async requireAppointment(companyId: string, id: string) {
    const item = await this.prisma.appointment.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Appointment not found");
    return item;
  }

  private async requireProductionOrder(companyId: string, id: string) {
    const item = await this.prisma.productionOrder.findFirst({ where: { id, companyId } });
    if (!item) throw new NotFoundException("Production order not found");
    return item;
  }
}
