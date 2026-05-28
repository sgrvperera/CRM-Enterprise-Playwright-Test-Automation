export class Logger {
  readonly scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  info(message: string, data: Record<string, unknown> = {}) {
    this.log('INFO', message, data);
  }

  warn(message: string, data: Record<string, unknown> = {}) {
    this.log('WARN', message, data);
  }

  error(message: string, data: Record<string, unknown> = {}) {
    this.log('ERROR', message, data);
  }

  private log(level: string, message: string, data: Record<string, unknown>) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      ...data,
    };
    console.log(JSON.stringify(payload));
  }
}
