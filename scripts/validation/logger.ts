// Logging infrastructure for validation tools
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: unknown;
}

export class Logger {
  private logFile: string | null = null;
  private logs: LogEntry[] = [];
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = 'info', logFile?: string) {
    this.minLevel = minLevel;
    if (logFile) {
      this.logFile = logFile;
      const dir = join(logFile, '..');
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: unknown): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
    this.logs.push(entry);

    const formatted = this.formatMessage(level, message, context);

    // Console output with color coding
    const colors = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m', // green
      warn: '\x1b[33m', // yellow
      error: '\x1b[31m', // red
    };
    const reset = '\x1b[0m';
    console.log(`${colors[level]}${formatted}${reset}`);

    // Write to file if configured
    if (this.logFile) {
      writeFileSync(this.logFile, `${formatted}\n`, { flag: 'a' });
    }
  }

  debug(message: string, context?: unknown): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: unknown): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: unknown): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: unknown): void {
    this.log('error', message, context);
  }

  progress(current: number, total: number, message: string): void {
    const percentage = Math.round((current / total) * 100);
    this.info(`[${current}/${total}] (${percentage}%) ${message}`);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

// Global logger instance
export const logger = new Logger('info');
