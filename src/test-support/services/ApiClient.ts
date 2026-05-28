import { APIRequestContext, APIResponse } from '@playwright/test';
import { validateSchema } from '../utils/contract';
import { authResponseSchema, customerSchema, customerListSchema, errorSchema } from './Schemas';
import { Logger } from '../utils/logger';

type APIRequestOptions = Parameters<APIRequestContext['get']>[1];

export class ApiClient {
  readonly request: APIRequestContext;
  token?: string;
  readonly logger = new Logger('ApiClient');

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, password: string) {
    this.logger.info('Authenticating', { email });
    const response = await this.request.post('/api/auth/login', {
      data: { email, password },
    });
    const body = await this.validateResponse(response, authResponseSchema);
    this.token = body.token;
    this.logger.info('Authenticated', { user: body.user.email, role: body.user.role });
    return body;
  }

  async get(path: string, options: APIRequestOptions = {}) {
    const response = await this.request.get(path, this.addAuthHeaders(options));
    return response;
  }

  async post(path: string, data: any, options: APIRequestOptions = {}) {
    const response = await this.request.post(path, { data, ...this.addAuthHeaders(options) });
    return response;
  }

  async put(path: string, data: any, options: APIRequestOptions = {}) {
    const response = await this.request.put(path, { data, ...this.addAuthHeaders(options) });
    return response;
  }

  async delete(path: string, options: APIRequestOptions = {}) {
    const response = await this.request.delete(path, this.addAuthHeaders(options));
    return response;
  }

  async validateResponse<T = any>(response: APIResponse, schema: object) {
    const body = await response.json().catch(() => undefined);
    if (!response.ok()) {
      validateSchema(errorSchema, body);
      throw new Error(`Request failed with status ${response.status()}`);
    }
    validateSchema(schema, body);
    return body as T;
  }

  private addAuthHeaders(options: APIRequestOptions = {}) {
    const headers = { ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    return { ...options, headers };
  }
}
