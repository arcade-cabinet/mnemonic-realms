// Shared types and interfaces for validation infrastructure

export interface ValidationReport {
  reportType: 'visual' | 'map' | 'event' | 'content' | 'sprite';
  timestamp: string;
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  issues: Issue[];
  metadata: {
    validator: string;
    version: string;
    duration: number;
  };
}

export interface Issue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  location: {
    file: string;
    line?: number;
    column?: number;
    coordinates?: { x: number; y: number };
  };
  expected?: unknown;
  actual?: unknown;
  suggestion?: string;
}

export interface ParseErrorReport {
  file: string;
  error: string;
  stack?: string;
}

export interface MissingFileReport {
  file: string;
  referencedBy: string[];
}

export interface SchemaViolationReport {
  file: string;
  violations: Array<{
    path: string;
    expected: string;
    actual: string;
  }>;
}

export interface ErrorSummary {
  parseErrors: ParseErrorReport[];
  missingFiles: MissingFileReport[];
  schemaViolations: SchemaViolationReport[];
}
