/**
 * Diagnostics helpers for playtest suite.
 *
 * Wraps DiagnosticCollector and DiagnosticReporter for easy use in tests.
 * Bridges AIPlayerTelemetry → PlaytestTelemetry for the collector.
 */

import { DiagnosticCollector } from '../../../engine/testing/diagnostics/collector.js';
import { DiagnosticReporter } from '../../../engine/testing/diagnostics/reporter.js';
import type { AIPlayerTelemetry } from '../../../engine/testing/ai-player.js';
import type { PlaytestTelemetry } from '../../../engine/testing/diagnostics/types.js';

// ── Telemetry Bridge ───────────────────────────────────────────────────────

/**
 * Convert AIPlayerTelemetry to PlaytestTelemetry.
 *
 * AIPlayerTelemetry lacks mapId, hp, maxHp, inventory fields.
 * We fill them with defaults or provided overrides.
 */
export function bridgeTelemetry(
  aiTelemetry: AIPlayerTelemetry,
  mapId = 'unknown',
  hp = 100,
  maxHp = 100,
  inventory: string[] = [],
): PlaytestTelemetry {
  return {
    tick: aiTelemetry.tick,
    position: aiTelemetry.position,
    mapId,
    currentGoal: aiTelemetry.currentGoal,
    action: aiTelemetry.action,
    questState: aiTelemetry.questState,
    hp,
    maxHp,
    inventory,
    errors: aiTelemetry.errors,
  };
}

// ── Collector + Reporter Setup ─────────────────────────────────────────────

/** Create a fresh DiagnosticCollector. */
export function createCollector(): DiagnosticCollector {
  return new DiagnosticCollector();
}

/** Create a DiagnosticReporter instance. */
export function createReporter(): DiagnosticReporter {
  return new DiagnosticReporter();
}

/**
 * Run AI player for N ticks, recording telemetry into the collector.
 * Returns the collector for analysis.
 */
export function collectTelemetry(
  ai: { tick: (dt: number) => AIPlayerTelemetry },
  collector: DiagnosticCollector,
  ticks: number,
  mapId = 'test-map',
  deltaTime = 16,
): DiagnosticCollector {
  for (let i = 0; i < ticks; i++) {
    const t = ai.tick(deltaTime);
    collector.recordTelemetry(bridgeTelemetry(t, mapId));
  }
  return collector;
}

