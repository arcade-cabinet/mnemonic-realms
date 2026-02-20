/**
 * Mnemonic Realms — Diagnostic Reporter
 *
 * Generates comprehensive diagnostic reports from collected playtest data.
 * Outputs both human-readable Markdown and machine-readable JSON.
 *
 * PURE TypeScript — no React, no Skia, no browser dependencies.
 */

import type { DiagnosticCollector } from './collector.js';
import type {
  DiagnosticEvent,
  DiagnosticReport,
  PacingMetrics,
  PlaytestTelemetry,
} from './types.js';

// ── Reporter ────────────────────────────────────────────────────────────────

export class DiagnosticReporter {
  /** Generate a full diagnostic report from collected data. */
  generateReport(collector: DiagnosticCollector, strategyId: string): DiagnosticReport {
    const events = collector.getEvents();
    const telemetry = collector.getTelemetry();
    const combatLengths = collector.getCombatLengths();
    const pacing = this.computePacing(telemetry, combatLengths);
    const questCompletion = this.computeQuestCompletion(telemetry);
    const worldsVisited = this.computeWorldsVisited(telemetry);
    const encountersCompleted = this.computeEncountersCompleted(events);

    const criticalCount = events.filter((e) => e.severity === 'critical').length;
    const warningCount = events.filter((e) => e.severity === 'warning').length;
    const infoCount = events.filter((e) => e.severity === 'info').length;

    const summary = this.buildSummary(criticalCount, warningCount, infoCount, pacing);

    return {
      generatedAt: new Date().toISOString(),
      strategyUsed: strategyId,
      totalEvents: events.length,
      criticalCount,
      warningCount,
      infoCount,
      events,
      pacing,
      questCompletion,
      worldsVisited,
      encountersCompleted,
      summary,
    };
  }

  /** Format report as Markdown for human reading. */
  formatMarkdown(report: DiagnosticReport): string {
    const lines: string[] = [];
    lines.push('# Mnemonic Realms — Playtest Diagnostic Report');
    lines.push('');
    lines.push(`**Generated**: ${report.generatedAt}`);
    lines.push(`**Strategy**: ${report.strategyUsed}`);
    lines.push('');

    this.appendSummarySection(lines, report);
    this.appendEventTable(lines, report, 'critical');
    this.appendEventTable(lines, report, 'warning');
    this.appendPacingSection(lines, report);
    this.appendQuestSection(lines, report);
    this.appendListSection(lines, '## World Coverage', report.worldsVisited);
    this.appendListSection(lines, '## Encounter Summary', report.encountersCompleted);

    return lines.join('\n');
  }

  /** Format report as JSON for machine reading. */
  formatJSON(report: DiagnosticReport): string {
    return JSON.stringify(report, null, 2);
  }

  // ── Markdown Section Helpers ──────────────────────────────────────────

  private appendSummarySection(lines: string[], report: DiagnosticReport): void {
    lines.push('## Summary');
    lines.push('');
    lines.push(report.summary);
    lines.push('');
    lines.push('| Severity | Count |');
    lines.push('|----------|-------|');
    lines.push(`| Critical | ${report.criticalCount} |`);
    lines.push(`| Warning  | ${report.warningCount} |`);
    lines.push(`| Info     | ${report.infoCount} |`);
    lines.push(`| **Total** | **${report.totalEvents}** |`);
    lines.push('');
  }

  private formatLocation(e: DiagnosticEvent): string {
    return e.location ? `${e.location.mapId} (${e.location.x},${e.location.y})` : '—';
  }

  private appendEventTable(
    lines: string[],
    report: DiagnosticReport,
    severity: 'critical' | 'warning',
  ): void {
    const filtered = report.events.filter((e) => e.severity === severity);
    if (filtered.length === 0) return;

    const title = severity === 'critical' ? '## Critical Issues' : '## Warnings';
    lines.push(title);
    lines.push('');

    if (severity === 'critical') {
      lines.push('| Category | Message | Location | Quest |');
      lines.push('|----------|---------|----------|-------|');
      for (const e of filtered) {
        lines.push(
          `| ${e.category} | ${e.message} | ${this.formatLocation(e)} | ${e.questId ?? '—'} |`,
        );
      }
    } else {
      lines.push('| Category | Message | Location |');
      lines.push('|----------|---------|----------|');
      for (const e of filtered) {
        lines.push(`| ${e.category} | ${e.message} | ${this.formatLocation(e)} |`);
      }
    }
    lines.push('');
  }

  private appendPacingSection(lines: string[], report: DiagnosticReport): void {
    lines.push('## Pacing Analysis');
    lines.push('');
    lines.push(`- **Total ticks**: ${report.pacing.totalTicks}`);
    lines.push(`- **Combat encounters**: ${report.pacing.combatCount}`);
    lines.push(`- **Deaths**: ${report.pacing.deathCount}`);
    lines.push(`- **Avg combat length**: ${report.pacing.averageCombatLength} ticks`);
    lines.push(`- **Longest combat**: ${report.pacing.longestCombatLength} ticks`);
    lines.push('');

    if (Object.keys(report.pacing.ticksPerMap).length > 0) {
      lines.push('### Time per Map');
      lines.push('');
      lines.push('| Map | Ticks |');
      lines.push('|-----|-------|');
      for (const [map, ticks] of Object.entries(report.pacing.ticksPerMap)) {
        lines.push(`| ${map} | ${ticks} |`);
      }
      lines.push('');
    }
  }

