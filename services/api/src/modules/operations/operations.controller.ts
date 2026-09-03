import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import { OperationsService } from "./operations.service";

@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get("sales/kpis")
  @Permissions("sales.read")
  salesKpis() {
    return this.operationsService.getSalesKpis();
  }

  @Get("sales/orders")
  @Permissions("sales.read")
  orders() {
    return this.operationsService.getOrders();
  }

  @Get("reports/kpis")
  @Permissions("reports.read")
  reportsKpis() {
    return this.operationsService.getReportsKpis();
  }

  @Get("reports/items")
  @Permissions("reports.read")
  reportsItems() {
    return this.operationsService.getReportsItems();
  }

  @Get("accounting/kpis")
  @Permissions("finance.read")
  accountingKpis() {
    return this.operationsService.getAccountingKpis();
  }

  @Get("accounting/items")
  @Permissions("finance.read")
  accountingItems() {
    return this.operationsService.getAccountingItems();
  }

  @Get("hr/kpis")
  @Permissions("hr.read")
  hrKpis() {
    return this.operationsService.getHrKpis();
  }

  @Get("hr/employees")
  @Permissions("hr.read")
  employees() {
    return this.operationsService.getEmployees();
  }

  @Get("appointments/kpis")
  @Permissions("projects.read")
  appointmentsKpis() {
    return this.operationsService.getAppointmentsKpis();
  }

  @Get("appointments/items")
  @Permissions("projects.read")
  appointmentsItems() {
    return this.operationsService.getAppointmentsItems();
  }

  @Get("production/kpis")
  @Permissions("stock.read")
  productionKpis() {
    return this.operationsService.getProductionKpis();
  }

  @Get("production/items")
  @Permissions("stock.read")
  productionItems() {
    return this.operationsService.getProductionItems();
  }

  @Get("assistant/kpis")
  @Permissions("ai.use")
  assistantKpis() {
    return this.operationsService.getAssistantKpis();
  }

  @Get("assistant/suggestions")
  @Permissions("ai.use")
  assistantSuggestions() {
    return this.operationsService.getAssistantSuggestions();
  }

  @Post("assistant/chat")
  @Permissions("ai.use")
  assistantChat(@CurrentUser() user: AuthenticatedUser, @Body() body: { question?: string; locale?: string }) {
    return this.operationsService.createAssistantAnswer(user, body.question ?? "", body.locale);
  }

  @Get("settings/summary")
  @Permissions("settings.manage")
  settingsSummary() {
    return this.operationsService.getSettingsSummary();
  }
}
