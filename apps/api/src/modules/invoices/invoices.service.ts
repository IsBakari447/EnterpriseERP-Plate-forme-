import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoicesService {
  findAll() {
    return {
      module: 'invoices',
      status: 'ready',
      message: 'EnterpriseERP Cloud API module initialized'
    };
  }
}
