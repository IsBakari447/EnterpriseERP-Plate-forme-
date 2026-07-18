import { Controller, Get } from '@nestjs/common';
import { CrmService } from './crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly service: CrmService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
