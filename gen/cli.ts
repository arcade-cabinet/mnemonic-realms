#!/usr/bin/env npx tsx
/** Unified GenAI pipeline CLI. Usage: pnpm gen <subcommand> [targets] [flags] */

import { runBuild } from './cli-build';
import { runGenerate } from './cli-generate';
import { runIntegrate } from './cli-integrate';
import { runStatus } from './cli-status';
import { addDirtyId, clearDirty, loadDirty, removeDirtyId } from './dirty';

const args = process.argv.slice(2);
const sub = args[0];
const rest = args.slice(1);
const flags = rest.filter((a) => a.startsWith('--'));
const targets = rest.filter((a) => !a.startsWith('--'));
const dryRun = flags.includes('--dry-run');
const idxFlag = rest.indexOf('--index');
const index = idxFlag >= 0 ? Number(rest[idxFlag + 1]) : undefined;
const modelFlag = rest.indexOf('--model');
const model = modelFlag >= 0 ? rest[modelFlag + 1] : undefined;

console.log('Mnemonic Realms — GenAI Pipeline\n');

switch (sub) {
  case 'build':
    runBuild(targets);
    break;
  case 'generate':
    await runGenerate({ targets, dryRun, index, model });
    break;
  case 'integrate':
    await runIntegrate(targets, dryRun);
    break;
  case 'status':
    runStatus();
    break;
  case 'dirty': {
    const action = targets[0];
    if (action === 'list' || !action) {
      const manifest = loadDirty();
      if (manifest.entries.length === 0) {
        console.log('No dirty entries. All assets are clean.');
      } else {
        console.log(`${manifest.entries.length} dirty entry(s):\n`);
        for (const e of manifest.entries) {
          console.log(`  ${e.id} — ${e.reason} (${e.addedAt})`);
        }
      }
    } else if (action === 'add') {
      const id = targets[1];
      const reason = targets.slice(2).join(' ') || 'manual override';
      if (!id) {
        console.error('Usage: pnpm gen dirty add <asset-id> [reason]');
        process.exit(1);
      }
      addDirtyId(id, reason);
      console.log(`Marked dirty: ${id} — ${reason}`);
    } else if (action === 'remove') {
      const id = targets[1];
      if (!id) {
        console.error('Usage: pnpm gen dirty remove <asset-id>');
        process.exit(1);
      }
      removeDirtyId(id);
      console.log(`Removed: ${id}`);
    } else if (action === 'clear') {
      clearDirty();
      console.log('Cleared all dirty entries.');
    } else {
      console.error(`Unknown dirty action: ${action}`);
      console.log('Usage: pnpm gen dirty [list|add|remove|clear]');
    }
    break;
  }
  default:
    console.log('Usage: pnpm gen <build|generate|integrate|dirty|status> [targets] [flags]');
    console.log('\nSubcommands:');
    console.log('  build      [code|audio|all]');
    console.log('  generate   [code|audio|bgm|ambient|all] [--dry-run]');
    console.log('  integrate  [code|audio|bgm|ambient|all] [--dry-run]');
    console.log('  dirty      [list|add|remove|clear]  — targeted regeneration manifest');
    console.log('  status');
    process.exit(sub ? 1 : 0);
}
