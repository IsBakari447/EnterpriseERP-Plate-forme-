import { Injectable } from '@nestjs/common';

@Injectable()
export class CrmService {
  findAll() {
    return {
      module: 'crm',
      status: 'ready',
      message: 'EnterpriseERP Cloud API module initialized'
    };
  }
}
