/**
 * Mnemonic Realms — Diagnostic Report Types
 *
 * Pure data types for the playtest diagnostics system.
 * No React, no Skia, no browser dependencies — just shapes.
 */

// ── Severity & Category ─────────────────────────────────────────────────────

export type DiagnosticSeverity = 'critical' | 'warning' | 'info';

export type DiagnosticCategory =
  | 'quest-logic'
  | 'navigation'
  | 'combat-balance'
  | 'dialogue'
  | 'world-transition'
  | 'vibrancy'
  | 'item-access'
  | 'pacing';

// ── Diagnostic Event ────────────────────────────────────────────────────────

export interface DiagnosticEvent {
  timestamp: number;
  tick: number;
  category: DiagnosticCategory;
  severity: DiagnosticSeverity;
  message: string;
  details: Record<string, unknown>;
  location?: { mapId: string; x: number; y: number };
  questId?: string;
  encounterId?: string;
}

// ── Playtest Telemetry ──────────────────────────────────────────────────────

/** Snapshot produced by the AI player each tick. */
export interface PlaytestTelemetry {
  tick: number;
  position: { x: number; y: number };
  mapId: string;
  currentGoal: string;
  action: string;
  questState: Record<string, string>;
  hp: number;
  maxHp: number;
  inventory: string[];
  errors: string[];
}

// ── Pacing Metrics ──────────────────────────────────────────────────────────

export interface PacingMetrics {
  totalTicks: number;
  ticksPerAct: Record<string, number>;
  ticksPerQuest: Record<string, number>;
  ticksPerMap: Record<string, number>;
  combatCount: number;
  deathCount: number;
  averageCombatLength: number;
  longestCombatLength: number;
}

// ── Diagnostic Report ───────────────────────────────────────────────────────

export interface DiagnosticReport {
  generatedAt: string;
  strategyUsed: string;
  totalEvents: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  events: DiagnosticEvent[];
  pacing: PacingMetrics;
  questCompletion: Record<string, { status: string; timeSpent: number }>;
  worldsVisited: string[];
  encountersCompleted: string[];
  summary: string;
}
