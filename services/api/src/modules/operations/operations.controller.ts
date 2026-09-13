import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import {
  AssistantChatDto,
  CreateAppointmentDto,
  CreateExpenseDto,
  CreatePaymentDto,
  CreateProductionOrderDto,
  CreateReportViewDto,
  CreateSalesOrderDto,
  UpdateAppointmentDto,
  UpdateExpenseDto,
  UpdatePaymentDto,
  UpdateProductionOrderDto,
  UpdateReportViewDto,
  UpdateSalesOrderDto,
} from "./dto/operations.dto";
import {
  OperationsService,
} from "./operations.service";

@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get("sales/kpis")
  @Permissions("sales.read")
  salesKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getSalesKpis(user);
  }

  @Get("sales/orders")
  @Permissions("sales.read")
  orders(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getOrders(user);
  }

  @Post("sales/orders")
  @Permissions("sales.create")
  createOrder(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateSalesOrderDto) {
    return this.operationsService.createSalesOrder(user, body);
  }

  @Put("sales/orders/:id")
  @Permissions("sales.create")
  updateOrder(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateSalesOrderDto) {
    return this.operationsService.updateSalesOrder(user, id, body);
  }

  @Delete("sales/orders/:id")
  @Permissions("sales.create")
  deleteOrder(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deleteSalesOrder(user, id);
  }

  @Get("reports/kpis")
  @Permissions("reports.read")
  reportsKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getReportsKpis(user);
  }

  @Get("reports/items")
  @Permissions("reports.read")
  reportsItems(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getReportsItems(user);
  }

  @Get("reports/views")
  @Permissions("reports.read")
  reportViews(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.listReportViews(user);
  }

  @Post("reports/views")
  @Permissions("reports.manage")
  createReportView(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateReportViewDto) {
    return this.operationsService.createReportView(user, body);
  }

  @Put("reports/views/:id")
  @Permissions("reports.manage")
  updateReportView(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateReportViewDto) {
    return this.operationsService.updateReportView(user, id, body);
  }

  @Delete("reports/views/:id")
  @Permissions("reports.manage")
  deleteReportView(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deleteReportView(user, id);
  }

  @Get("accounting/kpis")
  @Permissions("finance.read")
  accountingKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAccountingKpis(user);
  }

  @Get("accounting/items")
  @Permissions("finance.read")
  accountingItems(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAccountingItems(user);
  }

  @Get("payments")
  @Permissions("payment.read")
  payments(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.listPayments(user);
  }

  @Post("payments")
  @Permissions("payment.create")
  createPayment(@CurrentUser() user: AuthenticatedUser, @Body() body: CreatePaymentDto) {
    return this.operationsService.createPayment(user, body);
  }

  @Put("payments/:id")
  @Permissions("payment.create")
  updatePayment(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdatePaymentDto) {
    return this.operationsService.updatePayment(user, id, body);
  }

  @Delete("payments/:id")
  @Permissions("payment.create")
  deletePayment(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deletePayment(user, id);
  }

  @Get("expenses")
  @Permissions("finance.read")
  expenses(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.listExpenses(user);
  }

  @Post("expenses")
  @Permissions("finance.manage")
  createExpense(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateExpenseDto) {
    return this.operationsService.createExpense(user, body);
  }

  @Put("expenses/:id")
  @Permissions("finance.manage")
  updateExpense(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateExpenseDto) {
    return this.operationsService.updateExpense(user, id, body);
  }

  @Delete("expenses/:id")
  @Permissions("finance.manage")
  deleteExpense(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deleteExpense(user, id);
  }

  @Get("hr/kpis")
  @Permissions("hr.read")
  hrKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getHrKpis(user);
  }

  @Get("hr/employees")
  @Permissions("hr.read")
  employees(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getEmployees(user);
  }

  @Get("appointments/kpis")
  @Permissions("projects.read")
  appointmentsKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAppointmentsKpis(user);
  }

  @Get("appointments/items")
  @Permissions("projects.read")
  appointmentsItems(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAppointmentsItems(user);
  }

  @Post("appointments")
  @Permissions("projects.manage")
  createAppointment(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateAppointmentDto) {
    return this.operationsService.createAppointment(user, body);
  }

  @Put("appointments/:id")
  @Permissions("projects.manage")
  updateAppointment(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateAppointmentDto) {
    return this.operationsService.updateAppointment(user, id, body);
  }

  @Delete("appointments/:id")
  @Permissions("projects.manage")
  deleteAppointment(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deleteAppointment(user, id);
  }

  @Get("production/kpis")
  @Permissions("stock.read")
  productionKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getProductionKpis(user);
  }

  @Get("production/items")
  @Permissions("stock.read")
  productionItems(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getProductionItems(user);
  }

  @Post("production/orders")
  @Permissions("stock.adjust")
  createProductionOrder(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateProductionOrderDto) {
    return this.operationsService.createProductionOrder(user, body);
  }

  @Put("production/orders/:id")
  @Permissions("stock.adjust")
  updateProductionOrder(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: UpdateProductionOrderDto) {
    return this.operationsService.updateProductionOrder(user, id, body);
  }

  @Delete("production/orders/:id")
  @Permissions("stock.adjust")
  deleteProductionOrder(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.operationsService.deleteProductionOrder(user, id);
  }

  @Get("assistant/kpis")
  @Permissions("ai.use")
  assistantKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAssistantKpis(user);
  }

  @Get("assistant/suggestions")
  @Permissions("ai.use")
  assistantSuggestions(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getAssistantSuggestions(user);
  }

  @Post("assistant/chat")
  @Permissions("ai.use")
  assistantChat(@CurrentUser() user: AuthenticatedUser, @Body() body: AssistantChatDto) {
    return this.operationsService.createAssistantAnswer(user, body.question ?? "", body.locale);
  }

  @Get("settings/summary")
  @Permissions("settings.manage")
  settingsSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.operationsService.getSettingsSummary(user);
  }
}
