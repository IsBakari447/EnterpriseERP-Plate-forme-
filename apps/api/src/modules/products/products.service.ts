import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  findAll() {
    return {
      module: 'products',
      status: 'ready',
      message: 'EnterpriseERP Cloud API module initialized'
    };
  }
}
