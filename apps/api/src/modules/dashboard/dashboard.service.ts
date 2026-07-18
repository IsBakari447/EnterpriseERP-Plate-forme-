import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  findAll() {
    return {
      module: 'dashboard',
      status: 'ready',
      message: 'EnterpriseERP Cloud API module initialized'
    };
  }
}
