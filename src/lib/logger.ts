type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog(level)) return;

    const contextPrefix = context ? `[${context}] ` : '';
    const fullMessage = `${contextPrefix}${message}`;

    switch (level) {
      case 'debug':
        console.debug(fullMessage, data || '');
        break;
      case 'info':
        console.info(fullMessage, data || '');
        break;
      case 'warn':
        console.warn(fullMessage, data || '');
        break;
      case 'error':
        console.error(fullMessage, data || '');
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log('error', message, data, context);
  }
}

export const logger = new Logger();
