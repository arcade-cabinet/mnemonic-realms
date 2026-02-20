#!/usr/bin/env tsx
/**
 * Mnemonic Realms — Playtest Report Generator
 *
 * Usage:
 *   pnpm tsx scripts/generate-playtest-report.ts [--dry-run] [--strategy completionist]
 *
 * --dry-run   Generate a sample report with mock data (no actual playtest)
 * --strategy  Which AI strategy to label (completionist, speedrun, side-quest-focus)
 *
 * Output:
 *   reports/playtest-report-{timestamp}.md   (human-readable)
 *   reports/playtest-report-{timestamp}.json  (machine-readable)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { DiagnosticCollector } from '../engine/testing/diagnostics/collector.js';
import { DiagnosticReporter } from '../engine/testing/diagnostics/reporter.js';
import type { PlaytestTelemetry } from '../engine/testing/diagnostics/types.js';

// ── CLI Argument Parsing ────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const strategyIdx = args.indexOf('--strategy');
const strategy = strategyIdx >= 0 && args[strategyIdx + 1]
  ? args[strategyIdx + 1]
  : 'completionist';

// ── Mock Data Generator (for --dry-run) ─────────────────────────────────────

function generateMockTelemetry(): PlaytestTelemetry[] {
  const telemetry: PlaytestTelemetry[] = [];
  const maps = ['everwick', 'heartfield', 'ambergrove', 'sunridge'];

  for (let tick = 0; tick < 1200; tick++) {
    const mapIdx = Math.floor(tick / 300) % maps.length;
    const mapId = maps[mapIdx];
    const x = 10 + (tick % 50);
    const y = 10 + Math.floor((tick % 100) / 2);

    // Simulate stuck player at ticks 400-510
    const isStuck = tick >= 400 && tick < 510;
    const pos = isStuck ? { x: 25, y: 30 } : { x, y };

    // Simulate quest progression
    const questState: Record<string, string> = {};
    if (tick < 200) questState['MQ-01'] = 'active';
    else if (tick < 600) {
      questState['MQ-01'] = 'completed';
      questState['MQ-02'] = 'active';
    } else {
      questState['MQ-01'] = 'completed';
      questState['MQ-02'] = 'completed';
      questState['SQ-01'] = 'active';
    }

    // Simulate forgotten area at ticks 700-730
    const inForgotten = tick >= 700 && tick < 730;

    telemetry.push({
      tick,
      position: pos,
      mapId,
      currentGoal: tick < 200 ? 'Find the elder' : 'Explore the forest',
      action: inForgotten ? 'move-forgotten' : 'move',
      questState,
      hp: tick >= 800 && tick < 803 ? 0 : 80,
      maxHp: 100,
      inventory: ['potion', 'iron-sword'],
      errors: inForgotten ? ['vibrancy-warning'] : [],
    });
  }

  return telemetry;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  console.log(`🎮 Mnemonic Realms — Playtest Report Generator`);
  console.log(`   Strategy: ${strategy}`);
  console.log(`   Mode: ${dryRun ? 'dry-run (mock data)' : 'live'}`);
  console.log('');

  const collector = new DiagnosticCollector();

  if (dryRun) {
    // Generate mock telemetry
    const mockTelemetry = generateMockTelemetry();
    for (const snap of mockTelemetry) {
      collector.recordTelemetry(snap);
    }

    // Simulate some combat encounters
    collector.startCombat('ENC-wolf-pack', 150);
    collector.endCombat('ENC-wolf-pack', 165, 'victory');
    collector.startCombat('ENC-slime-swarm', 350);
    collector.endCombat('ENC-slime-swarm', 380, 'defeat');
    collector.startCombat('ENC-slime-swarm-2', 390);
    collector.endCombat('ENC-slime-swarm-2', 410, 'defeat');
    collector.startCombat('ENC-slime-swarm-3', 420);
    collector.endCombat('ENC-slime-swarm-3', 445, 'defeat');
    collector.startCombat('ENC-bandit', 900);
    collector.endCombat('ENC-bandit', 920, 'victory');

    // Run auto-detection
    collector.analyzeStream();

    console.log('   ✅ Mock telemetry generated (1200 ticks, 4 maps, 4 combats)');
  } else {
    console.log('   ⚠️  Live playtest not yet implemented. Use --dry-run for now.');
    console.log('   The AI player framework will feed telemetry into the collector.');
    process.exit(0);
  }

  // Generate report
  const reporter = new DiagnosticReporter();
  const report = reporter.generateReport(collector, strategy);

  // Ensure output directory exists
  const reportsDir = path.resolve(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Write files
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const mdPath = path.join(reportsDir, `playtest-report-${timestamp}.md`);
  const jsonPath = path.join(reportsDir, `playtest-report-${timestamp}.json`);

  fs.writeFileSync(mdPath, reporter.formatMarkdown(report), 'utf-8');
  fs.writeFileSync(jsonPath, reporter.formatJSON(report), 'utf-8');

  console.log('');
  console.log(`   📄 Markdown: ${path.relative(process.cwd(), mdPath)}`);
  console.log(`   📊 JSON:     ${path.relative(process.cwd(), jsonPath)}`);
  console.log('');
  console.log(`   Summary: ${report.summary}`);
}

main();

