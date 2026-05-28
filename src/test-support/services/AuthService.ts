import { ApiClient } from './ApiClient';
import { AdminStrategy, ViewerStrategy, RoleStrategy } from './strategies/RoleStrategy';

export class AuthService {
  private strategy: RoleStrategy;
  private client: ApiClient;

  constructor(client: ApiClient, role: 'admin' | 'viewer' = 'admin') {
    this.client = client;
    this.strategy = role === 'admin' ? new AdminStrategy() : new ViewerStrategy();
  }

  async authenticate() {
    return this.client.login(this.strategy.email, this.strategy.password);
  }
}
