import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthenticatedUser, CurrentUser } from "../../common/auth/current-user.decorator";
import { Permissions } from "../../common/security/permissions.decorator";
import { OperationsService } from "./operations.service";

@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get("sales/kpis")
  salesKpis() {
    return this.operationsService.getSalesKpis();
  }

  @Get("sales/orders")
  orders() {
    return this.operationsService.getOrders();
  }

  @Get("reports/kpis")
  reportsKpis() {
    return this.operationsService.getReportsKpis();
  }

  @Get("reports/items")
  reportsItems() {
    return this.operationsService.getReportsItems();
  }

  @Get("accounting/kpis")
  accountingKpis() {
    return this.operationsService.getAccountingKpis();
  }

  @Get("accounting/items")
  accountingItems() {
    return this.operationsService.getAccountingItems();
  }

  @Get("hr/kpis")
  hrKpis() {
    return this.operationsService.getHrKpis();
  }

  @Get("hr/employees")
  employees() {
    return this.operationsService.getEmployees();
  }

  @Get("appointments/kpis")
  appointmentsKpis() {
    return this.operationsService.getAppointmentsKpis();
  }

  @Get("appointments/items")
  appointmentsItems() {
    return this.operationsService.getAppointmentsItems();
  }

  @Get("production/kpis")
  productionKpis() {
    return this.operationsService.getProductionKpis();
  }

  @Get("production/items")
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
  settingsSummary() {
    return this.operationsService.getSettingsSummary();
  }
}
