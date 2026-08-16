import { Body, Controller, Get, Post } from "@nestjs/common";
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

  @Get("hr/kpis")
  hrKpis() {
    return this.operationsService.getHrKpis();
  }

  @Get("hr/employees")
  employees() {
    return this.operationsService.getEmployees();
  }

  @Get("assistant/kpis")
  assistantKpis() {
    return this.operationsService.getAssistantKpis();
  }

  @Get("assistant/suggestions")
  assistantSuggestions() {
    return this.operationsService.getAssistantSuggestions();
  }

  @Post("assistant/chat")
  assistantChat(@Body() body: { question?: string; locale?: string }) {
    return this.operationsService.createAssistantAnswer(body.question ?? "", body.locale);
  }

  @Get("settings/summary")
  settingsSummary() {
    return this.operationsService.getSettingsSummary();
  }
}
