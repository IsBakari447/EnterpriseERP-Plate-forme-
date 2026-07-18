import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  findAll() {
    return {
      module: 'auth',
      status: 'ready',
      message: 'EnterpriseERP Cloud API module initialized'
    };
  }
}
