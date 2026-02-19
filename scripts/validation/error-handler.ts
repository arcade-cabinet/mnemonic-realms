// Error handling for validation tools
import type {
  ParseErrorReport,
  MissingFileReport,
  SchemaViolationReport,
  ErrorSummary,
} from './types.js';
import { logger } from './logger.js';

export class ErrorHandler {
  private parseErrors: ParseErrorReport[] = [];
  private missingFiles: MissingFileReport[] = [];
  private schemaViolations: SchemaViolationReport[] = [];

  handleParseError(file: string, error: Error): ParseErrorReport {
    const report: ParseErrorReport = {
      file,
      error: error.message,
      stack: error.stack,
    };
    this.parseErrors.push(report);
    logger.error(`Parse error in ${file}`, { error: error.message });
    return report;
  }

  handleMissingFile(file: string, referencedBy: string[]): MissingFileReport {
    const report: MissingFileReport = {
      file,
      referencedBy,
    };
    this.missingFiles.push(report);
    logger.error(`Missing file: ${file}`, { referencedBy });
    return report;
  }

  handleSchemaViolation(
    data: unknown,
    schema: string,
    file: string,
  ): SchemaViolationReport {
    const report: SchemaViolationReport = {
      file,
      violations: [
        {
          path: file,
          expected: schema,
          actual: typeof data,
        },
      ],
    };
    this.schemaViolations.push(report);
    logger.error(`Schema violation in ${file}`, { schema, actual: typeof data });
    return report;
  }

  aggregateErrors(): ErrorSummary {
    return {
      parseErrors: [...this.parseErrors],
      missingFiles: [...this.missingFiles],
      schemaViolations: [...this.schemaViolations],
    };
  }

  hasErrors(): boolean {
    return (
      this.parseErrors.length > 0 ||
      this.missingFiles.length > 0 ||
      this.schemaViolations.length > 0
    );
  }

  clear(): void {
    this.parseErrors = [];
    this.missingFiles = [];
    this.schemaViolations = [];
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();