  private appendQuestSection(lines: string[], report: DiagnosticReport): void {
    if (Object.keys(report.questCompletion).length === 0) return;
    lines.push('## Quest Completion');
    lines.push('');
    lines.push('| Quest | Status | Time Spent |');
    lines.push('|-------|--------|------------|');
    for (const [quest, data] of Object.entries(report.questCompletion)) {
      lines.push(`| ${quest} | ${data.status} | ${data.timeSpent} ticks |`);
    }
    lines.push('');
  }

  private appendListSection(lines: string[], heading: string, items: string[]): void {
    if (items.length === 0) return;
    lines.push(heading);
    lines.push('');
    for (const item of items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // ── Pacing Helpers ────────────────────────────────────────────────────

  private deriveActFromQuestId(questId: string): string | null {
    const actMatch = questId.match(/^(MQ|SQ)-(\d+)/);
    if (!actMatch) return null;
    const questNum = Number.parseInt(actMatch[2], 10);
    return questNum <= 10 ? 'act1' : questNum <= 20 ? 'act2' : 'act3';
  }

  private accumulateQuestTicks(
    snap: PlaytestTelemetry,
    ticksPerQuest: Record<string, number>,
    ticksPerAct: Record<string, number>,
  ): void {
    for (const [questId, status] of Object.entries(snap.questState)) {
      if (status === 'active') {
        ticksPerQuest[questId] = (ticksPerQuest[questId] ?? 0) + 1;
      }
      const act = this.deriveActFromQuestId(questId);
      if (act && status === 'active') {
        ticksPerAct[act] = (ticksPerAct[act] ?? 0) + 1;
      }
    }
  }

  private computePacing(telemetry: PlaytestTelemetry[], combatLengths: number[]): PacingMetrics {
    const ticksPerMap: Record<string, number> = {};
    const ticksPerQuest: Record<string, number> = {};
    const ticksPerAct: Record<string, number> = {};
    let deathCount = 0;

    for (const snap of telemetry) {
      ticksPerMap[snap.mapId] = (ticksPerMap[snap.mapId] ?? 0) + 1;
      this.accumulateQuestTicks(snap, ticksPerQuest, ticksPerAct);
      if (snap.hp <= 0) deathCount++;
    }

    const totalTicks =
      telemetry.length > 0 ? telemetry[telemetry.length - 1].tick - telemetry[0].tick : 0;
    const avgCombat =
      combatLengths.length > 0
        ? Math.round(combatLengths.reduce((a, b) => a + b, 0) / combatLengths.length)
        : 0;
    const longestCombat = combatLengths.length > 0 ? Math.max(...combatLengths) : 0;

    return {
      totalTicks,
      ticksPerAct,
      ticksPerQuest,
      ticksPerMap,
      combatCount: combatLengths.length,
      deathCount,
      averageCombatLength: avgCombat,
      longestCombatLength: longestCombat,
    };
  }

  private computeQuestCompletion(
    telemetry: PlaytestTelemetry[],
  ): Record<string, { status: string; timeSpent: number }> {
    const result: Record<string, { status: string; timeSpent: number }> = {};
    const questFirstTick: Record<string, number> = {};
    const questLastTick: Record<string, number> = {};
    const questLastStatus: Record<string, string> = {};

    for (const snap of telemetry) {
      for (const [questId, status] of Object.entries(snap.questState)) {
        if (!(questId in questFirstTick)) {
          questFirstTick[questId] = snap.tick;
        }
        questLastTick[questId] = snap.tick;
        questLastStatus[questId] = status;
      }
    }

    for (const questId of Object.keys(questLastStatus)) {
      result[questId] = {
        status: questLastStatus[questId],
        timeSpent: (questLastTick[questId] ?? 0) - (questFirstTick[questId] ?? 0),
      };
    }
    return result;
  }

  private computeWorldsVisited(telemetry: PlaytestTelemetry[]): string[] {
    const worlds = new Set<string>();
    for (const snap of telemetry) {
      worlds.add(snap.mapId);
    }
    return [...worlds].sort();
  }

  private computeEncountersCompleted(events: DiagnosticEvent[]): string[] {
    const encounters = new Set<string>();
    for (const e of events) {
      if (e.encounterId && e.category === 'combat-balance') {
        encounters.add(e.encounterId);
      }
    }
    return [...encounters].sort();
  }

  private buildSummary(
    criticalCount: number,
    warningCount: number,
    infoCount: number,
    pacing: PacingMetrics,
  ): string {
    const parts: string[] = [];
    if (criticalCount > 0) {
      parts.push(`🔴 ${criticalCount} critical issue(s) found — immediate attention required.`);
    }
    if (warningCount > 0) {
      parts.push(`🟡 ${warningCount} warning(s) detected.`);
    }
    if (criticalCount === 0 && warningCount === 0) {
      parts.push('🟢 No critical issues or warnings detected. Clean run!');
    }
    parts.push(`ℹ️ ${infoCount} informational event(s).`);
    parts.push(
      `Playtest covered ${pacing.totalTicks} ticks across ${Object.keys(pacing.ticksPerMap).length} map(s) with ${pacing.combatCount} combat encounter(s).`,
    );
    return parts.join(' ');
  }
}
