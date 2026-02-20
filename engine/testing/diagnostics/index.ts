/**
 * Mnemonic Realms — Diagnostics Module
 *
 * Public API for the playtest diagnostics system.
 */

export { DiagnosticCollector } from './collector.js';
export { DiagnosticReporter } from './reporter.js';
export type {
  DiagnosticCategory,
  DiagnosticEvent,
  DiagnosticReport,
  DiagnosticSeverity,
  PacingMetrics,
  PlaytestTelemetry,
} from './types.js';
