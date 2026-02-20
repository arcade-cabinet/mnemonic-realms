/**
 * Mnemonic Realms — Diagnostic Collector
 *
 * Runtime data collection for automated playtesting.
 * Records telemetry snapshots and diagnostic events,
 * then auto-detects issues from the telemetry stream.
 *
 * PURE TypeScript — no React, no Skia, no browser dependencies.
 */

import type { DiagnosticEvent, PlaytestTelemetry } from './types.js';

// ── Detection Thresholds ────────────────────────────────────────────────────

const STUCK_THRESHOLD = 100;
const DEATH_LOOP_THRESHOLD = 3;
const QUEST_SOFTLOCK_THRESHOLD = 500;
const TRANSITION_STALL_THRESHOLD = 50;
const VIBRANCY_MISMATCH_THRESHOLD = 20;

// ── Collector ───────────────────────────────────────────────────────────────

export class DiagnosticCollector {
  private events: DiagnosticEvent[] = [];
  private telemetry: PlaytestTelemetry[] = [];
  private combatStarts: Map<string, number> = new Map();
  private combatLengths: number[] = [];
  private deathLocations: Map<string, number> = new Map();

  /** Record a telemetry snapshot from the AI player tick. */
  recordTelemetry(data: PlaytestTelemetry): void {
    this.telemetry.push(data);
  }

  /** Record a diagnostic event. */
  recordEvent(event: Omit<DiagnosticEvent, 'timestamp'>): void {
    this.events.push({ ...event, timestamp: Date.now() });
  }

  /** Mark the start of a combat encounter. */
  startCombat(encounterId: string, tick: number): void {
    this.combatStarts.set(encounterId, tick);
  }

  /** Mark the end of a combat encounter. */
  endCombat(encounterId: string, tick: number, outcome: 'victory' | 'defeat' | 'fled'): void {
    const startTick = this.combatStarts.get(encounterId);
    if (startTick !== undefined) {
      this.combatLengths.push(tick - startTick);
      this.combatStarts.delete(encounterId);
    }
    if (outcome === 'defeat') {
      const last = this.telemetry[this.telemetry.length - 1];
      const key = last
        ? `${last.mapId}:${Math.round(last.position.x)}:${Math.round(last.position.y)}`
        : 'unknown';
      this.deathLocations.set(key, (this.deathLocations.get(key) ?? 0) + 1);
    }
    this.recordEvent({
      tick,
      category: 'combat-balance',
      severity: outcome === 'defeat' ? 'warning' : 'info',
      message: `Combat ${encounterId} ended: ${outcome}`,
      details: { encounterId, outcome, duration: startTick !== undefined ? tick - startTick : 0 },
      encounterId,
    });
  }

  /** Auto-detect issues from the telemetry stream. */
  analyzeStream(): void {
    this.detectStuck();
    this.detectDeathLoop();
    this.detectQuestSoftlock();
    this.detectVibrancyMismatch();
    this.detectTransitionStall();
  }

  /** Get all collected events. */
  getEvents(): DiagnosticEvent[] {
    return [...this.events];
  }

  /** Get telemetry log. */
  getTelemetry(): PlaytestTelemetry[] {
    return [...this.telemetry];
  }

  /** Get recorded combat lengths. */
  getCombatLengths(): number[] {
    return [...this.combatLengths];
  }

  /** Get death location counts. */
  getDeathLocations(): Map<string, number> {
    return new Map(this.deathLocations);
  }

  /** Reset for a new run. */
  reset(): void {
    this.events = [];
    this.telemetry = [];
    this.combatStarts = new Map();
    this.combatLengths = [];
    this.deathLocations = new Map();
  }

  // ── Private Detection Methods ───────────────────────────────────────────

  /** Detect player stuck at same position for too long. */
  private detectStuck(): void {
    if (this.telemetry.length < STUCK_THRESHOLD) return;
    let streakStart = 0;
    for (let i = 1; i < this.telemetry.length; i++) {
      const prev = this.telemetry[i - 1];
      const curr = this.telemetry[i];
      if (prev.position.x !== curr.position.x || prev.position.y !== curr.position.y) {
        streakStart = i;
        continue;
      }
      const streakLen = i - streakStart + 1;
      if (streakLen === STUCK_THRESHOLD) {
        this.recordEvent({
          tick: curr.tick,
          category: 'navigation',
          severity: 'warning',
          message: `Player stuck at (${curr.position.x}, ${curr.position.y}) for ${STUCK_THRESHOLD}+ ticks`,
          details: { streakLength: streakLen, position: curr.position },
          location: { mapId: curr.mapId, x: curr.position.x, y: curr.position.y },
        });
      }
    }
  }

