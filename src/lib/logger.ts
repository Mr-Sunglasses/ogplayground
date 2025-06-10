type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: string): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog(level)) return;

    // In development, use console for better debugging
    if (this.isDevelopment && this.isClient) {
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
    // In production or server-side, logs are suppressed by default
    // You could send to an external logging service here if needed
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