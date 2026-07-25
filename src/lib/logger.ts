export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  correlationId?: string;
  data?: Record<string, unknown>;
}

class Logger {
  private level: LogLevel = 'info';

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private requestId?: string;
  private correlationId?: string;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setRequestId(id: string) {
    this.requestId = id;
  }

  setCorrelationId(id: string) {
    this.correlationId = id;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      correlationId: this.correlationId,
      data: data ? { ...data } : undefined,
    };
    const formatted = JSON.stringify(entry);
    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>) {
    this.log('error', message, data);
  }
}

export const logger = new Logger();