  /** Detect death loop — 3+ deaths in same area. */
  private detectDeathLoop(): void {
    for (const [locationKey, count] of this.deathLocations) {
      if (count >= DEATH_LOOP_THRESHOLD) {
        const [mapId, x, y] = locationKey.split(':');
        const lastTick =
          this.telemetry.length > 0 ? this.telemetry[this.telemetry.length - 1].tick : 0;
        this.recordEvent({
          tick: lastTick,
          category: 'combat-balance',
          severity: 'critical',
          message: `Death loop detected: ${count} deaths near (${x}, ${y}) on ${mapId}`,
          details: { deathCount: count, locationKey },
          location: mapId ? { mapId, x: Number(x), y: Number(y) } : undefined,
        });
      }
    }
  }

  /** Detect quest softlock — active quest with no progress for too long. */
  private detectQuestSoftlock(): void {
    if (this.telemetry.length < QUEST_SOFTLOCK_THRESHOLD) return;
    const questLastChanged: Map<string, { tick: number; status: string }> = new Map();
    for (const snap of this.telemetry) {
      for (const [questId, status] of Object.entries(snap.questState)) {
        const prev = questLastChanged.get(questId);
        if (!prev || prev.status !== status) {
          questLastChanged.set(questId, { tick: snap.tick, status });
        }
      }
    }
    const lastTick = this.telemetry[this.telemetry.length - 1]?.tick ?? 0;
    for (const [questId, last] of questLastChanged) {
      if (last.status === 'active' && lastTick - last.tick >= QUEST_SOFTLOCK_THRESHOLD) {
        this.recordEvent({
          tick: lastTick,
          category: 'quest-logic',
          severity: 'critical',
          message: `Possible quest softlock: ${questId} stuck in 'active' for ${lastTick - last.tick} ticks`,
          details: { questId, ticksSinceLastChange: lastTick - last.tick },
          questId,
        });
      }
    }
  }

  /** Detect vibrancy mismatch — player in forgotten area without damage. */
  private detectVibrancyMismatch(): void {
    if (this.telemetry.length < VIBRANCY_MISMATCH_THRESHOLD) return;
    let forgottenStreak = 0;
    let lastHp = -1;
    for (const snap of this.telemetry) {
      const inForgotten =
        snap.action.includes('forgotten') || snap.errors.some((e) => e.includes('vibrancy'));
      if (inForgotten) {
        if (lastHp >= 0 && snap.hp >= lastHp) {
          forgottenStreak++;
        } else {
          forgottenStreak = 0;
        }
        if (forgottenStreak === VIBRANCY_MISMATCH_THRESHOLD) {
          this.recordEvent({
            tick: snap.tick,
            category: 'vibrancy',
            severity: 'warning',
            message: `Player in forgotten area for ${VIBRANCY_MISMATCH_THRESHOLD}+ ticks without taking damage`,
            details: { streakLength: forgottenStreak, hp: snap.hp },
            location: { mapId: snap.mapId, x: snap.position.x, y: snap.position.y },
          });
        }
      } else {
        forgottenStreak = 0;
      }
      lastHp = snap.hp;
    }
  }

  /** Detect transition stall — loading phase lasting too long. */
  private detectTransitionStall(): void {
    if (this.telemetry.length < TRANSITION_STALL_THRESHOLD) return;
    let loadingStreak = 0;
    for (const snap of this.telemetry) {
      const isLoading = snap.action === 'loading' || snap.action.includes('transition');
      if (isLoading) {
        loadingStreak++;
        if (loadingStreak === TRANSITION_STALL_THRESHOLD) {
          this.recordEvent({
            tick: snap.tick,
            category: 'world-transition',
            severity: 'critical',
            message: `World transition stalled for ${TRANSITION_STALL_THRESHOLD}+ ticks`,
            details: { streakLength: loadingStreak, action: snap.action },
            location: { mapId: snap.mapId, x: snap.position.x, y: snap.position.y },
          });
        }
      } else {
        loadingStreak = 0;
      }
    }
  }
}
